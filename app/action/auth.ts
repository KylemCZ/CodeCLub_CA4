'use server'

import sql from '@/app/lib/db';
import { SignupFormSchema, FormState, LoginFormSchema, NinjaLoginFormSchema } from '@/app/lib/definitions'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation';
import { createSession } from '@/app/lib/session';
import { deleteSession } from '@/app/lib/session'

export async function signup(_state: FormState, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    dob: formData.get('dob'),
    isParent: formData.get('isParent'),
    gender: formData.get('gender'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
    }
  }

  const { name: rawName, email, password, dob, isParent, gender } = validatedFields.data
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1)
  const role = isParent ? 'guardian' : 'coder'
  const image = (formData.get('image') as string | null) || null

  try {
    // 2. Check if user exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;

    if (existingUser.length > 0) {
      return {
        errors: {
          email: ['This email is already in use.'],
        },
      };
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Insert New User
    const res = await sql`
      INSERT INTO users (name, email, password, role, dob, gender, image)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role}, ${dob}, ${gender}, ${image})
      RETURNING id
    `;

    const user = res[0];

    if (!user) {
      return { message: 'An error occurred while creating your account.' }
    }

    // 5. Create Session
    await createSession(user.id)

  } catch (error) {
    console.error(error)
    return { message: 'Database error: Could not register user.' }
  }

  // 6. Redirect 
  redirect('/technologies')
}

  // logout action
export async function logout() {
  await deleteSession()
  redirect('/technologies')
}

export async function login(_state: FormState, formData: FormData) {
  // 1. Validate fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  try {
    // 2. Fetch user from Neon by email
    const res = await sql`
      SELECT id, email, password, is_active FROM users WHERE email = ${email} LIMIT 1
    `;
    const user = res[0];

    if (!user) {
      return { message: 'Invalid credentials.' }
    }

    if (!user.is_active) {
      return { message: 'This account has been disabled.' }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return { message: 'Invalid credentials.' }
    }

    // 4. Create Session
    await createSession(user.id)

  } catch (error) {
    return { message: 'An error occurred during login.' }
  }

  // 5. Redirect
  redirect('/technologies')
}

export async function loginNinja(_state: FormState, formData: FormData) {
  const validatedFields = NinjaLoginFormSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten((issue) => issue.message).fieldErrors,
    }
  }

  const { username, password } = validatedFields.data

  try {
    const res = await sql`
      SELECT id, password, is_active FROM users WHERE username = ${username} AND role = 'ninja' LIMIT 1
    `
    const user = res[0]

    if (!user) {
      return { message: 'Invalid credentials.' }
    }

    if (!user.is_active) {
      return { message: 'This account has been disabled.' }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return { message: 'Invalid credentials.' }
    }

    await createSession(user.id)

  } catch (error) {
    return { message: 'An error occurred during login.' }
  }

  redirect('/technologies')
}
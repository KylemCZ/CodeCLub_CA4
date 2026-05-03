export type Event = {
  id: string;
  name: string;
  technologyId: string;
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  tickets: number;
};

export type Technology = {
  id: string;
  description: string;
  image: string;
  bgColor: string;
  buttonColor: string;
  sort_order: number;
  isActive: boolean;
};

export type Projects = {
  id: string;
  description: string;
  image: string;
  bgColor: string;
  buttonColor: string;
  sort_order: number;
};


import * as z from 'zod'
 
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
  dob: z
    .string()
    .refine((val) => !!val && !isNaN(Date.parse(val)), 'Please enter a valid date of birth.')
    .refine((val) => {
      const today = new Date();
      const birth = new Date(val);
      const age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      return age > 13 || (age === 13 && (m > 0 || (m === 0 && today.getDate() >= birth.getDate())));
    }, 'You must be at least 13 years old to register.'),
  isParent: z.preprocess((val) => val === 'on', z.boolean()),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], { error: 'Please select a gender.' }),
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        username?: string[]
        password?: string[]
        dob?: string[]
        gender?: string[]
      }
      message?: string
    }
  | undefined

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
}


export const LoginFormSchema = z.object({
  email: z.email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password field must not be empty.' }),
})

export const NinjaLoginFormSchema = z.object({
  username: z.string().min(3, { message: 'Please enter your username.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
})

export const NinjaFormSchema = z.object({
  name: z.string().min(2, { error: 'Name must be at least 2 characters long.' }).trim(),
  username: z.string().min(3, { error: 'Username must be at least 3 characters long.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, { error: 'Password must contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Password must contain at least one number.' }),
  dob: z
    .string()
    .refine((val) => !!val && !isNaN(Date.parse(val)), 'Please enter a valid date of birth.'),
  gender: z.enum(['male', 'female', 'other'], { error: 'Please select a gender.' }),
  image: z.string().min(1, { error: 'Please select an avatar.' }),
})
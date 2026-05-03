import { getFullUser } from "@/app/lib/dal";

function formatDate(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('en-IE', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatGender(gender: string) {
  return gender.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-cyan-800 pb-5 last:border-0 last:pb-0">
      <span className="text-emerald-400 font-semibold w-40 shrink-0">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

export default async function ProfileInfo() {
  const user = await getFullUser();
  if (!user) return null;

  return (
    <section>
      <h1 className="text-4xl font-bold text-white mb-6">
        My <span className="text-emerald-400">Profile</span>
      </h1>
      <div className="bg-cyan-950 rounded-2xl border-4 border-emerald-400 p-8 space-y-5">
        <Field label="Name"          value={capitalize(user.name)} />
        {user.role === 'ninja'
          ? <Field label="Username" value={user.username as string} />
          : <Field label="Email"    value={user.email} />
        }
        <Field label="Role"          value={capitalize(user.role)} />
        {user.dob    && <Field label="Date of Birth" value={formatDate(user.dob)} />}
        {user.gender && <Field label="Gender"        value={formatGender(user.gender)} />}
      </div>
    </section>
  );
}

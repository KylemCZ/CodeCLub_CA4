import NinjaForm from './ninja-form'

export default function AddNinjaPage() {
  return (
    <div className="w-2/3 my-8 mx-auto">
      <h1 className="text-4xl font-bold text-white mb-2">
        Add a <span className="text-emerald-400">Ninja</span>
      </h1>
      <p className="text-gray-400 mb-8">Create an account for your child to track their progress.</p>
      <NinjaForm />
    </div>
  )
}

'use client';

import { redirect } from 'next/navigation';
import { addTechnology } from '@/app/action/import';
import Link from 'next/link';

export default function AddTechPage() {
  async function handleSubmit(formData: FormData) {
    await addTechnology(formData);
      redirect('/technologies/'); //redirect back to the technology page after adding
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/technologies" className="text-blue-400 hover:text-blue-300 underline">
            ← Back to Technologies
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-white mb-8">Add New Technology</h1>

        <form action={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-lg">

          <div>
            <label htmlFor="title" className="block text-white font-semibold mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="id"
              name="id"
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="e.g., React"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-white font-semibold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="Describe the technology..."
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-white font-semibold mb-2">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="image"
              name="image"
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-4">
                Background Color <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: 'bg-glow-blue', label: 'Blue', color: 'bg-glow-blue' },
                  { value: 'bg-glow-green', label: 'Green', color: 'bg-glow-green' },
                  { value: 'bg-glow-purple', label: 'Purple', color: 'bg-glow-purple' },
                  { value: 'bg-glow-amber', label: 'Amber', color: 'bg-glow-amber' },
                  { value: 'bg-glow-red', label: 'Red', color: 'bg-glow-red' },
                  { value: 'bg-glow-pink', label: 'Pink', color: 'bg-glow-pink' },
                  { value: 'bg-glow-indigo', label: 'Indigo', color: 'bg-glow-indigo' },
                  { value: 'bg-glow-cyan', label: 'Cyan', color: 'bg-glow-cyan' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="bgColor"
                      value={option.value}
                      required
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className={`ml-3 w-6 h-6 rounded ${option.color}`} />
                    <span className="ml-2 text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-4">
                Button Color <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {[
                  { value: 'btn-glow-blue', label: 'Blue', color: 'btn-glow-blue' },
                  { value: 'btn-glow-green', label: 'Green', color: 'btn-glow-green' },
                  { value: 'btn-glow-purple', label: 'Purple', color: 'btn-glow-purple' },
                  { value: 'btn-glow-amber', label: 'Amber', color: 'btn-glow-amber' },
                  { value: 'btn-glow-red', label: 'Red', color: 'btn-glow-red' },
                  { value: 'btn-glow-pink', label: 'Pink', color: 'btn-glow-pink' },
                  { value: 'btn-glow-indigo', label: 'Indigo', color: 'btn-glow-indigo' },
                  { value: 'btn-glow-cyan', label: 'Cyan', color: 'btn-glow-cyan' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="buttonColor"
                      value={option.value}
                      required
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className={`ml-3 w-6 h-6 rounded ${option.color}`} />
                    <span className="ml-2 text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition duration-200"
          >
            Add Technology
          </button>
        </form>
      </div>
    </div>
  );
}

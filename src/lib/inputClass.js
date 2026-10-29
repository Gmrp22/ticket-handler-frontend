export const inputClass = (error) =>
  `min-h-10 w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 ${
    error ? 'border-2 border-red-700' : 'border border-gray-500'
  }`

const VARIANTS = {
  primary: 'bg-indigo-700 text-white hover:bg-indigo-800',
  secondary: 'border border-gray-500 bg-white text-gray-900 hover:bg-gray-100',
  danger: 'bg-red-700 text-white hover:bg-red-800',
  dangerOutline: 'border border-red-700 bg-white text-red-800 hover:bg-red-50',
}

const SIZES = {
  md: 'min-h-10 px-4 py-2 text-base',
  sm: 'min-h-9 px-3 py-1.5 text-sm',
}

function Button({ variant = 'secondary', size = 'md', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`rounded-md font-medium disabled:cursor-not-allowed disabled:opacity-60 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}

export default Button

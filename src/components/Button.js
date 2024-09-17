export default function Button({ onClick, children, variant = 'primary', className = '' }) {
    const baseStyles =
      'font-semibold py-2 px-4 rounded transition duration-200 focus:outline-none focus:ring-2'
    let variantStyles = ''
  
    switch (variant) {
      case 'primary':
        variantStyles =
          'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
        break
      case 'secondary':
        variantStyles =
          'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500'
        break
      case 'danger':
        variantStyles =
          'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
        break
      default:
        variantStyles =
          'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500'
    }
  
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        {children}
      </button>
    )
  }
  
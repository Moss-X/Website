const InputField = ({ id, label, type, value, onChange, icon: Icon, placeholder, required = true }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-black opacity-70 mb-2">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          className=" block w-full px-3 py-2 pl-10 border border-darkGray text-black rounded-md shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-black  focus:border-black sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default InputField

const InputField = ({ id, label, icon: Icon, required = true, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        )}
        <input id={id} name={id} required={required} className={`field h-12 ${Icon ? 'pl-11' : ''}`} {...props} />
      </div>
    </div>
  )
}

export default InputField

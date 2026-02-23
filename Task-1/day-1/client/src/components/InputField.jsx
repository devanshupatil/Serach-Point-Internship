const InputField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  name, 
  placeholder, 
  error, 
  required = false,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
          bg-white text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-0
          ${error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-200 focus:border-indigo-500'
          }
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
        `}
      />
      {error && (
        <p className="text-red-500 text-sm animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;

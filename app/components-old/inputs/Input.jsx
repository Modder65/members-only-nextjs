'use client'

import clsx from 'clsx';

const Input = ({
  label,
  id,
  type,
  validation,
  register,
  errors,
  disabled,
}) => {
  return (
    <div>
      <label 
        className="
          block
          text-base
          font-medium
          leading-6
          text-gray-900
        "
        htmlFor={id}
        >
          {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, validation)}
          className={clsx(`
            form-input
            block
            w-full
            rounded-md
            border-0
            py-1.5
            text-gray-900
            shadow-sm
            ring-1
            ring-inset
            ring-gray-300
            placeholder:text-gray-400
            focus:ring-2
            focus:ring-inset
            focus:ring-blue-600
            sm:text-sm
            sm:leading-6`, 
            errors[id] && "focus:ring-rose-500",
            disabled && "opacity-50 cursor-default"
            )}
        />
        {errors[id] && (
          <p className="text-rose-600 text-sm mt-1">
            {errors[id].message || 'Invalid input'}
          </p>
        )}
      </div>
    </div>
  );
}

export default Input;

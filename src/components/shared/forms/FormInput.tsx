import React from 'react';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  error?: string;
  helperText?: string;
  onChange: (value: string) => void;
}

export const FormInput: React.FC<Props> = ({
  label,
  error,
  helperText,
  className = '',
  onChange,
  ...props
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        className={`
          block w-full rounded-md border-0 py-2.5 px-3.5
          text-gray-900 shadow-sm ring-1 ring-inset
          ${error 
            ? 'ring-red-300 focus:ring-red-500' 
            : 'ring-gray-300 focus:ring-blue-500'
          }
          focus:ring-2 focus:ring-inset
          placeholder:text-gray-400
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
          disabled:ring-gray-200
          sm:text-sm sm:leading-6
          ${className}
        `}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

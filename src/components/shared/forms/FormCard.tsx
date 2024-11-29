import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  className?: string;
}

export const FormCard: React.FC<Props> = ({
  title,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  isSubmitting = false,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <form onSubmit={onSubmit} className="px-6 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{title}</h2>
        <div className="space-y-6">
          {children}
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
              ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
            `}
          >
            {isSubmitting ? 'Submitting...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

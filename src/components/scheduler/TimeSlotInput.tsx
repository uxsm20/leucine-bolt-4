import React from 'react';
import { TimeSlot } from '../../types/scheduler';
import { FormSelect } from '../shared/forms/FormSelect';

interface Props {
  value: TimeSlot;
  onChange: (value: TimeSlot) => void;
  onRemove?: () => void;
}

export const TimeSlotInput: React.FC<Props> = ({ value, onChange, onRemove }) => {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: i.toString().padStart(2, '0')
  }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    value: i.toString(),
    label: i.toString().padStart(2, '0')
  }));

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 grid grid-cols-2 gap-4">
        <FormSelect
          label="Hour"
          options={hours}
          value={value.hour.toString()}
          onChange={(hour) => onChange({ ...value, hour: parseInt(hour) })}
          required
        />
        <FormSelect
          label="Minute"
          options={minutes}
          value={value.minute.toString()}
          onChange={(minute) => onChange({ ...value, minute: parseInt(minute) })}
          required
        />
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-8 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Remove
        </button>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { Room } from '../types/monitoring';
import { FormCard } from './shared/forms/FormCard';
import { FormInput } from './shared/forms/FormInput';

interface Props {
  location: Room;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const SettlePlateForm: React.FC<Props> = ({ location, onSubmit, onCancel }) => {
  const [exposureStartTime, setExposureStartTime] = useState('');
  const [collectedBy, setCollectedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      locationId: location.id,
      exposureStartTime: new Date(exposureStartTime),
      collectedBy,
      status: 'active'
    });
  };

  return (
    <FormCard
      title="Start Settle Plate Monitoring"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel="Start Monitoring"
      isSubmitting={false}
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Location: {location.name}</p>
        </div>

        <FormInput
          type="datetime-local"
          label="Exposure Start Time"
          value={exposureStartTime}
          onChange={(value) => setExposureStartTime(value)}
          required
        />

        <FormInput
          label="Collected By"
          value={collectedBy}
          onChange={(value) => setCollectedBy(value)}
          required
          placeholder="Enter name"
        />
      </div>
    </FormCard>
  );
};
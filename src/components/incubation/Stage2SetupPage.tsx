import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FormCard } from '../shared/forms/FormCard';
import { FormInput } from '../shared/forms/FormInput';
import { FormSelect } from '../shared/forms/FormSelect';

interface Props {
  currentUser: { id: string; name: string; };
  onStartStage2: (incubationSessionId: string, details: any) => void;
}

export const Stage2SetupPage: React.FC<Props> = ({ currentUser, onStartStage2 }) => {
  const { incubationSessionId } = useParams();
  const navigate = useNavigate();
  const [selectedIncubator, setSelectedIncubator] = useState('');
  const [actualTemperature, setActualTemperature] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Demo incubators - in real app, this would come from backend
  const availableIncubators = [
    { id: 'INC-001', name: 'Incubator 1', currentTemp: 22.5, targetTemp: 22.0, status: 'available' },
    { id: 'INC-002', name: 'Incubator 2', currentTemp: 23.0, targetTemp: 22.0, status: 'available' },
    { id: 'INC-003', name: 'Incubator 3', currentTemp: 22.5, targetTemp: 22.0, status: 'available' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedIncubator || !actualTemperature) {
      setError('Please fill in all required fields');
      return;
    }

    const selectedIncubatorDetails = availableIncubators.find(inc => inc.id === selectedIncubator);
    if (!selectedIncubatorDetails) return;

    const stage2Details = {
      stage2StartTime: new Date(),
      stage2Incubator: selectedIncubator,
      stage2InitialTemperature: parseFloat(actualTemperature),
      stage2StartedBy: currentUser.name
    };

    onStartStage2(incubationSessionId!, stage2Details);
    navigate(`/incubation/${incubationSessionId}/monitoring/stage/2`);
  };

  const handleCancel = () => {
    navigate(`/incubation/${incubationSessionId}/monitoring/stage/1`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <FormCard
        title="Start Stage 2 Incubation (20-25°C)"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Start Stage 2"
        isSubmitting={false}
      >
        <div className="space-y-6">
          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          <FormSelect
            label="Select Incubator"
            value={selectedIncubator}
            onChange={(value) => setSelectedIncubator(value)}
            options={availableIncubators.map(inc => ({
              value: inc.id,
              label: `${inc.name} (Current: ${inc.currentTemp}°C, Target: ${inc.targetTemp}°C)`
            }))}
            placeholder="Choose an incubator"
            required
          />

          <FormInput
            type="number"
            label="Actual Temperature (°C)"
            value={actualTemperature}
            onChange={(value) => setActualTemperature(value)}
            required
            min="20"
            max="25"
            step="0.1"
            helperText="Temperature should be between 20°C and 25°C"
          />

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Started By</p>
            <p className="text-sm text-gray-500">{currentUser.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">Start Time</p>
            <p className="text-sm text-gray-500">{format(new Date(), 'PPpp')}</p>
          </div>
        </div>
      </FormCard>
    </div>
  );
};
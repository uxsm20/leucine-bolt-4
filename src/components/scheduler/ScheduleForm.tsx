import React, { useState } from 'react';
import { TimeSlotInput } from './TimeSlotInput';
import { TimeSlot } from '../../types/scheduler';
import { MonitoringSchedule, ProductionArea, Room, SamplingPoint } from '../../types/monitoring';
import { DEMO_PRODUCTS, DEMO_BATCHES } from '../../data/demo';
import { FormSelect } from '../shared/forms/FormSelect';
import { FormCheckboxGroup } from '../shared/forms/FormCheckboxGroup';
import { FormInput } from '../shared/forms/FormInput';
import { FormCard } from '../shared/forms/FormCard';

interface Props {
  areas: ProductionArea[];
  rooms: Room[];
  samplingPoints: SamplingPoint[];
  onSubmit: (data: MonitoringSchedule) => void;
  onCancel: () => void;
}

export const ScheduleForm: React.FC<Props> = ({
  areas,
  rooms,
  samplingPoints,
  onSubmit,
  onCancel,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [toleranceValue, setToleranceValue] = useState('15');
  const [toleranceUnit, setToleranceUnit] = useState<'minutes' | 'hours' | 'days'>('minutes');
  const [startDate, setStartDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ hour: 9, minute: 0 }]);
  const [activityStatus, setActivityStatus] = useState<'production-ongoing' | 'idle'>('idle');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRooms = rooms.filter(room => room.areaId === selectedArea);
  const filteredPoints = samplingPoints.filter(point => selectedRooms.includes(point.roomId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const schedule: MonitoringSchedule = {
        id: `SCH-${Date.now()}`,
        monitoringType: 'settle-plate',
        samplingPoints: selectedPoints,
        frequency,
        tolerance: {
          value: parseInt(toleranceValue),
          unit: toleranceUnit
        },
        startDate: new Date(startDate),
        timeSlots,
        assignedPersonnel: [],
        status: 'active',
        activityStatus: activityStatus === 'production-ongoing' 
          ? { type: 'production-ongoing', batchId: selectedBatch }
          : { type: 'idle' },
        nextSession: new Date(startDate)
      };
      
      await onSubmit(schedule);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Create Monitoring Schedule"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel="Create Schedule"
      isSubmitting={isSubmitting}
    >
      <FormSelect
        label="Production Area"
        options={areas.map(area => ({ value: area.id, label: area.name }))}
        value={selectedArea}
        onChange={setSelectedArea}
        helperText={areas.length === 0 ? "No production areas available" : undefined}
        required
      />

      <FormCheckboxGroup
        label="Rooms"
        options={filteredRooms.map(room => ({ value: room.id, label: room.name }))}
        selectedValues={selectedRooms}
        onChange={setSelectedRooms}
        helperText={selectedArea && filteredRooms.length === 0 ? "No rooms available for selected area" : undefined}
      />

      <FormCheckboxGroup
        label="Sampling Points"
        options={filteredPoints.map(point => ({ value: point.id, label: point.name }))}
        selectedValues={selectedPoints}
        onChange={setSelectedPoints}
        helperText={selectedRooms.length > 0 && filteredPoints.length === 0 ? "No sampling points available for selected rooms" : undefined}
      />

      <FormSelect
        label="Frequency"
        options={[
          { value: 'hourly', label: 'Hourly' },
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' }
        ]}
        value={frequency}
        onChange={(value) => setFrequency(value as 'hourly' | 'daily' | 'weekly' | 'monthly')}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Tolerance Value"
          type="number"
          min="1"
          value={toleranceValue}
          onChange={setToleranceValue}
          required
        />

        <FormSelect
          label="Tolerance Unit"
          options={[
            { value: 'minutes', label: 'Minutes' },
            { value: 'hours', label: 'Hours' },
            { value: 'days', label: 'Days' }
          ]}
          value={toleranceUnit}
          onChange={(value) => setToleranceUnit(value as 'minutes' | 'hours' | 'days')}
          required
        />
      </div>

      <FormInput
        label="Start Date"
        type="date"
        value={startDate}
        onChange={setStartDate}
        required
      />

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">Time Slots</label>
        {timeSlots.map((slot, index) => (
          <TimeSlotInput
            key={index}
            value={slot}
            onChange={(newSlot) => {
              const newSlots = [...timeSlots];
              newSlots[index] = newSlot;
              setTimeSlots(newSlots);
            }}
            onRemove={() => {
              if (timeSlots.length > 1) {
                setTimeSlots(timeSlots.filter((_, i) => i !== index));
              }
            }}
          />
        ))}
        <button
          type="button"
          onClick={() => setTimeSlots([...timeSlots, { hour: 9, minute: 0 }])}
          className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Time Slot
        </button>
      </div>

      <FormSelect
        label="Activity Status"
        options={[
          { value: 'production-ongoing', label: 'Production Ongoing' },
          { value: 'idle', label: 'Idle' }
        ]}
        value={activityStatus}
        onChange={(value) => setActivityStatus(value as 'production-ongoing' | 'idle')}
      />

      {activityStatus === 'production-ongoing' && (
        <FormSelect
          label="Batch"
          options={DEMO_BATCHES.map(batch => ({
            value: batch.id,
            label: `${batch.number} (${DEMO_PRODUCTS.find(p => p.id === batch.productId)?.name})`
          }))}
          value={selectedBatch}
          onChange={setSelectedBatch}
          helperText="Select the batch currently in production"
        />
      )}
    </FormCard>
  );
};
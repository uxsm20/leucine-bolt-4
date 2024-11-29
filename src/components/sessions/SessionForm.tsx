import React, { useState } from 'react';
import { MonitoringSession, ProductionArea, Room, SamplingPoint } from '../../types/monitoring';
import { DEMO_PRODUCTS, DEMO_BATCHES } from '../../data/demo';
import { FormSelect } from '../shared/forms/FormSelect';
import { FormCheckboxGroup } from '../shared/forms/FormCheckboxGroup';
import { FormInput } from '../shared/forms/FormInput';
import { FormCard } from '../shared/forms/FormCard';

interface Props {
  areas: ProductionArea[];
  rooms: Room[];
  samplingPoints: SamplingPoint[];
  onSubmit: (data: Partial<MonitoringSession>) => void;
  onCancel: () => void;
}

export const SessionForm: React.FC<Props> = ({
  areas,
  rooms,
  samplingPoints,
  onSubmit,
  onCancel,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [activityStatus, setActivityStatus] = useState<'production-ongoing' | 'idle'>('idle');
  const [selectedBatch, setSelectedBatch] = useState<string>('');

  const filteredRooms = rooms.filter(room => room.areaId === selectedArea);
  const filteredPoints = samplingPoints.filter(point => selectedRooms.includes(point.roomId));

  const selectedBatchDetails = DEMO_BATCHES.find(b => b.id === selectedBatch);
  const selectedProduct = selectedBatchDetails 
    ? DEMO_PRODUCTS.find(p => p.id === selectedBatchDetails.productId)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionData: Partial<MonitoringSession> = {
      samplingPoints: selectedPoints,
      scheduledTime: new Date(scheduledTime),
      activityStatus: activityStatus === 'production-ongoing' 
        ? { type: 'production-ongoing', batchId: selectedBatch }
        : { type: 'idle' }
    };
    onSubmit(sessionData);
  };

  return (
    <FormCard
      title="Create Manual Session"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel="Create Session"
      isSubmitting={false}
    >
      <div className="space-y-6">
        <FormSelect
          label="Production Area"
          value={selectedArea}
          onChange={(value: string) => {
            setSelectedArea(value);
            setSelectedRooms([]);
            setSelectedPoints([]);
          }}
          options={areas.map(area => ({
            value: area.id,
            label: area.name
          }))}
          placeholder="Select production area"
        />

        <FormCheckboxGroup
          label="Rooms"
          options={filteredRooms.map(room => ({
            value: room.id,
            label: room.name
          }))}
          selectedValues={selectedRooms}
          onChange={setSelectedRooms}
          helperText={!selectedArea ? "Select a production area first" : undefined}
        />

        <FormCheckboxGroup
          label="Sampling Points"
          options={filteredPoints.map(point => ({
            value: point.id,
            label: point.name
          }))}
          selectedValues={selectedPoints}
          onChange={setSelectedPoints}
          helperText={!selectedRooms.length ? "Select at least one room first" : undefined}
        />

        <FormInput
          type="datetime-local"
          label="Scheduled Time"
          value={scheduledTime}
          onChange={(value: string) => setScheduledTime(value)}
          required
        />

        <FormSelect
          label="Activity Status"
          value={activityStatus}
          onChange={(value: string) => setActivityStatus(value as 'production-ongoing' | 'idle')}
          options={[
            { value: 'idle', label: 'Idle' },
            { value: 'production-ongoing', label: 'Production Ongoing' }
          ]}
        />

        {activityStatus === 'production-ongoing' && (
          <FormSelect
            label="Batch"
            value={selectedBatch}
            onChange={(value: string) => setSelectedBatch(value)}
            options={DEMO_BATCHES.map(batch => ({
              value: batch.id,
              label: `${batch.number} (${DEMO_PRODUCTS.find(p => p.id === batch.productId)?.name})`
            }))}
            placeholder="Select batch"
            helperText={selectedBatchDetails ? `Product: ${selectedProduct?.name}` : undefined}
          />
        )}
      </div>
    </FormCard>
  );
};
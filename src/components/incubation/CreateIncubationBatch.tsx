import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MonitoringSession } from '../../types/monitoring';
import { FormCard } from '../shared/forms/FormCard';
import { FormSelect } from '../shared/forms/FormSelect';
import { FormCheckboxGroup } from '../shared/forms/FormCheckboxGroup';

interface Props {
  sessions: MonitoringSession[];
  onCreateBatch: (sessionIds: string[]) => string;
}

export const CreateIncubationBatch: React.FC<Props> = ({ sessions, onCreateBatch }) => {
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState<'TSA' | 'SDA'>('TSA');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  // Get sessions with plates ready for incubation for selected media type
  const availableSessions = sessions.filter(session => {
    const hasCompletedExposures = session.exposures?.some(exp => 
      (exp.endTime || exp.earlyEndReason) && !exp.skipped && !exp.damaged
    );
    const hasNegativeControls = session.startDetails?.mediaDetails?.plates?.negativeControl?.length ?? 0 > 0;
    const notStartedIncubation = !session.incubation;
    const matchesMediaType = session.startDetails?.mediaDetails?.lotNumber?.startsWith(mediaType);
    
    return hasCompletedExposures && hasNegativeControls && notStartedIncubation && matchesMediaType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSessions.length === 0) return;
    
    // Create the batch and get its ID
    const batchId = onCreateBatch(selectedSessions);
    
    // Navigate to incubator assignment page with the new batch ID
    navigate(`/incubation/${batchId}/assign-incubator`);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const getIncubationConditions = (type: 'TSA' | 'SDA') => {
    return type === 'TSA' 
      ? { temp: '30-35°C', duration: '48-72 hours' }
      : { temp: '20-25°C', duration: '5-7 days' };
  };

  const conditions = getIncubationConditions(mediaType);

  return (
    <div className="max-w-3xl mx-auto">
      <FormCard
        title="Create New Incubation Batch"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Create Batch"
        isSubmitting={false}
      >
        <div className="space-y-6">
          <FormSelect
            label="Media Type"
            value={mediaType}
            onChange={(value) => {
              setMediaType(value as 'TSA' | 'SDA');
              setSelectedSessions([]);
            }}
            options={[
              { value: 'TSA', label: 'Tryptic Soy Agar (TSA)' },
              { value: 'SDA', label: 'Sabouraud Dextrose Agar (SDA)' }
            ]}
            required
          />

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Incubation Conditions</h3>
            <ul className="text-sm text-blue-700">
              <li>Temperature Range: {conditions.temp}</li>
              <li>Duration: {conditions.duration}</li>
            </ul>
          </div>

          {availableSessions.length > 0 ? (
            <FormCheckboxGroup
              label="Select Sessions"
              options={availableSessions.map(session => {
                const completedPlates = session.exposures?.filter(exp => 
                  (exp.endTime || exp.earlyEndReason) && !exp.skipped && !exp.damaged
                ).length || 0;
                const negativeControls = session.startDetails?.mediaDetails?.plates?.negativeControl?.length || 0;

                return {
                  value: session.id,
                  label: `Session ${session.id} - ${completedPlates} plates, ${negativeControls} controls`
                };
              })}
              selectedValues={selectedSessions}
              onChange={setSelectedSessions}
              helperText={`${availableSessions.length} sessions available for incubation`}
            />
          ) : (
            <div className="text-sm text-gray-500 italic">
              No sessions available for incubation with selected media type
            </div>
          )}
        </div>
      </FormCard>
    </div>
  );
};
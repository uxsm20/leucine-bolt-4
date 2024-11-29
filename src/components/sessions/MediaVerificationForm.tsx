import React, { useState } from 'react';
import { MediaVerification } from '../../types/monitoring';
import { FormCard } from '../shared/forms/FormCard';
import { FormInput } from '../shared/forms/FormInput';
import { FormCheckboxGroup } from '../shared/forms/FormCheckboxGroup';

interface Props {
  onVerify: (verification: MediaVerification) => void;
  onCancel: () => void;
  lotNumber: string;
  expiryDate: Date;
}

export const MediaVerificationForm: React.FC<Props> = ({
  onVerify,
  onCancel,
  lotNumber,
  expiryDate
}) => {
  const [gptPassed, setGptPassed] = useState(false);
  const [gptDate, setGptDate] = useState('');
  const [sterilityPassed, setSterilityPassed] = useState(false);
  const [sterilityDate, setSterilityDate] = useState('');
  const [trypticSoyAgar, setTrypticSoyAgar] = useState(false);
  const [sabouraudDextroseAgar, setSabouraudDextroseAgar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const verification: MediaVerification = {
      lotNumber,
      expiryDate,
      gptPassed,
      gptDate: new Date(gptDate),
      sterilityPassed,
      sterilityDate: new Date(sterilityDate),
      growthPromotionResults: {
        trypticSoyAgar,
        sabouraudDextroseAgar
      }
    };

    onVerify(verification);
  };

  return (
    <FormCard
      title="Media Verification"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel="Verify Media"
      isSubmitting={false}
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Lot Number: {lotNumber}</p>
          <p className="text-sm text-gray-500">Expiry Date: {expiryDate.toLocaleDateString()}</p>
        </div>

        <div className="space-y-4">
          <FormCheckboxGroup
            label="Growth Promotion Test"
            options={[{ value: 'gpt', label: 'Test Passed' }]}
            selectedValues={gptPassed ? ['gpt'] : []}
            onChange={(values) => setGptPassed(values.includes('gpt'))}
          />

          {gptPassed && (
            <FormInput
              type="date"
              label="Test Date"
              value={gptDate}
              onChange={(value) => setGptDate(value)}
              required
            />
          )}
        </div>

        <div className="space-y-4">
          <FormCheckboxGroup
            label="Sterility Test"
            options={[{ value: 'sterility', label: 'Test Passed' }]}
            selectedValues={sterilityPassed ? ['sterility'] : []}
            onChange={(values) => setSterilityPassed(values.includes('sterility'))}
          />

          {sterilityPassed && (
            <FormInput
              type="date"
              label="Test Date"
              value={sterilityDate}
              onChange={(value) => setSterilityDate(value)}
              required
            />
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Growth Promotion Results</h4>
          <FormCheckboxGroup
            label="Media Types"
            options={[
              { value: 'tsa', label: 'Tryptic Soy Agar' },
              { value: 'sda', label: 'Sabouraud Dextrose Agar' }
            ]}
            selectedValues={[
              ...(trypticSoyAgar ? ['tsa'] : []),
              ...(sabouraudDextroseAgar ? ['sda'] : [])
            ]}
            onChange={(values) => {
              setTrypticSoyAgar(values.includes('tsa'));
              setSabouraudDextroseAgar(values.includes('sda'));
            }}
          />
        </div>
      </div>
    </FormCard>
  );
};
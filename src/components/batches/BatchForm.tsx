import React, { useState } from 'react';
import { FormCard } from '../shared/forms/FormCard';
import { FormInput } from '../shared/forms/FormInput';
import { FormSelect } from '../shared/forms/FormSelect';
import { DEMO_PRODUCTS } from '../../data/demo';

interface Props {
  onSubmit: (data: {
    number: string;
    productId: string;
    startDate: Date;
    endDate: Date;
  }) => void;
  onCancel: () => void;
}

export const BatchForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [batchNumber, setBatchNumber] = useState('');
  const [productId, setProductId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      number: batchNumber,
      productId,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });
  };

  const isStartDateValid = startDate !== '';
  const isEndDateValid = endDate !== '' && new Date(endDate) > new Date(startDate);

  return (
    <FormCard
      title="Create Batch"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel="Create Batch"
      isSubmitting={false}
    >
      <div className="space-y-6">
        <FormInput
          label="Batch Number"
          value={batchNumber}
          onChange={(value: string) => setBatchNumber(value)}
          required
          placeholder="Enter batch number"
        />

        <FormSelect
          label="Product"
          value={productId}
          onChange={(value: string) => setProductId(value)}
          options={DEMO_PRODUCTS.map(product => ({
            value: product.id,
            label: product.name
          }))}
          placeholder="Select product"
        />

        <FormInput
          type="datetime-local"
          label="Start Date"
          value={startDate}
          onChange={(value: string) => setStartDate(value)}
          required
        />

        <FormInput
          type="datetime-local"
          label="End Date"
          value={endDate}
          onChange={(value: string) => setEndDate(value)}
          required
          error={!isEndDateValid && endDate !== '' ? "End date must be after start date" : undefined}
          helperText={!isStartDateValid ? "Set start date first" : undefined}
        />
      </div>
    </FormCard>
  );
};

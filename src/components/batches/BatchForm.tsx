import React, { useState } from 'react';
import { FormSelect } from '../shared/forms/FormSelect';
import { FormInput } from '../shared/forms/FormInput';
import { FormCard } from '../shared/forms/FormCard';
import { DEMO_PRODUCTS } from '../../data/demo';

interface Props {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const BatchForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [productId, setProductId] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const batchData = {
      productId,
      number: batchNumber,
      startDate: new Date(startDate),
      expectedEndDate: new Date(expectedEndDate),
      status: 'in-progress'
    };
    onSubmit(batchData);
  };

  return (
    <FormCard
      title="Create New Batch"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitDisabled={!productId || !batchNumber || !startDate || !expectedEndDate}
    >
      <div className="space-y-6">
        <FormSelect
          label="Product"
          value={productId}
          onChange={setProductId}
          options={DEMO_PRODUCTS.map(product => ({
            value: product.id,
            label: product.name
          }))}
          placeholder="Select product"
        />

        <FormInput
          label="Batch Number"
          value={batchNumber}
          onChange={e => setBatchNumber(e.target.value)}
          placeholder="Enter batch number"
          required
        />

        <FormInput
          type="datetime-local"
          label="Start Date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
        />

        <FormInput
          type="datetime-local"
          label="Expected End Date"
          value={expectedEndDate}
          onChange={e => setExpectedEndDate(e.target.value)}
          required
          helperText={startDate && expectedEndDate && new Date(expectedEndDate) <= new Date(startDate) ? 
            "End date must be after start date" : undefined}
        />
      </div>
    </FormCard>
  );
};

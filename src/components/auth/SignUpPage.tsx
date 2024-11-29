import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormCard } from '../shared/forms/FormCard';
import { FormInput } from '../shared/forms/FormInput';
import { FormSelect } from '../shared/forms/FormSelect';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/signin');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/signin');
  };

  const roles = [
    { value: 'operator', label: 'Operator' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Administrator' }
  ];

  const departments = [
    { value: 'production', label: 'Production' },
    { value: 'quality', label: 'Quality Control' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'rd', label: 'R&D' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Settle Plate Monitoring
        </h1>
        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <FormCard
          title=""
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Sign Up"
          isSubmitting={isLoading}
        >
          <div className="space-y-6">
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                required
                placeholder="Enter first name"
              />

              <FormInput
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                required
                placeholder="Enter last name"
              />
            </div>

            <FormInput
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange('email')}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />

            <FormInput
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange('password')}
              required
              placeholder="Enter password"
              autoComplete="new-password"
            />

            <FormInput
              type="password"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              placeholder="Confirm password"
              autoComplete="new-password"
              error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined}
            />

            <FormSelect
              label="Role"
              value={formData.role}
              onChange={handleChange('role')}
              options={roles}
              placeholder="Select your role"
              required
            />

            <FormSelect
              label="Department"
              value={formData.department}
              onChange={handleChange('department')}
              options={departments}
              placeholder="Select your department"
              required
            />

            <div>
              <Link
                to="/signin"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </FormCard>
      </div>
    </div>
  );
};
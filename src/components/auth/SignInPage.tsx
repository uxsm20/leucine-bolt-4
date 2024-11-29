import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormCard } from '../shared/forms/FormCard';
import { FormInput } from '../shared/forms/FormInput';

interface Props {
  onLogin: () => void;
}

export const SignInPage: React.FC<Props> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Demo login - accept any email/password
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      onLogin();
      navigate('/');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Settle Plate Monitoring
        </h1>
        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Demo Mode: Enter any email and password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <FormCard
          title=""
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Sign In"
          isSubmitting={isLoading}
        >
          <div className="space-y-6">
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <FormInput
              type="email"
              label="Email Address"
              value={email}
              onChange={(value) => setEmail(value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />

            <FormInput
              type="password"
              label="Password"
              value={password}
              onChange={(value) => setPassword(value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <div>
              <Link
                to="/signup"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </div>
        </FormCard>
      </div>
    </div>
  );
};
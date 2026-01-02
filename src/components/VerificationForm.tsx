'use client';

import { useState, useEffect } from 'react';

interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
}

interface Veteran {
  id: number;
  display_name: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  status: string;
  branch_of_service: string;
  discharge_date: string;
}

interface VerificationFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
  isLoading: boolean;
}

export default function VerificationForm({ fields, onSubmit, isLoading }: VerificationFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [veterans, setVeterans] = useState<Veteran[]>([]);
  const [loadingVeterans, setLoadingVeterans] = useState(false);
  const [showAutoFill, setShowAutoFill] = useState(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState(false);

  // Fetch veterans for auto-fill
  useEffect(() => {
    const fetchVeterans = async () => {
      setLoadingVeterans(true);
      try {
        const response = await fetch('/api/veterans');
        if (response.ok) {
          const data = await response.json();
          setVeterans(data);
        }
      } catch (error) {
        console.error('Failed to fetch veterans:', error);
      } finally {
        setLoadingVeterans(false);
      }
    };

    fetchVeterans();
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAutoFillClick = (veteran: Veteran) => {
    setAutoFillSuccess(false);
    
    const newFormData = {
      status: veteran.status,
      branch_of_service: veteran.branch_of_service,
      first_name: veteran.first_name,
      last_name: veteran.last_name,
      date_of_birth: veteran.date_of_birth,
      discharge_date: veteran.discharge_date,
      email: '',
    };
    
    setFormData(newFormData);
    setErrors({});
    setAutoFillSuccess(true);
    setShowAutoFill(false);
    
    // Hide success message after 3 seconds
    setTimeout(() => setAutoFillSuccess(false), 3000);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="mb-5">
            <label className="label">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <select
                className="select-field pr-10"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              >
                <option value="">Select {field.label.toLowerCase()}</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {field.hint && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">{field.hint}</p>
            )}
            {errors[field.name] && <p className="error-text">{errors[field.name]}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className="mb-5">
            <label className="label">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              className="input-field"
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
            {field.hint && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">{field.hint}</p>
            )}
            {errors[field.name] && <p className="error-text">{errors[field.name]}</p>}
          </div>
        );

      case 'email':
        return (
          <div key={field.name} className="mb-5">
            <label className="label">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="email"
              className="input-field"
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
            {field.hint && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">{field.hint}</p>
            )}
            {errors[field.name] && <p className="error-text">{errors[field.name]}</p>}
          </div>
        );

      default:
        return (
          <div key={field.name} className="mb-5">
            <label className="label">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              className="input-field"
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
            {field.hint && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">{field.hint}</p>
            )}
            {errors[field.name] && <p className="error-text">{errors[field.name]}</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Auto-Fill Section */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-semibold text-primary-700 dark:text-primary-300">Quick Auto-Fill</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAutoFill(!showAutoFill)}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            {showAutoFill ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {autoFillSuccess && (
          <div className="mb-3 flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Form auto-filled successfully!</span>
          </div>
        )}
        
        {showAutoFill && (
          <div className="mt-3">
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
              Click on a veteran profile to auto-fill the form:
            </p>
            {loadingVeterans ? (
              <p className="text-xs text-secondary-500">Loading veteran profiles...</p>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {veterans.map(veteran => (
                  <button
                    key={veteran.id}
                    type="button"
                    onClick={() => handleAutoFillClick(veteran)}
                    className="w-full text-left p-3 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-200 group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-secondary-800 dark:text-secondary-200 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                          {veteran.first_name} {veteran.last_name}
                        </p>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          {veteran.branch_of_service} • {veteran.status}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-secondary-400 group-hover:text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
          <span className="text-red-500">*</span> Required information
        </p>
        
        {fields.map(field => renderField(field))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </span>
        ) : (
          'Verify My Eligibility'
        )}
      </button>

      {/* Privacy Notice */}
      <p className="text-xs text-center text-secondary-500 dark:text-secondary-400">
        By submitting the personal information above, I acknowledge that my personal information 
        is being collected under the <a href="/privacy" className="text-primary-600 hover:underline">privacy policy</a> and 
        will be securely processed for verification purposes only.
      </p>
    </form>
  );
}

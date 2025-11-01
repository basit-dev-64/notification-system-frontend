'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { NotificationType } from '@/types';

export default function CreateNotificationPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    type: NotificationType.EMAIL,
    recipients: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const recipientsArray = formData.recipients
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    if (recipientsArray.length === 0) {
      setError('At least one recipient is required');
      setLoading(false);
      return;
    }

    try {
      await apiClient.createNotification({
        type: formData.type,
        recipients: recipientsArray,
        subject: formData.subject,
        message: formData.message,
      });
      router.push('/notifications');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Notification</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required
          >
            <option value={NotificationType.EMAIL}>Email</option>
            <option value={NotificationType.SMS}>SMS</option>
            <option value={NotificationType.PUSH}>Push</option>
          </select>
        </div>

        <div>
          <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
            Recipients (comma-separated)
          </label>
          <input
            id="recipients"
            name="recipients"
            type="text"
            value={formData.recipients}
            onChange={handleChange}
            placeholder="email@example.com, phone@example.com"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Separate multiple recipients with commas
          </p>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Notification'}
          </button>
        </div>
      </form>
    </div>
  );
}


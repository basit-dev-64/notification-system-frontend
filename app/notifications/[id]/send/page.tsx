'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Notification } from '@/types';

export default function SendNotificationPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const notificationId = params.id as string;

  const [notification, setNotification] = useState<Notification | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [sendImmediately, setSendImmediately] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && notificationId) {
      loadNotification();
    }
  }, [authLoading, isAuthenticated, notificationId, router]);

  const loadNotification = async () => {
    try {
      setFetching(true);
      const data = await apiClient.getNotification(notificationId);
      setNotification(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load notification');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        notificationId,
        ...(sendImmediately ? {} : { scheduledAt: new Date(scheduledAt).toISOString() }),
      };

      await apiClient.sendNotification(payload);
      alert(sendImmediately ? 'Notification sent successfully!' : 'Notification scheduled successfully!');
      router.push('/notifications');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send/schedule notification');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          {error || 'Notification not found'}
        </div>
      </div>
    );
  }

  // Set minimum datetime to current time
  const minDateTime = new Date().toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Send Notification</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{notification.subject}</h2>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Type:</span> {notification.type.toUpperCase()}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Recipients:</span> {notification.recipients.join(', ')}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Message:</span> {notification.message}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            {error}
          </div>
        )}

        <div>
          <label className="flex items-center">
            <input
              type="radio"
              checked={sendImmediately}
              onChange={() => setSendImmediately(true)}
              className="form-radio h-4 w-4 text-primary-600"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Send immediately</span>
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="radio"
              checked={!sendImmediately}
              onChange={() => setSendImmediately(false)}
              className="form-radio h-4 w-4 text-primary-600"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Schedule for later</span>
          </label>
        </div>

        {!sendImmediately && (
          <div>
            <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
              Scheduled Date & Time
            </label>
            <input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              min={minDateTime}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              required={!sendImmediately}
            />
            <p className="mt-1 text-sm text-gray-500">
              Select a date and time in the future
            </p>
          </div>
        )}

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
            {loading
              ? sendImmediately
                ? 'Sending...'
                : 'Scheduling...'
              : sendImmediately
              ? 'Send Now'
              : 'Schedule Notification'}
          </button>
        </div>
      </form>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { NotificationLog, NotificationStatus } from '@/types';

export default function LogsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [filter, setFilter] = useState<NotificationStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadLogs();
    }
  }, [authLoading, isAuthenticated, filter, router]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getNotificationLogs(filter || undefined);
      setLogs(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load notification logs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.SENT:
        return 'bg-green-100 text-green-800';
      case NotificationStatus.FAILED:
        return 'bg-red-100 text-red-800';
      case NotificationStatus.SCHEDULED:
        return 'bg-yellow-100 text-yellow-800';
      case NotificationStatus.PENDING:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (authLoading || loading) {
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notification Logs</h1>
        <div className="flex items-center space-x-2">
          <label htmlFor="filter" className="text-sm font-medium text-gray-700">
            Filter by status:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value as NotificationStatus | '')}
            className="px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="">All</option>
            <option value={NotificationStatus.PENDING}>Pending</option>
            <option value={NotificationStatus.SENT}>Sent</option>
            <option value={NotificationStatus.SCHEDULED}>Scheduled</option>
            <option value={NotificationStatus.FAILED}>Failed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {logs.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No notification logs found.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {logs.map((log) => (
              <li key={log._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(log.status)}`}>
                        {log.status.toUpperCase()}
                      </span>
                      <p className="ml-4 text-sm text-gray-600">
                        Notification ID: <span className="font-mono text-xs">{log.notificationId}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Scheduled At:</span>{' '}
                      <span className="text-gray-600">{formatDate(log.scheduledAt)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Sent At:</span>{' '}
                      <span className="text-gray-600">{formatDate(log.sentAt)}</span>
                    </div>
                    {log.messageId && (
                      <div>
                        <span className="font-medium text-gray-700">Message ID:</span>{' '}
                        <span className="text-gray-600 font-mono text-xs">{log.messageId}</span>
                      </div>
                    )}
                    {log.errorMessage && (
                      <div className="col-span-2">
                        <span className="font-medium text-red-700">Error:</span>{' '}
                        <span className="text-red-600">{log.errorMessage}</span>
                      </div>
                    )}
                    {log.createdAt && (
                      <div>
                        <span className="font-medium text-gray-700">Created:</span>{' '}
                        <span className="text-gray-600">{formatDate(log.createdAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Notification, NotificationType } from '@/types';
import Link from 'next/link';

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      loadNotifications();
    }
  }, [authLoading, isAuthenticated, router]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getNotifications();
      setNotifications(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      await apiClient.deleteNotification(id);
      loadNotifications();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to delete notification');
    }
  };

  const handleSend = async (id: string) => {
    try {
      await apiClient.sendNotification({ notificationId: id });
      alert('Notification sent successfully!');
      loadNotifications();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to send notification');
    }
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

  const getTypeBadgeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.EMAIL:
        return 'bg-blue-100 text-blue-800';
      case NotificationType.SMS:
        return 'bg-green-100 text-green-800';
      case NotificationType.PUSH:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <Link
          href="/notifications/create"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Create Notification
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No notifications found. Create your first notification!</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {notifications.length > 0 && notifications.map((notification) => (
              <li key={notification._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(notification.type)}`}>
                        {notification.type.toUpperCase()}
                      </span>
                      <p className="ml-4 text-sm font-medium text-gray-900">{notification.subject}</p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleSend(notification._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Send Now
                      </button>
                      <Link
                        href={`/notifications/${notification._id}/send`}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs font-medium inline-block"
                      >
                        Schedule
                      </Link>
                      <Link
                        href={`/notifications/${notification._id}/edit`}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-xs font-medium inline-block"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Recipients: {notification.recipients.join(', ')}
                    </p>
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


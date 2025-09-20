import React, { useState, useEffect } from 'react';
import { User, Event } from '../types';
import { getUsers, getEvents, getUserActivities, updateUser, deleteUser } from '../services/firebaseFirestore';
import { logger } from '../utils/logger';
import { Modal, TextInput, Textarea, Button, Group, Stack, Alert, Badge } from '@mantine/core';

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: 'login' | 'register' | 'create_event' | 'join_event' | 'view_page';
  timestamp: Date;
  details?: string;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  userAgent: string;
  ip?: string;
  action: string;
  details: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    interests: [] as string[],
    isAdmin: false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, eventsData, activitiesData] = await Promise.all([
        getUsers(),
        getEvents(),
        getUserActivities()
      ]);
      setUsers(usersData);
      setEvents(eventsData);
      setActivities(activitiesData);
      
      // Gerçek logları yükle
      const realLogs = logger.getLogs();
      setLogs(realLogs);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      bio: user.bio || '',
      location: user.location || '',
      interests: user.interests || [],
      isAdmin: user.isAdmin || false
    });
    setShowUserModal(true);
    setError('');
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    
    setSaving(true);
    setError('');
    
    try {
      const success = await updateUser(editingUser.id, {
        name: userForm.name,
        email: userForm.email,
        bio: userForm.bio,
        location: userForm.location,
        interests: userForm.interests,
        isAdmin: userForm.isAdmin
      });
      
      if (success) {
        setShowUserModal(false);
        setEditingUser(null);
        await loadData(); // Verileri yenile
      } else {
        setError('Kullanıcı güncellenirken hata oluştu');
      }
    } catch (err) {
      setError('Kullanıcı güncellenirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        const success = await deleteUser(userId);
        if (success) {
          await loadData(); // Verileri yenile
        }
      } catch (err) {
        console.error('Kullanıcı silinirken hata:', err);
      }
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'login': return '🔐';
      case 'register': return '👤';
      case 'create_event': return '📅';
      case 'join_event': return '✅';
      default: return '📝';
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'login': return 'text-green-600';
      case 'register': return 'text-blue-600';
      case 'create_event': return 'text-purple-600';
      case 'join_event': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Kullanıcı aktiviteleri ve sistem istatistikleri</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Etkinlik</p>
                <p className="text-2xl font-semibold text-gray-900">{events.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bugünkü Aktivite</p>
                <p className="text-2xl font-semibold text-gray-900">{activities.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real User Logs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Gerçek Kullanıcı Logları</h2>
            <p className="text-sm text-gray-600">Dışarıdan giriş yapan kullanıcıların aktiviteleri</p>
          </div>
          <div className="divide-y divide-gray-200">
            {logs.length > 0 ? (
              logs.slice(0, 10).map((log) => (
                <div key={log.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600">{log.details}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {log.userAgent.split(' ')[0]} - {log.timestamp.toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {log.timestamp.toLocaleTimeString('tr-TR')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>Henüz gerçek kullanıcı aktivitesi yok</p>
                <p className="text-sm mt-1">Kullanıcılar giriş yaptıkça burada görünecek</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mock Aktiviteler</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span className="text-2xl">{getActivityIcon(activity.action)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.userName}
                  </p>
                  <p className={`text-sm ${getActivityColor(activity.action)}`}>
                    {activity.details}
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {activity.timestamp.toLocaleString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Kullanıcılar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arkadaş Sayısı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar}
                          alt={user.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.location || 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.friends?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.isAdmin ? (
                        <Badge color="red" size="sm">Admin</Badge>
                      ) : (
                        <Badge color="gray" size="sm">Kullanıcı</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Group gap="xs">
                        <Button
                          size="xs"
                          variant="light"
                          color="blue"
                          onClick={() => handleEditUser(user)}
                        >
                          Düzenle
                        </Button>
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Sil
                        </Button>
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Kullanıcı Düzenleme Modal */}
      <Modal
        opened={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Kullanıcı Düzenle"
        size="md"
      >
        <Stack>
          {error && (
            <Alert color="red" title="Hata">
              {error}
            </Alert>
          )}

          <TextInput
            label="Ad Soyad"
            value={userForm.name}
            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
            required
          />

          <TextInput
            label="Email"
            value={userForm.email}
            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            required
            type="email"
          />

          <TextInput
            label="Konum"
            value={userForm.location}
            onChange={(e) => setUserForm({ ...userForm, location: e.target.value })}
          />

          <Textarea
            label="Biyografi"
            value={userForm.bio}
            onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })}
            minRows={3}
          />

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={userForm.isAdmin}
                onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium">Admin Yetkisi</span>
            </label>
          </div>

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => setShowUserModal(false)}
            >
              İptal
            </Button>
            <Button
              onClick={handleSaveUser}
              loading={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Kaydet
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Group, Button, Avatar, Menu, Text, UnstyledButton } from '@mantine/core';
import { IconUser, IconLogout, IconSettings, IconCalendar, IconUsers } from '@tabler/icons-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <IconUsers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GoTrip</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Ana Sayfa
              </Link>
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Profil
              </Link>
              <Link
                to="/create-event"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Etkinlik Oluştur
              </Link>
              <Link
                to="/search"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Arkadaş Ara
              </Link>
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <UnstyledButton className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      size="sm"
                      radius="xl"
                    />
                    <div className="hidden sm:block">
                      <Text size="sm" fw={500}>
                        {user.name}
                      </Text>
                    </div>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Hesabım</Menu.Label>
                  <Menu.Item leftSection={<IconUser size={14} />}>
                    Profilim
                  </Menu.Item>
                  <Menu.Item leftSection={<IconSettings size={14} />}>
                    Ayarlar
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={14} />}
                    onClick={handleLogout}
                  >
                    Çıkış Yap
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="subtle"
                  component={Link}
                  to="/login"
                  size="sm"
                >
                  Giriş Yap
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Kayıt Ol
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

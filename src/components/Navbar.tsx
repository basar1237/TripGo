import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Avatar, Menu, Text, UnstyledButton, Drawer, Stack, Group } from '@mantine/core';
// import { FaUser, FaSignOutAlt, FaCog, FaUsers } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpened(false);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">👥</span>
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
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <Button
              variant="subtle"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpened(true)}
            >
              <span className="text-xl">☰</span>
            </Button>
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
                  <Menu.Item leftSection={<span>👤</span>}>
                    Profilim
                  </Menu.Item>
                  <Menu.Item leftSection={<span>⚙️</span>}>
                    Ayarlar
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    color="red"
                    leftSection={<span>🚪</span>}
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

      {/* Mobile Menu Drawer */}
      <Drawer
        opened={mobileMenuOpened}
        onClose={() => setMobileMenuOpened(false)}
        title="Menü"
        size="sm"
        position="right"
      >
        {user && (
          <Stack gap="md">
            {/* User Info */}
            <Group>
              <Avatar
                src={user.avatar}
                alt={user.name}
                size="lg"
                radius="xl"
              />
              <div>
                <Text fw={500} size="lg">
                  {user.name}
                </Text>
                <Text size="sm" c="dimmed">
                  {user.email}
                </Text>
              </div>
            </Group>

            {/* Navigation Links */}
            <Stack gap="xs">
              <Button
                variant="subtle"
                component={Link}
                to="/"
                onClick={() => setMobileMenuOpened(false)}
                justify="flex-start"
                leftSection={<span>🏠</span>}
              >
                Ana Sayfa
              </Button>
              
              <Button
                variant="subtle"
                component={Link}
                to="/profile"
                onClick={() => setMobileMenuOpened(false)}
                justify="flex-start"
                leftSection={<span>👤</span>}
              >
                Profil
              </Button>
              
              <Button
                variant="subtle"
                component={Link}
                to="/create-event"
                onClick={() => setMobileMenuOpened(false)}
                justify="flex-start"
                leftSection={<span>📅</span>}
              >
                Etkinlik Oluştur
              </Button>
              
              <Button
                variant="subtle"
                component={Link}
                to="/search"
                onClick={() => setMobileMenuOpened(false)}
                justify="flex-start"
                leftSection={<span>🔍</span>}
              >
                Arkadaş Ara
              </Button>
              
              {user?.isAdmin && (
                <Button
                  variant="subtle"
                  component={Link}
                  to="/admin"
                  onClick={() => setMobileMenuOpened(false)}
                  justify="flex-start"
                  leftSection={<span>⚙️</span>}
                  color="red"
                >
                  Admin Panel
                </Button>
              )}
            </Stack>

            {/* Logout Button */}
            <Button
              variant="light"
              color="red"
              onClick={handleLogout}
              leftSection={<span>🚪</span>}
              mt="md"
            >
              Çıkış Yap
            </Button>
          </Stack>
        )}
      </Drawer>
    </div>
  );
};

export default Navbar;

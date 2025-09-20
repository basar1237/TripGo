import React from 'react';
import { Group, Text, Anchor } from '@mantine/core';
// import { FaHeart, FaGithub, FaTwitter } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">❤️</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GoTrip</span>
            </div>
            <Text size="sm" c="dimmed" className="max-w-md">
              Arkadaşlarınızla birlikte etkinliklere katılın, yeni insanlarla tanışın ve 
              unutulmaz anılar biriktirin. GoTrip ile sosyal hayatınızı zenginleştirin.
            </Text>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <Text fw={600} mb="md" size="sm">
              Hızlı Linkler
            </Text>
            <div className="space-y-2">
              <Anchor href="/" size="sm" c="dimmed">
                Ana Sayfa
              </Anchor>
              <br />
              <Anchor href="/profile" size="sm" c="dimmed">
                Profil
              </Anchor>
              <br />
              <Anchor href="/create-event" size="sm" c="dimmed">
                Etkinlik Oluştur
              </Anchor>
              <br />
              <Anchor href="/search" size="sm" c="dimmed">
                Arkadaş Ara
              </Anchor>
            </div>
          </div>

          {/* İletişim */}
          <div>
            <Text fw={600} mb="md" size="sm">
              İletişim
            </Text>
            <div className="space-y-2">
              <Text size="sm" c="dimmed">
                Destek: support@gotrip.com
              </Text>
              <Text size="sm" c="dimmed">
                İş Birliği: partner@gotrip.com
              </Text>
              <Group gap="xs" mt="sm">
                <Anchor href="#" size="sm" c="dimmed">
                    <span>🐦</span>
                </Anchor>
                <Anchor href="#" size="sm" c="dimmed">
                    <span>🐙</span>
                </Anchor>
              </Group>
            </div>
          </div>
        </div>

        {/* Alt Çizgi */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Text size="sm" c="dimmed">
              © 2024 GoTrip. Tüm hakları saklıdır.
            </Text>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Anchor href="#" size="sm" c="dimmed">
                Gizlilik Politikası
              </Anchor>
              <Anchor href="#" size="sm" c="dimmed">
                Kullanım Şartları
              </Anchor>
              <Anchor href="#" size="sm" c="dimmed">
                Çerez Politikası
              </Anchor>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

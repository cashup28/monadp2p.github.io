// /pages/profile.js

import dynamic from 'next/dynamic';
import Head from 'next/head';

// Profil bileşenini sadece client-side'da yükler, SSR hatasını önler
const ProfileClient = dynamic(() => import('@/components/Profile'), {
  ssr: false,
});

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>Profil | MonadP2P</title>
      </Head>
      <main className="min-h-screen bg-black text-white p-4">
        <ProfileClient />
      </main>
    </>
  );
}

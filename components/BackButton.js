// /components/BackButton.js
import { useRouter } from 'next/router';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-4 text-purple-400 hover:text-purple-300 underline"
    >
      ← Geri Dön
    </button>
  );
}

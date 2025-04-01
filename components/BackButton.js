import { useRouter } from 'next/router';

export default function BackButton({ fallback = '/' }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="mb-4 inline-flex items-center text-sm text-blue-400 hover:text-blue-200 transition"
    >
      ← Geri Dön
    </button>
  );
}

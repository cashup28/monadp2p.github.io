// components/BackButton.js

import { useRouter } from "next/router";

export default function BackButton() {
  const router = useRouter();
  
  const goBack = () => {
    router.back(); // Kullanıcıyı önceki sayfaya yönlendirir
  };

  return (
    <button onClick={goBack} className="bg-purple-700 px-4 py-2 rounded-lg text-white">
      Geri
    </button>
  );
}

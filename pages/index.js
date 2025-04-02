import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import io from 'socket.io-client'

let socket

export default function Home() {
  const router = useRouter()
  const [lastTrade, setLastTrade] = useState('')
  const [user, setUser] = useState({
    userId: '637384',
    monadBalance: '12.34',
    tonBalance: '5.67'
  })

  const exampleTrades = [
    '3 TON → 12 MONAD takası yapıldı',
    '10 MONAD → 2 TON takası yapıldı',
    '5 TON → 20 MONAD takası yapıldı',
    '15 MONAD → 3 TON takası yapıldı',
    '0.5 TON → 7 MONAD takası yapıldı',
    '20 MONAD → 4 TON takası yapıldı',
    '3 TON → 12 MONAD takası yapıldı',
    '9 MONAD → 1.2 TON takası yapıldı',
    '2 TON → 6 MONAD takası yapıldı',
    '11 MONAD → 2.5 TON takası yapıldı'
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch('/api/socket')
    socket = io()

    socket.on('newTrade', (data) => {
      setLastTrade(`${data.from} → ${data.to} takası yapıldı`)
    })

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % exampleTrades.length)
    }, 6000)

    return () => {
      socket.disconnect()
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans px-4 pt-[16.6vh] pb-6 flex flex-col gap-5">

      {/* Last P2P's kutusu */}
      <div className="bg-neutral-900 rounded-xl p-4 space-y-2">
        <div className="text-sm text-gray-400">Last P2P's</div>
        <div className="text-sm text-gray-300 mt-1">{exampleTrades[currentIndex]}</div>
      </div>

      {/* 3'lü Bilgi Kartı */}
      <div className="flex justify-between gap-3">
        <div className="flex-1 bg-neutral-900 p-3 rounded-xl text-center">
          <div className="text-sm text-gray-400">USER ID</div>
          <div className="text-lg font-semibold">{user.userId}</div>
        </div>
        <div className="flex-1 bg-neutral-900 p-3 rounded-xl text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-gray-400">
            <img src="/monad-logo.png" alt="MONAD" className="w-4 h-4" />
            MONAD
          </div>
          <div className="text-lg font-semibold">{user.monadBalance}</div>
        </div>
        <div className="flex-1 bg-neutral-900 p-3 rounded-xl text-center">
          <div className="flex items-center justify-center gap-1 text-sm text-gray-400">
            <img src="/ton-logo.png" alt="TON" className="w-4 h-4" />
            TON
          </div>
          <div className="text-lg font-semibold">{user.tonBalance}</div>
        </div>
      </div>

      {/* Maskot ve logo alanı */}
      <div className="flex flex-col items-center justify-center py-4">
        <img src="/mascot.png" alt="Maskot" className="w-2/3 max-w-[240px] mb-4" />
      </div>

      {/* 6'lı Butonlar */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => router.push('/create-order')} className="bg-purple-600 bg-opacity-70 rounded-xl py-3 font-semibold hover:bg-purple-700 transition">
          TAKAS YAP
        </button>
        <button onClick={() => router.push('/orders')} className="bg-purple-600 bg-opacity-70 rounded-xl py-3 font-semibold hover:bg-purple-700 transition">
          EMİRLERİM
        </button>
        <button onClick={() => router.push('/history')} className="bg-purple-600 bg-opacity-70 rounded-xl py-3 font-semibold hover:bg-purple-700 transition">
          GEÇMİŞ
        </button>
        <button onClick={() => router.push('/profile')} className="bg-purple-600 bg-opacity-70 rounded-xl py-3 font-semibold hover:bg-purple-700 transition">
          PROFİL
        </button>
        <button onClick={() => router.push('/refer')} className="bg-purple-600 bg-opacity-70 rounded-xl py-3 font-semibold hover:bg-purple-700 transition">
          REFERANS
        </button>
        <button onClick={() => router.push('/support')} className="bg-purple-600 bg-opacity-70 rounded-xl py-3 font-semibold hover:bg-purple-700 transition">
          DESTEK
        </button>
      </div>
    </div>
  )
}

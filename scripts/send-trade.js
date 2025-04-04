import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log('🟢 Bağlandı:', socket.id)

  const trade = {
    from: '5 TON',
    to: '20 MONAD'
  }

  socket.emit('trade', trade)
  console.log('📤 Yayınlandı:', trade)

  setTimeout(() => {
    socket.disconnect()
    console.log('🔌 Bağlantı kapatıldı')
  }, 2000)
})

socket.on('connect_error', (err) => {
  console.error('❌ Bağlantı hatası:', err)
})
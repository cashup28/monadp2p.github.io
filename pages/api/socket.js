import { Server } from 'socket.io'

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log('🔁 Socket.io zaten aktif')
  } else {
    console.log('🚀 Socket.io sunucusu başlatılıyor...')
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('🔌 Bağlandı:', socket.id)

      socket.on('trade', (data) => {
        console.log('📢 Takas geldi:', data)
        io.emit('newTrade', data)
      })
    })
  }
  res.end()
}
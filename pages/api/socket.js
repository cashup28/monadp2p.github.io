
import { Server } from 'socket.io'

let trades = [
  { user: 'user99', from: '5 TON', to: '20 MONAD' },
  { user: 'user42', from: '10 MONAD', to: '2 TON' },
  { user: 'user7', from: '1 TON', to: '4 MONAD' }
]

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('🔌 Yeni bağlantı')

      let index = 0
      setInterval(() => {
        socket.emit('newTrade', trades[index % trades.length])
        index++
      }, 10000)
    })
  }
  res.end()
}

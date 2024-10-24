const room = 'ROOOM'

export default defineWebSocketHandler({
  open(peer) {
    console.log('WebSocket opened:', peer.id)
    peer.subscribe(room)
    peer.publish(room, 'Another user joined!')
  },
  close(peer) {
    console.log('WebSocket closed:', peer.id)
    peer.publish(room, 'Another user left!')
  },
  error(peer, error) {
    console.error('WebSocket error:', peer, error)
  },
  message(peer, message) {
    console.log('WebSocket message:', peer.id, message.text())
  },
})

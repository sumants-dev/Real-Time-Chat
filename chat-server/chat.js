const uuidv4 = require('uuid').v4
const cookie = require("cookies");

const messages = new Set()
const users = new Map()

const defaultUser = {
  id: 'anon',
  name: 'Anonymous',
}

const messageExpirationTimeMS = 5*60 * 1000



class Connection {
  constructor(io, socket) {
    this.socket = socket
    this.io = io

    //this.cookies = cookie.parse(socket.handshake.headers.cookie)

    socket.on('setUser', (name) => this.setUser(name))
    socket.on('getMessages', () => this.getMessages())
    socket.on('message', (value) => this.handleMessage(value))
    socket.on('disconnect', () => this.disconnect())
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`)
    })
  }
  
  setUser(name) {
    users.set(this.socket, {
      name: name,
    })
  }
  sendMessage(message) {
      this.io.sockets.emit('message', message)
  }
  
  getMessages() {
    messages.forEach((message) => this.sendMessage(message))
  }

  handleMessage(value) {
    const message = {
      id: uuidv4(),
      user: users.get(this.socket) || defaultUser,
      value,
      time: Date.now()
    }

    messages.add(message)
    this.sendMessage(message)

    setTimeout(
      () => {
        messages.delete(message)
        this.io.sockets.emit('deleteMessage', message.id)
      },
      messageExpirationTimeMS,
    )
  }

  disconnect() {
    users.delete(this.socket)
  }
}

const chat = (io) => {
  io.on('connection', (socket) => {
    new Connection(io, socket)   
  })
}

module.exports = chat
import express from 'express'
import {__dirname} from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './routes/views.router.js'

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extends: true}))
app.use(express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)

const httpServer = app.listen(PORT, () => {
    console.log(`Server on port: ${PORT}`);
})

const mensajes = []

const serverSocket = new Server(httpServer)

serverSocket.on('connection', (socket) => {
    console.log(`El usuario ID: ${socket.id} se ha conectado`)

    socket.on('disconnect', () => {
        console.log(`El usuario ID: ${socket.id} se ha desconectado.`);
    })

    socket.on('mensaje', info => {
        mensajes.push(info)
        serverSocket.emit('chat', mensajes)
    })

    socket.on('userConect', user => {
        socket.broadcast.emit('broadcast', user)
    })
})


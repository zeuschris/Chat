const socketClient = io()

// Elementos del chat.handlebars
const nameUser = document.getElementById('user')
const form = document.getElementById('form')
const inputMensaje = document.getElementById('mensaje')
const divChat = document.getElementById('chat')

// Almacenar el usuario
let user

// Ingreso al chat

Swal.fire({
    title: 'Bievenido',
    text: 'Ingresa tu nombre',
    input: 'text',
    inputValidator : value => {
        if(!value){
            return `Se necesita ingresar un usuario`
        }
    }
}).then(username => {
    user = username.value
    nameUser.innerHTML = `Hola ${user}` 
    // Evento del usuario ingresado
    socketClient.emit('userConect', user)
})

// Mensajes

form.onsubmit = (e) => {
    e.preventDefault()
    const info = {
        nombre: user,
        mensaje: inputMensaje.value
    }
    socketClient.emit('mensaje', info)
}

socketClient.on('chat', mensajes => {
    console.log(mensajes)

    const chatMensajes = mensajes.map(element => {
        return `<p>${element.nombre}: ${element.mensaje}</p>`
    }).join('')
    divChat.innerHTML = chatMensajes
    inputMensaje.value = ''
})

// Notificacion de usuario conectado

socketClient.on('broadcast', user => {
    Toastify({
        text: `${user} se ha conectado.`,
        duration: 6000,
        position: "right", // `left`, `center` or `right`
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
})
//Lementos do chat
const chatForm = document.querySelector(".chat_form")
const chatInput = document.querySelector(".chat_input")
const chatMessages = document.querySelector(".chat")

//Coleta de dados da página anterior
const user = JSON.parse(localStorage.getItem("userData"));
console.log(user)



const colors = [
    "aqua",
    "aquamarine",
    "blueviolet",
    "chocolate",
    "crimson",
    "darkgreen",
    "gold",
    "magenta",
    "sienna",
]

//adiciona a cor ao elemento user
const getRandomColor = () =>{
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}
user.color = getRandomColor()

//Conecção com o servidor
let websocket
websocket = new WebSocket(SERVER_URL)

//Criação de mensagens ods others
const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message_other")


    div.classList.add("message_self")
    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

//criação das suas mensagens 
const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message_self")
    div.innerHTML = content

    return div
}

//rolagem da tela
const scrollScreen = () =>{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior:"smooth"
    })
}

//processamento de mensagens do servidor
const processMessage = ({data}) => {
    console.log("oi")
    const {type, userid, userName, userColor, content} = JSON.parse(data)
    const message = 
    userid == user.UUID? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor)


    chatMessages.appendChild(message)
    scrollScreen()
}
websocket.onmessage = processMessage

//envio de mensagens ao servidor
const sandMessage = (event) =>{

    event.preventDefault()
    const message = {
        type: "message",
        userid: user.UUID,
        userName: user.NOME,
        userColor: user.color,
        content: chatInput.value
    }
    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

//evento submit do botão
chatForm.addEventListener("submit", sandMessage)
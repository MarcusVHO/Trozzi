socket = new WebSocket(SERVER_URL)

// ------------------------------------------!!!!! CHAT GLOBAL INICIO !!!!! -------------------------------------- ///
//Elementos da interface
const nomeTitulo = document.querySelector(".profile_name")



//Elementos do input
const campodeMensagens = document.querySelector(".chat_messages")
const caixadeDigitacao = document.querySelector(".caixa_de_digitacao") 
const botaodeEnvio = document.querySelector(".send_button")






//variavel coleta ao logar
const userData = JSON.parse(localStorage.getItem("userData"));

delete userData.EMAIL
console.log(userData)





// ------- AJUSTES DE LAYOUT -------------- //


nomeTitulo.innerHTML = userData.NOME


// ------- AJUSTES DE LAYOUT -------------- //

//Elementos da sidebar
const botaoSeta = document.querySelector('.chat_header_seta_return_button')
const sidebar = document.querySelector('.sidebar')

botaoSeta.addEventListener('click', () => {
    sidebar.classList.toggle('show');
})

//oculta sidebar quando clica do lado de fora dela
document.addEventListener('click', (e) => {
    const clicouFora = !sidebar.contains(e.target) && !botaoSeta.contains(e.target)

    if (clicouFora) {
        sidebar.classList.remove('show')
    }
})


// ------- AJUSTES PARA DISPOSITIVOS MOVEIS -------------- //





// ------- AJUSTES PARA DISPOSITIVOS MOVEIS -------------- //






//Ultilitários do chat 

//mantem rolagem no fim da página 
const scrollToBottom = () => {
    campodeMensagens.scrollTop = campodeMensagens.scrollHeight;
};

//cor aleatória
const color = [
  "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure",
  "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue",
  "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse",
  "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson",
  "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray",
  "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen",
  "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen",
  "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet",
  "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue",
  "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro",
  "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey",
  "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed",
  "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush",
  "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan",
  "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink",
  "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey",
  "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen",
  "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid",
  "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise",
  "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin",
  "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab",
  "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen",
  "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru",
  "Pink", "Plum", "PowderBlue", "Purple", "RebeccaPurple",
  "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon",
  "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver",
  "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow",
  "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle",
  "Tomato", "Turquoise", "Violet", "Wheat", "White",
  "WhiteSmoke", "Yellow", "YellowGreen"
]

function corAleatoria () {
    let cor = color[Math.floor(Math.random()*color.length)]
    return cor
}
userData.color = corAleatoria()//color cor aleatoria no usuario

//Ultilitário do chat



//verifica que tipo de mensagem deve ser enviada
const verificarmensagem = (mensagem) => {
}

//criar mensagem propria (self)
const criarMensagemPropria = (messagetxt) => {
    event.preventDefault()

    const message = document.createElement("div")
    message.className = "message_self" 
    message.textContent = messagetxt

    campodeMensagens.appendChild(message)

    caixadeDigitacao.value = null

    scrollToBottom()
}

//Criar mensagem recebidas pelo servidor
const criarMensagemRecebida = (name, color, messagetxt) => {

    const message = document.createElement("div")
    const title = document.createElement("h2")
    const textmessage = document.createElement("span")

    message.className = "message_other"
    title.className = "name_other"
    title.style.color = color

    title.innerText = name
    textmessage.innerText = messagetxt

    message.appendChild(title)
    message.appendChild(textmessage)

    campodeMensagens.appendChild(message)
    scrollToBottom()


}



//enviar mesagens ao servidor
const enviarMensagens = (event) => {
    event.preventDefault()

    userData.type = "message"
    if (caixadeDigitacao.value == "") {
        return
    }else {
        userData.message = caixadeDigitacao.value
    }
    
    socket.send(JSON.stringify(userData))
}

//sistema de recebimeneto de mensagens.
socket.onmessage = (event) => {
    let response = JSON.parse(event.data)

    if (response.type == "message") {

        if (response.UUID == userData.UUID) {
            criarMensagemPropria(response.message)
        } else {
            criarMensagemRecebida(response.NOME, response.color, response.message)
        }
    }
}








//Permite o envio de mensgens com o enter
caixadeDigitacao.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        enviarMensagens(e);
    }
});


//Ações em botões
botaodeEnvio.addEventListener("click", enviarMensagens)







//Funcoes para responsividade


// ------------------------------------------!!!!! CHAT GLOBAL FIM !!!!! -------------------------------------- ///


// ------------------------------------------!!!!! CHAT ENTRE CONTATOS INICIO !!!!! -------------------------------------- ///

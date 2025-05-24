socket = new WebSocket(SERVER_URL)

//Elementos do input
const campodeMensagens = document.querySelector(".chat_messages")
const caixadeDigitacao = document.querySelector(".caixa_de_digitacao") 
const botaodeEnvio = document.querySelector(".send_button")


//Ultilitários do chat 

//mantem rolagem no fim da página 
const scrollToBottom = () => {
    campodeMensagens.scrollTop = campodeMensagens.scrollHeight;
};

//Ultilitário do chat



//criar mensagem propria (self)

const criarMensagemPropria = (event) => {
    event.preventDefault()

    const message = document.createElement("div")
    message.className = "message_self" 
    message.textContent = caixadeDigitacao.value

    campodeMensagens.appendChild(message)

    caixadeDigitacao.value = null

    scrollToBottom()
}
 







//Permite o envio de mensgens com o enter
caixadeDigitacao.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        criarMensagemPropria(e);
    }
});



botaodeEnvio.addEventListener("click", criarMensagemPropria)


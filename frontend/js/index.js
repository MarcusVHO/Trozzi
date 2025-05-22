
//Conecxão do servidor
const socket = new WebSocket(SERVER_URL)

//Captura de elementos do formulário
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login_form")
const loginInput = login.querySelector(".login_input")
const password = login.querySelector(".password_input")

//Captura de elementos de feedback de login
const textCheck1 = document.querySelector(".login_check1")
const textCheck2 = document.querySelector(".login_check2")



//acontece quando o serivdor é aberto
socket.onopen = () => {
    console.log('Conectado ao servidor')
}



//envio de informações para o servidor
let user = {
    type:"login",
    username:"",
    password:"",
} 

const enviar = (event) => {
    event.preventDefault()
    user.username = loginInput.value
    user.password = password.value

    console.log(user)
    socket.send(JSON.stringify(user)) //Transfere os dados do formulário
    
}
  

//mensagem recebidas do servidor
socket.onmessage = (event) => {
    let response = JSON.parse(event.data)
    console.log(response) //Trabalha a resposta do servidor.


    if(response == "N/A"){
        console.log("Não estou encontrando o usuário")
        loginInput.style.outline = "red solid 1.5px"
        password.style.outline = "red solid 1.5px"
        textCheck1.style.color = "#ed7673"
        textCheck2.style.color = "#ed7673"
    } else if(response.type == "login"){
        console.log("Login realizado com sucesso")
        localStorage.setItem("userData", JSON.stringify(response))
        window.location.href = "chat.html"
        textCheck1.style.color = "#ed7673"
        textCheck2.style.color = "#ed7673"
    }
}



//aciona ao enviar formulário
loginForm.addEventListener("submit", enviar)

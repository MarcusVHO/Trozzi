
//Conecxão do servidor
const socket = new WebSocket(SERVER_URL)

//Captura de elementos do formulário
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login_form")
const loginInput = login.querySelector(".login_input")
const password = login.querySelector(".password_input")

//Captura de elementos de feedback de login
const usernameOurPassword = document.querySelector(".username_our_passowrd")



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


    if(response == "N/A"){ //caso não ache o usuario
        console.log("Não estou encontrando o usuário")
        loginInput.style.outline = "red solid 1.5px"
        password.style.outline = "red solid 1.5px"
        usernameOurPassword.style.display = "inline"
        password.value = null
    } else if(response.type == "login"){ //quando loga
        console.log("Login realizado com sucesso")
        localStorage.setItem("userData", JSON.stringify(response))
        window.location.href = "chat.html"
    }
}


loginInput.addEventListener("input", () =>{
    loginInput.style.outline = "none"
    password.style.outline = "none"
})

password.addEventListener("focus", () => {
    login.style.outline = "none"
    password.style.outline = "none"
})

//aciona ao enviar formulário
loginForm.addEventListener("submit", enviar)

//Conexão com o servidor
const socket = new WebSocket(SERVER_URL)


//Elementos do formuário
const subscribe = document.querySelector(".subscribe") //Div do formulário
const subscribeForm = subscribe.querySelector(".subscribe_form") //Formulário
const subscribeUsername = subscribe.querySelector(".subscribe_username") //Nome de Usuário
const subscribeEmail = subscribe.querySelector(".subscribe_email") //Email
const subscribePassword = subscribe.querySelector(".subscribe_password") //Senha
const subscribeConfirmPassword = subscribe.querySelector(".confirm_password") //Cofirmação de senha

//Elemenots de feedback
const usernameUsed = subscribe.querySelector(".username_used")//feedback de usuario usado
const emailUsed = subscribe.querySelector(".email_used") //feedback de email já ultilizado
const passwordnotMatch = subscribe.querySelector(".password_no_match") //feedback de senhas não coicidem 

socket.onopen = () => {
    console.log("Conectado ao Servidor")
}

// Objeto a ser enviado ao servidor
let user = {
    type:"subscribe",
    username:"",
    email:"",
    password:"",
}

const confirminfo = (event) =>{
    event.preventDefault() //Inpede recarragamento

    if (subscribePassword.value != subscribeConfirmPassword.value) { //Confirma se senhas batem
        console.log("As senhas não batem")
        passwordnotMatch.style.display = "inline"
        subscribePassword.style.outline = "red solid 1.5px"
        subscribeConfirmPassword.style.outline = "red solid 1.5px"
        subscribePassword.value = null
        subscribeConfirmPassword.value = null
    } else { //Caso senhas batama irá coletar informações
        user.username = subscribeUsername.value
        user.email = subscribeEmail.value
        user.password = subscribePassword.value

        socket.send(JSON.stringify(user)) //Envia dodos ao servidor 
        console.log("Dados enviados")//Mostra no console que os dados foram enviados com sucesso
    }


}

socket.onmessage = (event) => {
    let response = JSON.parse(event.data)
    console.log(response)

    switch (response) { //Trabalha resposta do servidor
        case "Usuário já existe": { //feedback se usuario existe
            console.log("Numpodi esse usuário")
            usernameUsed.style.display = "inline"
            subscribeUsername.style.outline = "red solid 1.5px"
        }
        case "E-mail já está em uso": { //feddback se email já existe
            console.log("Numpodi esse email")
            emailUsed.style.display = "inline"
            subscribeEmail.style.outline = "red solid 1.5px"
        }
        case response: {
            localStorage.setItem("userData", JSON.stringify(response))
            window.location.href = "home.html"
        }
    }

}

subscribeUsername.addEventListener("input", () =>{ //reseta css quando digita no campo
    usernameUsed.style.display = "none"
    subscribeUsername.style.outline = "none"
})
subscribeEmail.addEventListener("input", () =>{ //reseta css quando digita no campo
    emailUsed.style.display = "none"
    subscribeEmail.style.outline = "none"
})

subscribePassword.addEventListener("focus", () => { //reseta css do campo senha e cofirmsenha ao clicar
    passwordnotMatch.style.display = "none"
    subscribePassword.style.outline = "none"
    subscribeConfirmPassword.style.outline = "none"
    
})
subscribeConfirmPassword.addEventListener("focus", () => { //reseta css do campo senha e cofirmsenha ao clicar
    passwordnotMatch.style.display = "none"
    subscribePassword.style.outline = "none"
    subscribeConfirmPassword.style.outline = "none"
})
subscribeForm.addEventListener("submit", confirminfo)//Ao clicar no botão submit irá iniicar a funcação para firmar informações e enviar
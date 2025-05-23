

const {WebSocket} = require("ws")
const reader = require("xlsx")
const path = require("path")

const wss = new WebSocket.Server({ port: 8080 })





//verifica se usuraio existe e retorna true caso sim 
const verifyLogin = (name, password) => {
    const filePath = path.join(__dirname, "../BD/users.xlsx")

    const file = reader.readFile(filePath)
    const sheets = file.SheetNames
    
    for(let i =0; i<sheets.length; i++){

        const data = reader.utils.sheet_to_json(file.Sheets[sheets[i]])
  
        const userlocated = data.find((res) => res.NOME == name && res.SENHA == password)
        if (userlocated){
            console.log("Usuario encontrado")
            userlocated.typie = "login" //adiciona o tipo da string para que não seja confundida
            userlocated.password = undefined //remove a senha do objeto 
            return userlocated
        }
        
       
    }
   return null
}


const subscribe = (username, email, password) => {
    const filePath = path.join(__dirname, "../BD/users.xlsx")

    const file = reader.readFile(filePath)
    const sheets = file.SheetNames

    for(let i = 0; i<sheets.length; i++){

        const data = reader.utils.sheet_to_json(file.Sheets[sheets[i]])

        const userlocated = data.find((res) => res.NOME == username && res.SENHA == password)
        if(userlocated){
            console.log("Esse usuário já existe")
            let resposta = "Usuário já existe"
            return resposta
        }
        const emailLocated = data.find((res) => res.EMAIL == email)
        if(emailLocated){
            console.log("Esse e-mail já está em uso")
            return "E-mail já está em uso"
        }

    }
    const newUser = {UUID:crypto.randomUUID(), NOME: username, EMAIL: email, SENHA: password }
    const mainSheet = sheets[0]
    const data = reader.utils.sheet_to_json(file.Sheets[mainSheet])
    data.push(newUser)
    const newSheet = reader.utils.json_to_sheet(data)
    file.Sheets[mainSheet] = newSheet
    reader.writeFile(file, filePath)
    console.log("Usuário cadastrado com sucesso")
    return "Usuário cadastrado com sucesso"
}








wss.on("connection", function conection(ws) {
    console.log("Client conecatado")




    //Rece mensagem
    ws.on("message", function message(data){
        const received = JSON.parse(data.toString())
        console.log("Servidor - Mensagem recebida:", received)
        //Verfica se usuario existe 
        switch(received.type){

            case "login":{ //trabalha logins

                const confirmLogin = verifyLogin(received.username, received.password)

                if(confirmLogin){
                    confirmLogin.type = "login" //adiciona o tipo da string para que não seja confundida
                    ws.send(JSON.stringify(confirmLogin))
                    
                    
                } else {
                    ws.send(JSON.stringify("N/A"))
                }
                
                break
            }
            case "message":{//trabalhas mensagens recebidas

                wss.clients.forEach((client) => client.send(data.toString()))
                break
            }

            case "subscribe":{//Trabalha as inscrições
                
                const confirmSubscribe = subscribe(received.username, received.email, received.password)

                ws.send(JSON.stringify(confirmSubscribe))

                break
            }
        }
    })
    
   



    //cliente desconcetado
    ws.on("close", () => {
        console.log("Cliente desconectado")
    })
})




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
            console.log("Usuario encontrado: ", userlocated)
            userlocated.typie = "login" //adiciona o tipo da string para que não seja confundida
            userlocated.password = undefined //remove a senha do objeto 
            return userlocated
        }
        
       
    }
   return null
}









wss.on("connection", function conection(ws) {
    console.log("Client conecatado")




    //Rece mensagem
    ws.on("message", function message(data){
        const received = JSON.parse(data.toString())
        console.log(received)
        //Verfica se usuario existe 
        switch(received.type){

            case "login":{ //trabalha logins

                const confirm = verifyLogin(received.username, received.password)

                if(confirm){
                    confirm.type = "login" //adiciona o tipo da string para que não seja confundida
                    ws.send(JSON.stringify(confirm))
                    
                    
                } else {
                    ws.send(JSON.stringify("N/A"))
                }
                
                break
            }
            case "message":{//trabalhas mensagens recebidas

                wss.clients.forEach((client) => client.send(data.toString()))
                break
            }
        }
    })
    
   



    //cliente desconcetado
    ws.on("close", () => {
        console.log("Cliente desconectado")
    })
})


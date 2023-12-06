const chatInput = document.querySelector(".chat-input textarea")
const sendChatButton = document.querySelector(".chat-input span")
const chatbox = document.querySelector(".chatbox")
const chatbotToggler = document.querySelector(".chatbot-toggler")
const chatBotCloseButton = document.querySelector(".close-button")

let userMessage

const API_KEY = "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"
const inputInitHeight = chatInput.scrollHeight;

const createChatList = (message, className) => {
    // Função para criar uma <li></li> com uma mensagem e sua ClassName 
    const chatList = document.createElement("li")
    chatList.classList.add("chat", className)
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`
    chatList.innerHTML = chatContent
    chatList.querySelector("p").textContent = message
    return chatList
}

const generateResponse = (incomingChatList) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatList.querySelector("p")

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`

        },
        body: JSON.stringify({
            messages: [{ role: "system", content: userMessage }],
            model: "gpt-3.5-turbo",
        })
    }

    // request post, consome API ( openAI ) e retorna mensagem.
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error")
        messageElement.textContent = "Opa! Parece que algo deu errado. Tente novamente."
    }).finally(() =>  chatbox.scrollTo(0, chatbox.scrollHeight))  
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`

    chatbox.appendChild(createChatList(userMessage, "outgoing")) // Usa-se o AppendChild para passar a mensagem do usuario para o "ChatBox"
    chatbox.scrollTo(0, chatbox.scrollHeight)


    setTimeout(() => {
        const incomingChatList = createChatList("Pensando...", "incoming")
        chatbox.appendChild(incomingChatList) // Resposta ao usuário
        chatbox.scrollTo(0, chatbox.scrollHeight)
        generateResponse(incomingChatList);
    }, 300);
}


chatInput.addEventListener("input", () => {
    // Ajuste automático da area de texto do chatbox
    chatInput.style.height = `${inputInitHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener("keyup", (e) => {
    // Ao clicar "enter" a mensagem é enviada ao chatbot.
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
})

sendChatButton.addEventListener("click", handleChat)
chatBotCloseButton.addEventListener("click", () => document.body.classList.remove("show-chatbot"))
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"))

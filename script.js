async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatHistory = document.getElementById("chat-history");

    if (!userInput.trim()) {
        // Impede o envio de mensagens vazias
        return;
    }

    // Exibe a mensagem do usuário
    const userMessageDiv = document.createElement("div");
    userMessageDiv.textContent = "Você: " + userInput;
    userMessageDiv.className = "user-message"; // Classe para estilização
    chatHistory.appendChild(userMessageDiv);

    // Rola o histórico de chat para o final
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Verificando se a requisição está sendo enviada corretamente
    console.log("Enviando mensagem:", userInput);

    try {
        // Exibe um indicador de "escrevendo..."
        const typingIndicator = document.createElement("div");
        typingIndicator.textContent = "Bot está digitando...";
        typingIndicator.className = "typing-indicator";
        chatHistory.appendChild(typingIndicator);

        // Rola o histórico de chat para o final
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Envia a mensagem ao backend
        const response = await fetch('http://localhost:15000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput })
        });

        // Remove o indicador de "escrevendo..." após a resposta
        chatHistory.removeChild(typingIndicator);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao conectar com o servidor');
        }

        const data = await response.json();

        // Verifica a resposta do bot
        console.log("Resposta do bot:", data.response);

        // Exibe a resposta do bot com um pequeno atraso para parecer mais natural
        setTimeout(() => {
            const botMessageDiv = document.createElement("div");
            botMessageDiv.textContent = "Bot: " + data.response;
            botMessageDiv.className = "bot-message"; // Classe para estilização
            chatHistory.appendChild(botMessageDiv);

            // Rola o histórico de chat para o final
            chatHistory.scrollTop = chatHistory.scrollHeight;

            // Exibe sugestões de ações, se houver
            if (data.suggestions) {
                const suggestionsDiv = document.createElement("div");
                suggestionsDiv.className = "suggestions";
                suggestionsDiv.textContent = "Sugestões: " + data.suggestions.join(", ");
                chatHistory.appendChild(suggestionsDiv);
            }
        }, 1000); // Atraso de 1 segundo para simular tempo de digitação
    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);

        // Mensagem de erro visível para o usuário
        const botMessageDiv = document.createElement("div");
        botMessageDiv.textContent = "Bot: Desculpe, houve um erro ao tentar enviar sua mensagem.";
        botMessageDiv.className = "bot-message error-message"; // Classe para estilização de erro
        chatHistory.appendChild(botMessageDiv);

        // Rola o histórico de chat para o final
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Limpa o campo de input
    document.getElementById("user-input").value = '';
}

// Função para detectar o pressionamento da tecla Enter
document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Evita que a página seja recarregada ao pressionar Enter
        sendMessage(); // Chama a função sendMessage
    }
});

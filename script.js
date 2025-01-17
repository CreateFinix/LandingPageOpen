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
    chatHistory.appendChild(userMessageDiv);
  
    // Verificando se a requisição está sendo enviada corretamente
    console.log("Enviando mensagem:", userInput);
  
    try {
      // Envia a mensagem ao backend
      const response = await fetch('http://localhost:15000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });
  
      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao conectar com o servidor');
      }
  
      const data = await response.json();
  
      // Verifica a resposta do bot
      console.log("Resposta do bot:", data.response);
  
      // Exibe a resposta do bot
      const botMessageDiv = document.createElement("div");
      botMessageDiv.textContent = "Bot: " + data.response;
      chatHistory.appendChild(botMessageDiv);
  
    } catch (error) {
      console.error('Erro ao enviar a mensagem:', error);
      // Mensagem de erro visível para o usuário
      const botMessageDiv = document.createElement("div");
      botMessageDiv.textContent = "Bot: Desculpe, houve um erro ao tentar enviar sua mensagem.";
      chatHistory.appendChild(botMessageDiv);
    }
  
    // Limpa o campo de input
    document.getElementById("user-input").value = '';
  }

  // Função para enviar a mensagem
async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatHistory = document.getElementById("chat-history");
  
    // Exibe a mensagem do usuário
    const userMessageDiv = document.createElement("div");
    userMessageDiv.textContent = "Você: " + userInput;
    chatHistory.appendChild(userMessageDiv);
  
    // Envia a mensagem ao backend
    const response = await fetch('http://localhost:15000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput })
    });
  
    const data = await response.json();
  
    // Exibe a resposta do bot
    const botMessageDiv = document.createElement("div");
    botMessageDiv.textContent = "Bot: " + data.response;
    chatHistory.appendChild(botMessageDiv);
  
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
  
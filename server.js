const express = require('express');
const cors = require('cors');  // Importando o CORS

const app = express();

// Middleware para permitir o CORS
app.use(cors());

// Middleware para parsear o corpo da requisição como JSON
app.use(express.json());

// Função para processar a mensagem do usuário e retornar a resposta do chatbot
const processChatMessage = (message) => {
    const responses = {
        default: 'Desculpe, não entendi sua mensagem!',
        greeting: 'Olá! Como posso ajudar você hoje? \nMenu para navegar: \nServiços \nPreço \najuda para reiniciar a conversa',
        services: 'Nós oferecemos: \n1. Desenvolvimento de Sistemas \n2. Design UX/UI \n3. Consultoria Tecnológica',
        systemsDevelopment: 'Nosso serviço de Desenvolvimento de Sistemas inclui criação de plataformas personalizadas para empresas de diferentes segmentos.',
        uxUiDesign: 'Nosso serviço de Design UX/UI foca em criar interfaces intuitivas e visualmente atraentes para seus usuários.',
        techConsulting: 'Oferecemos consultoria para ajudar sua empresa a implementar as melhores soluções tecnológicas e otimizar processos.',
        pricing: 'Para informações sobre preços, por favor entre em contato conosco!',
        help: 'Claro! Me diga como posso te ajudar.'
    };

    // Respostas baseadas em palavras-chave
    const normalizedMessage = message.toLowerCase();
    if (normalizedMessage.includes('oi') || normalizedMessage.includes('olá')) {
        return responses.greeting;
    } else if (normalizedMessage.includes('serviços')) {
        return responses.services;
    } else if (normalizedMessage.includes('desenvolvimento de sistemas') || normalizedMessage.includes('sistemas')) {
        return responses.systemsDevelopment;
    } else if (normalizedMessage.includes('design ux/ui') || normalizedMessage.includes('design')) {
        return responses.uxUiDesign;
    } else if (normalizedMessage.includes('consultoria tecnológica') || normalizedMessage.includes('consultoria')) {
        return responses.techConsulting;
    } else if (normalizedMessage.includes('preço') || normalizedMessage.includes('valor')) {
        return responses.pricing;
    } else if (normalizedMessage.includes('ajuda')) {
        return responses.help;
    }

    return responses.default;
};

// Rota para receber e responder mensagens do chatbot
app.post('/chat', (req, res) => {
    const { message } = req.body;

    // Validação simples para garantir que a mensagem não está vazia
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ response: 'Por favor, envie uma mensagem válida.' });
    }

    try {
        // Processa a mensagem e gera uma resposta
        const botResponse = processChatMessage(message);

        // Retorna a resposta do bot
        return res.json({ response: botResponse });
    } catch (error) {
        console.error('Erro ao processar a mensagem:', error);
        return res.status(500).json({ response: 'Houve um erro ao processar sua mensagem. Tente novamente.' });
    }
});

// Defina a porta onde o servidor vai rodar
const PORT = process.env.PORT || 15000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();

// Middleware para permitir o CORS
app.use(cors());
app.use(bodyParser.json());

// Middleware para parsear o corpo da requisição como JSON
app.use(express.json());

// Função para processar a mensagem do usuário e retornar a resposta do chatbot
const processChatMessage = (message) => {
    const responses = {
        default: [
            'Desculpe, não entendi sua mensagem. Poderia ser mais específico?',
            'Não consegui compreender. Você pode tentar reformular sua pergunta?'
        ],
        greeting: [
            'Olá! 👋 Como posso ajudar você hoje?',
            'Oi! Tudo bem? Estou aqui para te ajudar! 😊'
        ],
        services: [
            `Oferecemos os seguintes serviços: 
            1️⃣ Desenvolvimento de Sistemas 
            2️⃣ Design UX/UI 
            3️⃣ Consultoria Tecnológica. 
            Qual desses você gostaria de saber mais?`,
            `Podemos ajudar com:
            1️⃣ Desenvolvimento de Sistemas
            2️⃣ Design UX/UI
            3️⃣ Consultoria Tecnológica.
            Em qual você está interessado?`
        ],
        systemsDevelopment: [
            `Criamos sistemas sob medida para atender às suas necessidades! 
            Que tipo de sistema você está buscando?`
        ],
        uxUiDesign: [
            `O Design UX/UI é sobre criar interfaces incríveis e funcionais. 
            Gostaria de mais detalhes sobre nossos projetos de design?`,
            `Trabalhamos para criar experiências digitais únicas! 
            Tem alguma ideia ou projeto específico em mente?`
        ],
        techConsulting: [
            `Podemos ajudar sua empresa a implementar as melhores soluções tecnológicas. 
            Quer marcar uma reunião para discutir isso?`,
            `Com nossa consultoria tecnológica, garantimos inovação e eficiência nos seus processos. 
            Deseja saber como podemos ajudar no seu caso?`
        ],
        pricing: [
            `Para informações sobre preços, entre em contato diretamente conosco. 
            Podemos oferecer um orçamento personalizado!`,
            `Os preços variam conforme o projeto. 
            Fale com um especialista para um orçamento detalhado.`
        ],
        help: [
            `Claro! Aqui estão algumas coisas que posso fazer para você:
            1️⃣ Falar sobre nossos serviços
            2️⃣ Fornecer informações sobre preços
            3️⃣ Conectar você com um especialista. 
            Qual dessas opções é a mais útil agora?`
        ],
        forwardToWhatsApp: [
            `Entendi! Podemos te ajudar com isso. Vou coletar algumas informações e direcionar sua solicitação para um especialista no WhatsApp.`,
            `Interessante! Vou preparar sua solicitação e te redirecionar para o WhatsApp para um atendimento mais detalhado.`
        ]
    };

    // Normaliza a mensagem para evitar problemas com maiúsculas/minúsculas
    const normalizedMessage = message.toLowerCase();
    let selectedResponse = responses.default;

    // Lógica para determinar a resposta com base na mensagem
    if (normalizedMessage.includes('oi') || normalizedMessage.includes('olá')) {
        selectedResponse = responses.greeting;
    } else if (normalizedMessage.includes('serviços')) {
        selectedResponse = responses.services;
    } else if (normalizedMessage.includes('desenvolvimento de sistemas') || normalizedMessage.includes('sistemas')) {
        selectedResponse = responses.systemsDevelopment;
    } else if (normalizedMessage.includes('design ux/ui') || normalizedMessage.includes('design')) {
        selectedResponse = responses.uxUiDesign;
    } else if (normalizedMessage.includes('consultoria tecnológica') || normalizedMessage.includes('consultoria')) {
        selectedResponse = responses.techConsulting;
    } else if (normalizedMessage.includes('preço') || normalizedMessage.includes('valor')) {
        selectedResponse = responses.pricing;
    } else if (normalizedMessage.includes('ajuda')) {
        selectedResponse = responses.help;
    } else if (normalizedMessage.includes('clínica') || normalizedMessage.includes('demanda')) {
        selectedResponse = responses.forwardToWhatsApp;
    }

    // Retorna uma resposta aleatória do conjunto de respostas selecionado
    return selectedResponse[Math.floor(Math.random() * selectedResponse.length)];
};

// Função para gerar link do WhatsApp com resumo da demanda
const generateWhatsAppLink = (userMessage) => {
    const phoneNumber = "5521966311677"; // Substitua pelo número do WhatsApp do especialista
    const message = `Olá! Recebemos a seguinte demanda de um cliente: "${userMessage}". Por favor, entre em contato para mais detalhes.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
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

        // Verifica se a mensagem requer um redirecionamento para o WhatsApp
        if (botResponse.includes('redirecionar sua solicitação')) {
            const whatsappLink = generateWhatsAppLink(message);

            return res.json({
                response: botResponse,
                action: 'forward_to_whatsapp',
                whatsappLink
            });
        }

        // Resposta normal do bot
        setTimeout(() => {
            return res.json({ 
                response: botResponse,
                suggestions: [
                    'Serviços', 
                    'Preços', 
                    'Falar com Especialista'
                ]
            });
        }, 1500);
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

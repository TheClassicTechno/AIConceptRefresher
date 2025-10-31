// AI Lab - Interactive Chat Interface with Real AI

class AILab {
    constructor() {
        this.conversationCount = 0;
        this.questionsGenerated = 0;
        this.chatHistory = [];
        this.isAIReady = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateAIStatus();
        
        // Check AI readiness periodically
        this.checkAIReadiness();
        setInterval(() => this.checkAIReadiness(), 2000);
    }

    setupEventListeners() {
        // Chat input enter key
        const chatInput = document.getElementById('aiChatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendAIMessage();
                }
            });
        }

        // Send button
        const sendBtn = document.getElementById('aiSendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendAIMessage());
        }
    }

    checkAIReadiness() {
        if (window.AIEngine) {
            const status = window.AIEngine.getStatus();
            this.isAIReady = status.modelLoaded;
            
            const statusIcon = document.getElementById('aiStatusIcon');
            const statusText = document.getElementById('aiStatusText');
            const modelInfo = document.getElementById('aiModelInfo');
            
            if (statusIcon && statusText) {
                if (status.modelLoaded) {
                    statusIcon.style.color = '#4facfe';
                    statusText.textContent = 'AI Ready - Real LLM Active';
                    
                    if (modelInfo) {
                        modelInfo.textContent = status.usingRealAI ? 'Llama-3.2-1B (Local)' : 'Fallback Mode';
                    }
                } else if (status.initialized) {
                    statusIcon.style.color = '#feca57';
                    statusText.textContent = status.loadingProgress > 0 ? 
                        `Loading AI Model... ${Math.round(status.loadingProgress)}%` : 
                        'AI Initializing...';
                } else {
                    statusIcon.style.color = '#ff6b6b';
                    statusText.textContent = 'AI Offline';
                }
            }
        }
    }

    updateAIStatus() {
        this.checkAIReadiness();
        
        // Update stats
        const questionsEl = document.getElementById('aiQuestionsGenerated');
        const conversationsEl = document.getElementById('aiConversations');
        
        if (questionsEl) questionsEl.textContent = this.questionsGenerated;
        if (conversationsEl) conversationsEl.textContent = this.conversationCount;
    }

    async sendAIMessage() {
        const input = document.getElementById('aiChatInput');
        const sendBtn = document.getElementById('aiSendBtn');
        
        if (!input || !input.value.trim()) return;
        
        const message = input.value.trim();
        input.value = '';
        
        // Disable send button temporarily
        if (sendBtn) {
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }

        // Add user message to chat
        this.addMessageToChat(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to chat
            this.addMessageToChat(response, 'ai');
            
            this.conversationCount++;
            this.updateAIStatus();
            
        } catch (error) {
            console.error('AI response error:', error);
            this.hideTypingIndicator();
            this.addMessageToChat(
                "I'm having trouble processing that request right now. Please try again or rephrase your question.",
                'ai'
            );
        } finally {
            // Re-enable send button
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            }
        }
    }

    async getAIResponse(message) {
        if (!this.isAIReady || !window.AIEngine) {
            return this.getFallbackResponse(message);
        }

        try {
            // Check if user wants a quiz question
            if (message.toLowerCase().includes('question') || 
                message.toLowerCase().includes('quiz') ||
                message.toLowerCase().includes('generate')) {
                
                this.questionsGenerated++;
                this.updateAIStatus();
                
                // Extract subject if mentioned
                const subjects = ['data structures', 'machine learning', 'algorithms', 'databases', 'networking', 'security'];
                const mentionedSubject = subjects.find(subject => 
                    message.toLowerCase().includes(subject.replace(' ', ''))
                );
                
                const subject = mentionedSubject || 'Data Structures';
                const question = await window.AIEngine.generateQuestion(subject, 'medium');
                
                return this.formatQuestionResponse(question);
            }
            
            // Check if user wants study plan
            if (message.toLowerCase().includes('study plan') || 
                message.toLowerCase().includes('schedule')) {
                
                const plan = await window.AIEngine.createStudyPlan({
                    totalQuestions: 50,
                    correctAnswers: 35,
                    subjects: ['Data Structures', 'Machine Learning']
                }, ['Data Structures', 'Machine Learning']);
                
                return plan;
            }
            
            // General AI conversation
            const prompt = `You are a helpful AI learning assistant. The user said: "${message}". 
            
            Provide a helpful, educational response that:
            1. Directly addresses their question or comment
            2. Offers additional learning insights when relevant
            3. Stays focused on educational topics
            4. Is encouraging and supportive
            5. Keeps the response under 150 words
            
            Be conversational but informative.`;
            
            const response = await window.AIEngine.generateResponse(prompt, 200);
            return response || this.getFallbackResponse(message);
            
        } catch (error) {
            console.error('AI generation error:', error);
            return this.getFallbackResponse(message);
        }
    }

    formatQuestionResponse(question) {
        const optionsText = question.options.map((option, index) => 
            `${['A', 'B', 'C', 'D'][index]}) ${option}`
        ).join('\n');
        
        return `Here's a ${question.difficulty} level question about ${question.subject}:

**${question.question}**

${optionsText}

*This question was generated using real AI! Try answering it, and I can provide the correct answer and explanation.*`;
    }

    getFallbackResponse(message) {
        const responses = [
            "That's an interesting question! While my AI model is loading, I can tell you that consistent practice is key to mastering any subject.",
            "Great question! I'm still initializing my full AI capabilities, but I'd recommend breaking down complex topics into smaller, manageable pieces.",
            "I appreciate your curiosity! Once my AI model is fully loaded, I'll be able to provide more detailed and personalized responses.",
            "Excellent! Learning is a journey, and asking questions is the best way to grow. Keep that curiosity alive!",
            "That's a thoughtful inquiry! While I'm getting my full AI capabilities ready, remember that active learning through practice and repetition is very effective."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('aiChatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender === 'user' ? 'user-message' : ''}`;
        
        const avatar = sender === 'user' ? 
            '<div class="ai-avatar user-avatar"><i class="fas fa-user"></i></div>' :
            '<div class="ai-avatar"><i class="fas fa-brain"></i></div>';
        
        const formattedMessage = this.formatMessage(message);
        
        messageDiv.innerHTML = `
            ${avatar}
            <div class="ai-message-content">
                ${formattedMessage}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add to history
        this.chatHistory.push({ message, sender, timestamp: Date.now() });
    }

    formatMessage(message) {
        // Convert markdown-style formatting
        let formatted = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
        
        return `<p>${formatted}</p>`;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('aiChatMessages');
        if (!chatMessages) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'ai-typing-indicator';
        typingDiv.className = 'ai-message';
        typingDiv.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-brain"></i>
            </div>
            <div class="ai-message-content">
                <div class="ai-typing">
                    <span>AI is thinking</span>
                    <div class="ai-typing-dots">
                        <div class="ai-typing-dot"></div>
                        <div class="ai-typing-dot"></div>
                        <div class="ai-typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('ai-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    sendQuickPrompt(prompt) {
        const input = document.getElementById('aiChatInput');
        if (input) {
            input.value = prompt;
            this.sendAIMessage();
        }
    }

    clearChat() {
        const chatMessages = document.getElementById('aiChatMessages');
        if (chatMessages) {
            // Keep the initial welcome message
            const welcomeMessage = chatMessages.querySelector('.ai-message');
            chatMessages.innerHTML = '';
            if (welcomeMessage) {
                chatMessages.appendChild(welcomeMessage);
            }
        }
        this.chatHistory = [];
        this.conversationCount = 0;
        this.updateAIStatus();
    }

    exportChat() {
        const chatData = {
            timestamp: new Date().toISOString(),
            conversations: this.conversationCount,
            questionsGenerated: this.questionsGenerated,
            history: this.chatHistory
        };
        
        const blob = new Blob([JSON.stringify(chatData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-chat-history-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Global functions for HTML onclick handlers
function sendQuickPrompt(prompt) {
    if (window.aiLab) {
        window.aiLab.sendQuickPrompt(prompt);
    }
}

function sendAIMessage() {
    if (window.aiLab) {
        window.aiLab.sendAIMessage();
    }
}

function showAILab() {
    if (window.app) {
        window.app.navigateToSection('ai-lab');
    }
}

function clearAIChat() {
    if (window.aiLab) {
        window.aiLab.clearChat();
    }
}

function exportAIChat() {
    if (window.aiLab) {
        window.aiLab.exportChat();
    }
}

// Initialize AI Lab when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiLab = new AILab();
    console.log('🧪 AI Lab initialized and ready for interactions!');
});
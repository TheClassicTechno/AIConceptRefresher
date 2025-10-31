// Real AI Engine using WebLLM - No APIs Required!
// This uses WebLLM to run actual language models locally in the browser

class RealAIEngine {
    constructor() {
        this.isInitialized = false;
        this.model = null;
        this.webllm = null;
        this.modelLoaded = false;
        this.loadingProgress = 0;
    }

    async initialize() {
        try {
            console.log('🧠 Initializing Real AI Engine with WebLLM...');
            
            // Load WebLLM dynamically
            await this.loadWebLLM();
            
            // Initialize the model
            await this.loadModel();
            
            this.isInitialized = true;
            console.log('✅ Real AI Engine initialized successfully!');
            
            // Test the AI with a simple prompt
            await this.testAI();
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Real AI Engine:', error);
            // Fallback to simulated AI
            this.initializeFallback();
            return false;
        }
    }

    async loadWebLLM() {
        // Load WebLLM from CDN
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/lib/web-llm.js';
            script.onload = () => {
                this.webllm = window.webllm;
                console.log('WebLLM loaded successfully');
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load WebLLM'));
            };
            document.head.appendChild(script);
        });
    }

    async loadModel() {
        if (!this.webllm) {
            throw new Error('WebLLM not loaded');
        }

        // Show loading indicator
        this.showLoadingIndicator();

        try {
            // Initialize WebLLM with a small, fast model
            this.model = new this.webllm.MLCEngine();
            
            // Load a compact model that works well for educational content
            const modelId = "Llama-3.2-1B-Instruct-q4f32_1-MLC";
            
            await this.model.reload(modelId, {
                progressCallback: (progress) => {
                    this.loadingProgress = progress * 100;
                    this.updateLoadingIndicator(this.loadingProgress);
                }
            });
            
            this.modelLoaded = true;
            this.hideLoadingIndicator();
            console.log('🎯 AI Model loaded successfully!');
            
        } catch (error) {
            this.hideLoadingIndicator();
            throw error;
        }
    }

    showLoadingIndicator() {
        // Create a modern loading indicator
        const indicator = document.createElement('div');
        indicator.id = 'ai-loading-indicator';
        indicator.innerHTML = `
            <div class="ai-loading-overlay">
                <div class="ai-loading-content glass-strong">
                    <div class="ai-loading-icon">
                        <i class="fas fa-brain"></i>
                    </div>
                    <h3>Loading AI Brain...</h3>
                    <div class="ai-progress-bar">
                        <div class="ai-progress-fill" id="ai-progress-fill"></div>
                    </div>
                    <p id="ai-loading-text">Initializing neural networks...</p>
                </div>
            </div>
            <style>
                .ai-loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(10, 10, 15, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    backdrop-filter: blur(10px);
                }
                .ai-loading-content {
                    text-align: center;
                    padding: 3rem;
                    border-radius: 24px;
                    max-width: 400px;
                }
                .ai-loading-icon {
                    font-size: 4rem;
                    background: var(--ai-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 1.5rem;
                    animation: aiPulse 2s ease-in-out infinite;
                }
                .ai-progress-bar {
                    width: 100%;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    overflow: hidden;
                    margin: 1.5rem 0;
                }
                .ai-progress-fill {
                    height: 100%;
                    background: var(--ai-gradient);
                    width: 0%;
                    transition: width 0.3s ease;
                    border-radius: 4px;
                }
            </style>
        `;
        document.body.appendChild(indicator);
    }

    updateLoadingIndicator(progress) {
        const fill = document.getElementById('ai-progress-fill');
        const text = document.getElementById('ai-loading-text');
        
        if (fill) {
            fill.style.width = `${progress}%`;
        }
        
        if (text) {
            const messages = [
                'Initializing neural networks...',
                'Loading language model...',
                'Optimizing for education...',
                'Calibrating intelligence...',
                'Almost ready!'
            ];
            const messageIndex = Math.floor(progress / 20);
            text.textContent = messages[Math.min(messageIndex, messages.length - 1)];
        }
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('ai-loading-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }
    }

    async testAI() {
        if (!this.modelLoaded) return;
        
        try {
            const testPrompt = "Generate a simple math question with multiple choice answers.";
            const response = await this.generateResponse(testPrompt);
            console.log('🧪 AI Test Response:', response);
        } catch (error) {
            console.warn('AI test failed:', error);
        }
    }

    async generateResponse(prompt, maxTokens = 200) {
        if (!this.modelLoaded || !this.model) {
            throw new Error('AI model not loaded');
        }

        try {
            const response = await this.model.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                max_tokens: maxTokens,
                temperature: 0.7,
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('AI generation error:', error);
            throw error;
        }
    }

    async generateQuizQuestion(subject, difficulty = 'medium', topic = '') {
        if (!this.modelLoaded) {
            return this.generateFallbackQuestion(subject, difficulty, topic);
        }

        const prompt = `Generate a ${difficulty} level multiple choice question about ${subject}${topic ? ` focusing on ${topic}` : ''}.

Format your response exactly like this:
QUESTION: [Your question here]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
CORRECT: [A, B, C, or D]
EXPLANATION: [Brief explanation of why the answer is correct]

Make it educational and engaging.`;

        try {
            const response = await this.generateResponse(prompt, 300);
            return this.parseQuizResponse(response, subject, difficulty, topic);
        } catch (error) {
            console.error('AI question generation failed:', error);
            return this.generateFallbackQuestion(subject, difficulty, topic);
        }
    }

    parseQuizResponse(response, subject, difficulty, topic) {
        try {
            const lines = response.split('\n').filter(line => line.trim());
            
            let question = '';
            let options = [];
            let correct = 0;
            let explanation = '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('QUESTION:')) {
                    question = trimmed.replace('QUESTION:', '').trim();
                } else if (trimmed.match(/^[A-D]\)/)) {
                    options.push(trimmed.substring(3).trim());
                } else if (trimmed.startsWith('CORRECT:')) {
                    const correctLetter = trimmed.replace('CORRECT:', '').trim();
                    correct = ['A', 'B', 'C', 'D'].indexOf(correctLetter);
                } else if (trimmed.startsWith('EXPLANATION:')) {
                    explanation = trimmed.replace('EXPLANATION:', '').trim();
                }
            }

            if (question && options.length === 4 && explanation) {
                return {
                    question,
                    options,
                    correct: Math.max(0, correct),
                    explanation,
                    difficulty,
                    topic: topic || subject,
                    subject,
                    isAIGenerated: true,
                    aiGenerated: true
                };
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return this.generateFallbackQuestion(subject, difficulty, topic);
        }
    }

    async generateSmartFeedback(question, selectedAnswer, isCorrect, timeSpent) {
        if (!this.modelLoaded) {
            return this.generateFallbackFeedback(question, selectedAnswer, isCorrect, timeSpent);
        }

        const prompt = `A student answered a quiz question ${isCorrect ? 'correctly' : 'incorrectly'} in ${Math.round(timeSpent/1000)} seconds.

Question: ${question.question}
Student selected: ${question.options[selectedAnswer]}
Correct answer: ${question.options[question.correct]}

Provide encouraging feedback with:
1. A motivational message (max 20 words)
2. Learning tip related to this topic (max 30 words)

Format:
ENCOURAGEMENT: [Your encouraging message]
TIP: [Your learning tip]`;

        try {
            const response = await this.generateResponse(prompt, 150);
            return this.parseFeedbackResponse(response, question.explanation);
        } catch (error) {
            return this.generateFallbackFeedback(question, selectedAnswer, isCorrect, timeSpent);
        }
    }

    parseFeedbackResponse(response, originalExplanation) {
        try {
            const lines = response.split('\n').filter(line => line.trim());
            let encouragement = '';
            let learningTip = '';

            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('ENCOURAGEMENT:')) {
                    encouragement = trimmed.replace('ENCOURAGEMENT:', '').trim();
                } else if (trimmed.startsWith('TIP:')) {
                    learningTip = trimmed.replace('TIP:', '').trim();
                }
            }

            return {
                message: originalExplanation,
                encouragement: encouragement || "Great job engaging with the material!",
                learningTip: learningTip || "Review this concept again to strengthen your understanding."
            };
        } catch (error) {
            return {
                message: originalExplanation,
                encouragement: "Keep up the great work!",
                learningTip: "Practice makes perfect!"
            };
        }
    }

    // Fallback methods for when AI isn't available
    initializeFallback() {
        console.log('🔄 Initializing Fallback AI System...');
        this.isInitialized = true;
        this.modelLoaded = false;
    }

    generateFallbackQuestion(subject, difficulty, topic) {
        const fallbackQuestions = {
            'Data Structures': [
                {
                    question: "What is the time complexity of searching in a balanced binary search tree?",
                    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                    correct: 1,
                    explanation: "In a balanced BST, the height is log n, so search operations take O(log n) time.",
                    difficulty,
                    topic: topic || 'Binary Trees',
                    subject,
                    isAIGenerated: false
                }
            ],
            'Machine Learning': [
                {
                    question: "Which algorithm is best for linearly separable data?",
                    options: ["K-Means", "Linear SVM", "Random Forest", "Neural Network"],
                    correct: 1,
                    explanation: "Linear SVM works perfectly for linearly separable data by finding the optimal hyperplane.",
                    difficulty,
                    topic: topic || 'Classification',
                    subject,
                    isAIGenerated: false
                }
            ]
        };

        const questions = fallbackQuestions[subject] || fallbackQuestions['Data Structures'];
        return questions[0];
    }

    generateFallbackFeedback(question, selectedAnswer, isCorrect, timeSpent) {
        const encouragements = [
            "Excellent work! Keep pushing forward!",
            "You're making great progress!",
            "Every mistake is a learning opportunity!",
            "Your dedication to learning shows!"
        ];

        const tips = [
            "Try breaking down complex problems into smaller parts.",
            "Practice similar problems to reinforce your understanding.",
            "Review the fundamentals when you get stuck.",
            "Use visual aids to help understand abstract concepts."
        ];

        return {
            message: question.explanation,
            encouragement: encouragements[Math.floor(Math.random() * encouragements.length)],
            learningTip: tips[Math.floor(Math.random() * tips.length)]
        };
    }

    async generateStudyPlan(userPerformance, subjects) {
        if (!this.modelLoaded) {
            return this.generateFallbackStudyPlan(userPerformance, subjects);
        }

        const prompt = `Create a personalized study plan based on this performance data:
${JSON.stringify(userPerformance, null, 2)}

Subjects: ${subjects.join(', ')}

Provide 3-5 specific recommendations focusing on weak areas and building on strengths.`;

        try {
            const response = await this.generateResponse(prompt, 400);
            return response;
        } catch (error) {
            return this.generateFallbackStudyPlan(userPerformance, subjects);
        }
    }

    generateFallbackStudyPlan(userPerformance, subjects) {
        return `Based on your performance, here's your personalized study plan:

1. **Focus Areas**: Concentrate on topics where your accuracy is below 70%
2. **Daily Practice**: Spend 15-20 minutes on challenging subjects
3. **Review Schedule**: Revisit completed topics every 3-5 days
4. **Progress Tracking**: Take quizzes regularly to monitor improvement
5. **Balanced Learning**: Mix difficult topics with easier ones to maintain motivation

Keep up the great work! Consistent practice leads to mastery.`;
    }

    // Public API methods
    async generateQuestion(subject, difficulty = 'medium', topic = '') {
        return await this.generateQuizQuestion(subject, difficulty, topic);
    }

    async provideFeedback(question, selectedAnswer, isCorrect, timeSpent) {
        return await this.generateSmartFeedback(question, selectedAnswer, isCorrect, timeSpent);
    }

    async createStudyPlan(userPerformance, subjects) {
        return await this.generateStudyPlan(userPerformance, subjects);
    }

    isReady() {
        return this.isInitialized && this.modelLoaded;
    }

    getStatus() {
        return {
            initialized: this.isInitialized,
            modelLoaded: this.modelLoaded,
            loadingProgress: this.loadingProgress,
            usingRealAI: this.modelLoaded
        };
    }
}

// Initialize the Real AI Engine
window.RealAIEngine = new RealAIEngine();

// Expose to global scope
window.AIEngine = window.RealAIEngine;

console.log('🚀 Real AI Engine ready for initialization!');
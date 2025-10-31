// Simplified Real AI Engine with WebLLM - Easier Setup

class SimpleAIEngine {
    constructor() {
        this.isInitialized = false;
        this.engine = null;
        this.modelLoaded = false;
        this.loadingProgress = 0;
        this.fallbackMode = false;
    }

    async initialize() {
        try {
            console.log('Initializing Simple AI Engine...');
            
            // Try to load WebLLM
            await this.loadWebLLM();
            
            // Initialize the engine
            await this.initializeEngine();
            
            this.isInitialized = true;
            console.log('Simple AI Engine ready!');
            return true;
            
        } catch (error) {
            console.error('AI initialization failed:', error);
            this.initializeFallback();
            return false;
        }
    }

    async loadWebLLM() {
        // First, try to import from CDN
        if (typeof window.webllm === 'undefined') {
            console.log('Loading WebLLM from CDN...');
            
            // Method 1: Try dynamic import
            try {
                const webllmModule = await import('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/lib/web-llm.js');
                window.webllm = webllmModule;
                console.log('WebLLM loaded via import');
                return;
            } catch (error) {
                console.log('Import failed, trying script tag method...');
            }
            
            // Method 2: Script tag approach
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/lib/web-llm.js';
                script.onload = () => {
                    console.log('WebLLM script loaded');
                    resolve();
                };
                script.onerror = () => {
                    reject(new Error('Failed to load WebLLM script'));
                };
                document.head.appendChild(script);
                
                // Timeout after 10 seconds
                setTimeout(() => {
                    reject(new Error('WebLLM loading timeout'));
                }, 10000);
            });
        }
    }

    async initializeEngine() {
        if (!window.webllm && !window.MLCEngine) {
            throw new Error('WebLLM not available');
        }

        this.showSimpleLoader();
        
        try {
            // Try to create MLCEngine
            const MLCEngine = window.MLCEngine || window.webllm?.MLCEngine;
            if (!MLCEngine) {
                throw new Error('MLCEngine constructor not found');
            }
            
            this.engine = new MLCEngine();
            
            // Try to reload with a small model
            console.log('Loading Llama-3.2-1B model...');
            
            await this.engine.reload("Llama-3.2-1B-Instruct-q4f32_1-MLC", {
                progressCallback: (progress) => {
                    this.loadingProgress = progress.progress || progress;
                    this.updateSimpleLoader(this.loadingProgress * 100);
                    console.log(`Loading: ${Math.round(this.loadingProgress * 100)}%`);
                }
            });
            
            this.modelLoaded = true;
            this.hideSimpleLoader();
            console.log('AI Model loaded successfully!');
            
            // Test the model
            await this.testModel();
            
        } catch (error) {
            this.hideSimpleLoader();
            throw error;
        }
    }

    showSimpleLoader() {
        const existing = document.getElementById('simple-ai-loader');
        if (existing) existing.remove();
        
        const loader = document.createElement('div');
        loader.id = 'simple-ai-loader';
        loader.innerHTML = `
            <div style="
                position: fixed; top: 20px; right: 20px; z-index: 10000;
                background: rgba(0,0,0,0.9); color: white; padding: 1rem;
                border-radius: 8px; font-family: monospace; min-width: 250px;
                border: 1px solid #667eea;
            ">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <div style="
                        width: 12px; height: 12px; border: 2px solid #667eea;
                        border-top: 2px solid transparent; border-radius: 50%;
                        animation: spin 1s linear infinite;
                    "></div>
                    <span>Loading AI Brain...</span>
                </div>
                <div style="
                    background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; overflow: hidden;
                ">
                    <div id="simple-progress" style="
                        height: 100%; background: #667eea; width: 0%; transition: width 0.3s;
                    "></div>
                </div>
                <div id="simple-status" style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.8;">
                    Initializing...
                </div>
            </div>
            <style>
                @keyframes spin { to { transform: rotate(360deg); } }
            </style>
        `;
        document.body.appendChild(loader);
    }

    updateSimpleLoader(progress) {
        const progressBar = document.getElementById('simple-progress');
        const status = document.getElementById('simple-status');
        
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        
        if (status) {
            if (progress < 25) status.textContent = 'Downloading model...';
            else if (progress < 50) status.textContent = 'Loading weights...';
            else if (progress < 75) status.textContent = 'Optimizing for web...';
            else if (progress < 95) status.textContent = 'Almost ready...';
            else status.textContent = 'Finalizing...';
        }
    }

    hideSimpleLoader() {
        const loader = document.getElementById('simple-ai-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }

    async testModel() {
        try {
            const response = await this.engine.chat.completions.create({
                messages: [{ role: "user", content: "Say 'Hello! I am ready to help with learning.'" }],
                max_tokens: 20,
                temperature: 0.7,
            });
            
            const reply = response.choices[0].message.content;
            console.log('AI Test Response:', reply);
            
            // Show success notification
            this.showNotification('AI is ready! Try the AI Lab.', 'success');
            
        } catch (error) {
            console.warn('AI test failed, but engine might still work:', error);
        }
    }

    async generateResponse(prompt, maxTokens = 150) {
        if (!this.modelLoaded || !this.engine) {
            throw new Error('AI model not ready');
        }

        try {
            const response = await this.engine.chat.completions.create({
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

        const prompt = `Create a ${difficulty} level multiple choice question about ${subject}${topic ? ` (${topic})` : ''}.

Format exactly as:
QUESTION: [question text]
A) [option 1]
B) [option 2] 
C) [option 3]
D) [option 4]
CORRECT: [A, B, C, or D]
EXPLANATION: [brief explanation]

Make it educational and clear.`;

        try {
            const response = await this.generateResponse(prompt, 250);
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

            if (question && options.length === 4 && explanation && correct >= 0) {
                return {
                    question,
                    options,
                    correct,
                    explanation,
                    difficulty,
                    topic: topic || subject,
                    subject,
                    isAIGenerated: true,
                    aiGenerated: true
                };
            } else {
                throw new Error('Invalid AI response format');
            }
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return this.generateFallbackQuestion(subject, difficulty, topic);
        }
    }

    generateFallbackQuestion(subject, difficulty, topic) {
        const fallbacks = {
            'Data Structures': {
                question: "What is the average time complexity of searching in a hash table?",
                options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
                correct: 0,
                explanation: "Hash tables provide O(1) average case search time through direct indexing.",
                difficulty, topic: topic || 'Hash Tables', subject, isAIGenerated: false
            },
            'Machine Learning': {
                question: "Which algorithm is used for classification with linearly separable data?",
                options: ["K-Means", "Linear SVM", "DBSCAN", "PCA"],
                correct: 1,
                explanation: "Linear SVM finds the optimal hyperplane for linearly separable classification problems.",
                difficulty, topic: topic || 'Classification', subject, isAIGenerated: false
            }
        };
        
        return fallbacks[subject] || fallbacks['Data Structures'];
    }

    async generateSmartFeedback(question, selectedAnswer, isCorrect, timeSpent) {
        if (!this.modelLoaded) {
            return {
                message: question.explanation,
                encouragement: isCorrect ? "Great work!" : "Keep learning!",
                learningTip: "Practice makes perfect!"
            };
        }

        const prompt = `Student answered ${isCorrect ? 'correctly' : 'incorrectly'} in ${Math.round(timeSpent/1000)}s.

Question: ${question.question}
Selected: ${question.options[selectedAnswer]}
Correct: ${question.options[question.correct]}

Give brief encouraging feedback (max 100 words).`;

        try {
            const response = await this.generateResponse(prompt, 100);
            return {
                message: question.explanation,
                encouragement: response.slice(0, 100),
                learningTip: "Keep practicing to improve!"
            };
        } catch (error) {
            return {
                message: question.explanation,
                encouragement: isCorrect ? "Excellent!" : "Good attempt!",
                learningTip: "Review the concept and try again."
            };
        }
    }

    initializeFallback() {
        console.log('Using fallback AI system');
        this.isInitialized = true;
        this.fallbackMode = true;
        this.showNotification('AI fallback mode active', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white; padding: 1rem; border-radius: 8px; font-family: sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.innerHTML = `
            <style>
                @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
            </style>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Public API
    isReady() {
        return this.isInitialized;
    }

    getStatus() {
        return {
            initialized: this.isInitialized,
            modelLoaded: this.modelLoaded,
            loadingProgress: this.loadingProgress,
            usingRealAI: this.modelLoaded && !this.fallbackMode,
            fallbackMode: this.fallbackMode
        };
    }
}

// Create global instance
window.SimpleAIEngine = new SimpleAIEngine();
window.AIEngine = window.SimpleAIEngine;

console.log('Simple AI Engine ready for initialization!');
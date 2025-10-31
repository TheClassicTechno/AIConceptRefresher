// AI Engine - Provides intelligent question generation and learning assistance
class AIEngine {
    constructor() {
        this.initialized = false;
        this.questionTemplates = this.initializeTemplates();
        this.learningPatterns = new Map();
        this.difficultyAdjuster = new DifficultyAdjuster();
        this.nlpProcessor = new NLPProcessor();
    }

    // Initialize AI with pre-trained patterns and templates
    async initialize() {
        try {
            console.log('Initializing AI Engine...');
            await this.loadKnowledgeBase();
            await this.initializeNLP();
            this.initialized = true;
            console.log('AI Engine initialized successfully');
            return true;
        } catch (error) {
            console.error('AI initialization failed:', error);
            return false;
        }
    }

    // Generate intelligent questions based on user performance
    async generateQuestion(subject, userLevel, weakTopics = []) {
        if (!this.initialized) {
            await this.initialize();
        }

        const difficulty = this.calculateOptimalDifficulty(userLevel, subject);
        const topic = this.selectOptimalTopic(subject, weakTopics);
        
        return this.createQuestion(subject, topic, difficulty);
    }

    // Create contextual questions using AI patterns
    createQuestion(subject, topic, difficulty) {
        const templates = this.questionTemplates[subject]?.[topic]?.[difficulty] || [];
        if (templates.length === 0) {
            return this.fallbackQuestionGeneration(subject, topic, difficulty);
        }

        const template = templates[Math.floor(Math.random() * templates.length)];
        return this.instantiateTemplate(template, subject, topic);
    }

    // AI-powered question templates with dynamic content
    initializeTemplates() {
        return {
            mathematics: {
                calculus: {
                    beginner: [
                        {
                            pattern: "Find the derivative of {function}",
                            generator: () => this.generateDerivativeQuestion(),
                            topics: ["derivatives", "basic_calculus"]
                        },
                        {
                            pattern: "What is the limit of {expression} as x approaches {value}?",
                            generator: () => this.generateLimitQuestion(),
                            topics: ["limits", "continuity"]
                        }
                    ],
                    intermediate: [
                        {
                            pattern: "Evaluate the integral ∫{integrand}dx",
                            generator: () => this.generateIntegralQuestion(),
                            topics: ["integration", "antiderivatives"]
                        }
                    ]
                },
                algebra: {
                    beginner: [
                        {
                            pattern: "Solve for x: {equation}",
                            generator: () => this.generateAlgebraQuestion(),
                            topics: ["equations", "solving"]
                        }
                    ]
                }
            },
            artificial_intelligence: {
                machine_learning: {
                    beginner: [
                        {
                            pattern: "What is the purpose of {algorithm} in machine learning?",
                            generator: () => this.generateMLConceptQuestion(),
                            topics: ["algorithms", "concepts"]
                        }
                    ],
                    intermediate: [
                        {
                            pattern: "Explain how {technique} addresses the {problem} problem",
                            generator: () => this.generateMLProblemQuestion(),
                            topics: ["techniques", "problem_solving"]
                        }
                    ]
                }
            }
        };
    }

    // Generate mathematical questions with AI
    generateDerivativeQuestion() {
        const functions = [
            { expr: "x³ + 2x² - 5x + 3", answer: "3x² + 4x - 5", explanation: "Apply power rule to each term" },
            { expr: "sin(x) + cos(x)", answer: "cos(x) - sin(x)", explanation: "Derivative of sin(x) is cos(x), derivative of cos(x) is -sin(x)" },
            { expr: "e^(2x)", answer: "2e^(2x)", explanation: "Use chain rule: d/dx[e^(u)] = e^(u) * du/dx" },
            { expr: "ln(x²)", answer: "2/x", explanation: "Use chain rule: d/dx[ln(u)] = (1/u) * du/dx" }
        ];

        const func = functions[Math.floor(Math.random() * functions.length)];
        return {
            question: `What is the derivative of f(x) = ${func.expr}?`,
            options: this.generateMathOptions(func.answer),
            correct: 0,
            explanation: func.explanation,
            difficulty: "intermediate",
            topic: "Calculus",
            aiGenerated: true
        };
    }

    generateMLConceptQuestion() {
        const concepts = [
            {
                algorithm: "backpropagation",
                purpose: "calculating gradients for neural network weight updates",
                explanation: "Backpropagation efficiently computes the gradient of the loss function with respect to network weights"
            },
            {
                algorithm: "gradient descent",
                purpose: "optimizing model parameters by minimizing the loss function",
                explanation: "Gradient descent iteratively updates parameters in the direction that reduces the loss"
            },
            {
                algorithm: "cross-validation",
                purpose: "evaluating model performance and preventing overfitting",
                explanation: "Cross-validation provides a robust estimate of model performance on unseen data"
            }
        ];

        const concept = concepts[Math.floor(Math.random() * concepts.length)];
        return {
            question: `What is the primary purpose of ${concept.algorithm} in machine learning?`,
            options: this.generateMLOptions(concept.purpose),
            correct: 0,
            explanation: concept.explanation,
            difficulty: "intermediate",
            topic: "Machine Learning",
            aiGenerated: true
        };
    }

    // Generate plausible wrong answers for math questions
    generateMathOptions(correctAnswer) {
        const options = [correctAnswer];
        
        // Generate mathematically plausible but incorrect answers
        const variations = [
            correctAnswer.replace(/\d+/g, (match) => String(parseInt(match) + 1)),
            correctAnswer.replace(/\d+/g, (match) => String(parseInt(match) - 1)),
            correctAnswer.replace(/\+/g, "-").replace(/-/g, "+")
        ];

        variations.forEach(variation => {
            if (variation !== correctAnswer && options.length < 4) {
                options.push(variation);
            }
        });

        // Fill remaining slots with generic wrong answers
        while (options.length < 4) {
            options.push(`${Math.floor(Math.random() * 10)}x + ${Math.floor(Math.random() * 10)}`);
        }

        return this.shuffleArray(options);
    }

    // Generate plausible options for ML questions
    generateMLOptions(correctAnswer) {
        const commonWrongAnswers = [
            "data preprocessing and cleaning",
            "model visualization and interpretation", 
            "feature selection and engineering",
            "hyperparameter tuning and optimization",
            "handling missing data and outliers"
        ];

        const options = [correctAnswer];
        const shuffledWrong = this.shuffleArray(commonWrongAnswers);
        
        for (let i = 0; i < 3 && i < shuffledWrong.length; i++) {
            options.push(shuffledWrong[i]);
        }

        return this.shuffleArray(options);
    }

    // Calculate optimal difficulty based on user performance
    calculateOptimalDifficulty(userLevel, subject) {
        const performance = window.ProgressTracker?.getSubjectPerformance(subject);
        
        if (!performance || performance.totalQuestions < 5) {
            return 'beginner';
        }

        const accuracy = performance.correctAnswers / performance.totalQuestions;
        
        if (accuracy > 0.8) return 'advanced';
        if (accuracy > 0.6) return 'intermediate';
        return 'beginner';
    }

    // AI-powered topic selection
    selectOptimalTopic(subject, weakTopics) {
        if (weakTopics.length > 0) {
            // Focus on weak areas with 70% probability
            if (Math.random() < 0.7) {
                return weakTopics[Math.floor(Math.random() * weakTopics.length)];
            }
        }

        // Select from all available topics
        const subjectData = window.SubjectsManager?.getSubject(subject);
        if (subjectData?.topics) {
            return subjectData.topics[Math.floor(Math.random() * subjectData.topics.length)];
        }

        return 'general';
    }

    // Provide intelligent feedback based on answer patterns
    generateSmartFeedback(question, userAnswer, isCorrect, timeSpent) {
        let feedback = {
            message: "",
            suggestion: "",
            encouragement: "",
            learningTip: ""
        };

        if (isCorrect) {
            feedback.encouragement = this.generatePositiveFeedback(timeSpent);
            feedback.learningTip = this.generateLearningTip(question.topic, 'correct');
        } else {
            feedback.message = this.generateCorrectiveFeedback(question, userAnswer);
            feedback.suggestion = this.generateStudySuggestion(question.topic);
            feedback.learningTip = this.generateLearningTip(question.topic, 'incorrect');
        }

        return feedback;
    }

    generatePositiveFeedback(timeSpent) {
        const quick = timeSpent < 10000; // Less than 10 seconds
        const messages = quick 
            ? ["Excellent! Quick and accurate.", "Great intuition!", "Perfect - you really know this!"]
            : ["Well done! Good thinking process.", "Correct! Nice work.", "Right answer! Keep it up."];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }

    generateCorrectiveFeedback(question, userAnswer) {
        return `Not quite right. The correct approach is: ${question.explanation}`;
    }

    generateStudySuggestion(topic) {
        const suggestions = {
            "Calculus": "Try practicing more derivative rules and integration techniques.",
            "Machine Learning": "Review the fundamental concepts and algorithms in ML.",
            "Data Structures": "Practice implementing these structures from scratch.",
            "Algorithms": "Focus on understanding the time and space complexity.",
            "default": "Review the fundamentals and practice similar problems."
        };

        return suggestions[topic] || suggestions.default;
    }

    generateLearningTip(topic, performance) {
        const tips = {
            "Calculus": {
                correct: "Try solving similar problems with different functions to reinforce the pattern.",
                incorrect: "Break down complex problems into smaller steps and practice the basic rules."
            },
            "Machine Learning": {
                correct: "Connect this concept to real-world applications to deepen understanding.",
                incorrect: "Try to understand the intuition behind the algorithm before memorizing steps."
            },
            default: {
                correct: "Great! Try teaching this concept to someone else to solidify your understanding.",
                incorrect: "Don't worry - this is a common area of confusion. Practice makes perfect!"
            }
        };

        return tips[topic]?.[performance] || tips.default[performance];
    }

    // Analyze learning patterns with AI
    analyzeLearningPattern(userHistory) {
        const patterns = {
            timeOfDay: this.analyzeTimePreferences(userHistory),
            difficultyProgression: this.analyzeDifficultyTrends(userHistory),
            topicAffinity: this.analyzeTopicPreferences(userHistory),
            learningStyle: this.identifyLearningStyle(userHistory)
        };

        return patterns;
    }

    analyzeTimePreferences(history) {
        const timePerformance = {};
        history.forEach(session => {
            const hour = new Date(session.timestamp).getHours();
            const timeSlot = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
            
            if (!timePerformance[timeSlot]) {
                timePerformance[timeSlot] = { total: 0, correct: 0 };
            }
            
            timePerformance[timeSlot].total++;
            if (session.isCorrect) timePerformance[timeSlot].correct++;
        });

        // Find best time slot
        let bestTime = 'morning';
        let bestAccuracy = 0;
        
        Object.entries(timePerformance).forEach(([time, data]) => {
            const accuracy = data.correct / data.total;
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
                bestTime = time;
            }
        });

        return { bestTime, accuracy: bestAccuracy };
    }

    // Utility functions
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    async loadKnowledgeBase() {
        // Simulate loading AI knowledge base
        return new Promise(resolve => setTimeout(resolve, 500));
    }

    async initializeNLP() {
        // Simulate NLP initialization
        return new Promise(resolve => setTimeout(resolve, 300));
    }

    fallbackQuestionGeneration(subject, topic, difficulty) {
        // Fallback to existing question bank
        const subjectData = window.SubjectsManager?.getSubject(subject);
        if (subjectData?.questions) {
            const filtered = subjectData.questions.filter(q => 
                q.difficulty === difficulty || 
                (topic && q.topic.toLowerCase().includes(topic.toLowerCase()))
            );
            
            if (filtered.length > 0) {
                return filtered[Math.floor(Math.random() * filtered.length)];
            }
            
            return subjectData.questions[Math.floor(Math.random() * subjectData.questions.length)];
        }
        
        return null;
    }
}

// Difficulty Adjustment AI Component
class DifficultyAdjuster {
    constructor() {
        this.adjustmentFactors = {
            timeSpent: 0.3,
            accuracy: 0.5,
            streakLength: 0.2
        };
    }

    calculateNextDifficulty(currentDifficulty, performance) {
        const score = this.calculatePerformanceScore(performance);
        
        if (score > 0.8 && currentDifficulty !== 'advanced') {
            return this.increaseDifficulty(currentDifficulty);
        } else if (score < 0.4 && currentDifficulty !== 'beginner') {
            return this.decreaseDifficulty(currentDifficulty);
        }
        
        return currentDifficulty;
    }

    calculatePerformanceScore(performance) {
        const { accuracy, averageTime, streak } = performance;
        
        // Normalize factors
        const accuracyScore = Math.min(accuracy, 1.0);
        const timeScore = Math.max(0, 1 - (averageTime / 30000)); // 30 seconds baseline
        const streakScore = Math.min(streak / 5, 1.0); // 5 question streak baseline
        
        return (
            accuracyScore * this.adjustmentFactors.accuracy +
            timeScore * this.adjustmentFactors.timeSpent +
            streakScore * this.adjustmentFactors.streakLength
        );
    }

    increaseDifficulty(current) {
        const levels = ['beginner', 'intermediate', 'advanced'];
        const index = levels.indexOf(current);
        return index < levels.length - 1 ? levels[index + 1] : current;
    }

    decreaseDifficulty(current) {
        const levels = ['beginner', 'intermediate', 'advanced'];
        const index = levels.indexOf(current);
        return index > 0 ? levels[index - 1] : current;
    }
}

// Simple NLP Processing Component
class NLPProcessor {
    constructor() {
        this.keywordMapping = this.initializeKeywords();
    }

    initializeKeywords() {
        return {
            mathematics: {
                positive: ['solve', 'calculate', 'find', 'determine', 'evaluate'],
                concepts: ['derivative', 'integral', 'limit', 'function', 'equation', 'variable'],
                difficulty_indicators: ['complex', 'advanced', 'basic', 'simple', 'challenging']
            },
            programming: {
                positive: ['implement', 'code', 'debug', 'optimize', 'design'],
                concepts: ['algorithm', 'data structure', 'complexity', 'recursion', 'iteration'],
                difficulty_indicators: ['efficient', 'optimal', 'brute force', 'naive', 'sophisticated']
            }
        };
    }

    processUserInput(input, context = 'general') {
        const processed = {
            intent: this.detectIntent(input),
            concepts: this.extractConcepts(input, context),
            difficulty: this.estimateDifficulty(input),
            sentiment: this.analyzeSentiment(input)
        };

        return processed;
    }

    detectIntent(input) {
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('help') || lowerInput.includes('explain')) {
            return 'help_request';
        } else if (lowerInput.includes('practice') || lowerInput.includes('quiz')) {
            return 'practice_request';
        } else if (lowerInput.includes('difficult') || lowerInput.includes('hard')) {
            return 'difficulty_feedback';
        }
        
        return 'general';
    }

    extractConcepts(input, context) {
        const keywords = this.keywordMapping[context] || this.keywordMapping.mathematics;
        const concepts = [];
        
        keywords.concepts.forEach(concept => {
            if (input.toLowerCase().includes(concept)) {
                concepts.push(concept);
            }
        });
        
        return concepts;
    }

    estimateDifficulty(input) {
        const advancedTerms = ['complex', 'advanced', 'sophisticated', 'optimize', 'efficient'];
        const basicTerms = ['simple', 'basic', 'easy', 'fundamental', 'introduction'];
        
        const lowerInput = input.toLowerCase();
        
        for (const term of advancedTerms) {
            if (lowerInput.includes(term)) return 'advanced';
        }
        
        for (const term of basicTerms) {
            if (lowerInput.includes(term)) return 'beginner';
        }
        
        return 'intermediate';
    }

    analyzeSentiment(input) {
        const positiveWords = ['good', 'great', 'excellent', 'love', 'like', 'enjoy', 'easy'];
        const negativeWords = ['bad', 'difficult', 'hard', 'hate', 'confusing', 'frustrating'];
        
        const lowerInput = input.toLowerCase();
        let score = 0;
        
        positiveWords.forEach(word => {
            if (lowerInput.includes(word)) score += 1;
        });
        
        negativeWords.forEach(word => {
            if (lowerInput.includes(word)) score -= 1;
        });
        
        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }
}

// Initialize AI Engine globally
const aiEngine = new AIEngine();

// Export for use in other modules
window.AIEngine = aiEngine;
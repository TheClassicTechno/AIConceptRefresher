// Quiz Engine - Handles quiz logic, AI-powered features, and adaptive learning
class QuizEngine {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.startTime = null;
        this.questionStartTime = null;
        this.difficulty = 'intermediate';
        this.adaptiveLearning = true;
        this.spacedRepetition = true;
    }

    // Start a new quiz
    startQuiz(subjectKey, options = {}) {
        const subject = window.SubjectsManager.getSubject(subjectKey);
        if (!subject) {
            console.error('Subject not found:', subjectKey);
            return false;
        }

        // Quiz configuration
        const config = {
            questionCount: options.questionCount || 10,
            difficulty: options.difficulty || 'mixed',
            adaptiveLearning: options.adaptiveLearning !== false,
            timeLimit: options.timeLimit || null,
            ...options
        };

        // Get questions with AI-powered selection
        const questions = this.selectQuestionsWithAI(subject, config);
        
        this.currentQuiz = {
            subject: subject,
            subjectKey: subjectKey,
            questions: questions,
            config: config,
            startTime: Date.now(),
            totalQuestions: questions.length
        };

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.startTime = Date.now();

        // Show quiz interface
        this.showQuizInterface();
        this.displayCurrentQuestion();

        return true;
    }

    // AI-powered question selection
    selectQuestionsWithAI(subject, config) {
        let questions = [...subject.questions];
        
        // Get user's performance history for this subject
        const performanceData = window.ProgressTracker.getSubjectPerformance(subject.name);
        
        if (config.adaptiveLearning && performanceData) {
            questions = this.adaptiveQuestionSelection(questions, performanceData);
        }

        // Apply difficulty filtering
        if (config.difficulty !== 'mixed') {
            questions = questions.filter(q => q.difficulty === config.difficulty);
        }

        // Spaced repetition: prioritize questions based on last attempt
        if (this.spacedRepetition) {
            questions = this.applySpacedRepetition(questions, performanceData);
        }

        // Ensure we have enough questions
        if (questions.length < config.questionCount) {
            // Add more questions if needed, relaxing filters
            const additionalQuestions = subject.questions.filter(q => !questions.includes(q));
            questions = [...questions, ...additionalQuestions];
        }

        // Shuffle and limit
        return this.shuffleArray(questions).slice(0, config.questionCount);
    }

    // Adaptive question selection based on performance
    adaptiveQuestionSelection(questions, performanceData) {
        const weakTopics = this.identifyWeakTopics(performanceData);
        const strongTopics = this.identifyStrongTopics(performanceData);

        // Prioritize questions from weak topics (70% weight)
        // Include some from strong topics for reinforcement (30% weight)
        const weakTopicQuestions = questions.filter(q => weakTopics.includes(q.topic));
        const strongTopicQuestions = questions.filter(q => strongTopics.includes(q.topic));
        const otherQuestions = questions.filter(q => !weakTopics.includes(q.topic) && !strongTopics.includes(q.topic));

        // Weighted selection
        const selectedQuestions = [
            ...this.shuffleArray(weakTopicQuestions),
            ...this.shuffleArray(otherQuestions),
            ...this.shuffleArray(strongTopicQuestions).slice(0, Math.ceil(questions.length * 0.3))
        ];

        return selectedQuestions;
    }

    // Apply spaced repetition algorithm
    applySpacedRepetition(questions, performanceData) {
        const now = Date.now();
        const spacedQuestions = questions.map(question => {
            const lastAttempt = performanceData.questionHistory?.[question.question];
            if (lastAttempt) {
                const daysSinceAttempt = (now - lastAttempt.timestamp) / (1000 * 60 * 60 * 24);
                const correctness = lastAttempt.correct ? 1 : 0;
                
                // Spaced repetition intervals (in days): incorrect=1, correct=3,7,14,30...
                const intervals = correctness ? [3, 7, 14, 30, 90] : [1, 1, 3, 7, 14];
                const repetitionLevel = Math.min(lastAttempt.repetitionLevel || 0, intervals.length - 1);
                const nextReviewDay = intervals[repetitionLevel];

                // Priority score (higher = more urgent to review)
                question.spacedRepetitionScore = Math.max(0, daysSinceAttempt - nextReviewDay);
            } else {
                question.spacedRepetitionScore = 10; // New questions get high priority
            }
            return question;
        });

        // Sort by spaced repetition score (descending)
        return spacedQuestions.sort((a, b) => (b.spacedRepetitionScore || 0) - (a.spacedRepetitionScore || 0));
    }

    // Identify weak topics based on performance
    identifyWeakTopics(performanceData) {
        const topicScores = performanceData.topicScores || {};
        return Object.keys(topicScores)
            .filter(topic => topicScores[topic] < 0.7) // Less than 70% correct
            .sort((a, b) => topicScores[a] - topicScores[b]); // Worst first
    }

    // Identify strong topics
    identifyStrongTopics(performanceData) {
        const topicScores = performanceData.topicScores || {};
        return Object.keys(topicScores)
            .filter(topic => topicScores[topic] >= 0.8) // 80% or higher
            .sort((a, b) => topicScores[b] - topicScores[a]); // Best first
    }

    // Shuffle array utility
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Show quiz interface
    showQuizInterface() {
        // Hide other sections
        document.getElementById('home').classList.add('hidden');
        document.getElementById('subjects').classList.add('hidden');
        document.getElementById('progress').classList.add('hidden');
        
        // Show quiz section
        document.getElementById('quiz').classList.remove('hidden');
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    }

    // Display current question
    displayCurrentQuestion() {
        if (!this.currentQuiz || this.currentQuestionIndex >= this.currentQuiz.questions.length) {
            this.endQuiz();
            return;
        }

        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        this.questionStartTime = Date.now();

        // Update progress
        const progressPercent = ((this.currentQuestionIndex + 1) / this.currentQuiz.totalQuestions) * 100;
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
        document.getElementById('progressText').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.currentQuiz.totalQuestions}`;

        // Display question
        document.getElementById('questionText').textContent = question.question;

        // Display options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'option';
            optionButton.textContent = option;
            optionButton.onclick = () => this.selectOption(index);
            optionButton.dataset.index = index;
            optionsContainer.appendChild(optionButton);
        });

        // Reset UI state
        document.getElementById('submitAnswer').disabled = true;
        document.getElementById('submitAnswer').style.display = 'inline-flex';
        document.getElementById('nextQuestion').style.display = 'none';
        document.getElementById('feedback').style.display = 'none';

        // Clear previous selections
        this.selectedOption = null;
    }

    // Handle option selection
    selectOption(optionIndex) {
        // Clear previous selections
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Mark selected option
        const selectedOption = document.querySelector(`[data-index="${optionIndex}"]`);
        selectedOption.classList.add('selected');

        this.selectedOption = optionIndex;
        document.getElementById('submitAnswer').disabled = false;
    }

    // Submit answer
    submitAnswer() {
        if (this.selectedOption === null) return;

        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const isCorrect = this.selectedOption === question.correct;
        const timeSpent = Date.now() - this.questionStartTime;

        // Record answer
        const answerData = {
            questionIndex: this.currentQuestionIndex,
            question: question.question,
            selectedOption: this.selectedOption,
            correctOption: question.correct,
            isCorrect: isCorrect,
            timeSpent: timeSpent,
            difficulty: question.difficulty,
            topic: question.topic,
            timestamp: Date.now()
        };

        this.answers.push(answerData);

        if (isCorrect) {
            this.score++;
        }

        // Show feedback
        this.showAnswerFeedback(question, isCorrect);

        // Update UI
        document.getElementById('submitAnswer').style.display = 'none';
        document.getElementById('nextQuestion').style.display = 'inline-flex';

        // Record progress
        window.ProgressTracker.recordAnswer(this.currentQuiz.subjectKey, answerData);
    }

    // Show answer feedback
    showAnswerFeedback(question, isCorrect) {
        const feedback = document.getElementById('feedback');
        const options = document.querySelectorAll('.option');

        // Highlight correct and incorrect answers
        options.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === this.selectedOption && !isCorrect) {
                option.classList.add('incorrect');
            }
            option.onclick = null; // Disable further clicks
        });

        // Show feedback message
        feedback.innerHTML = `
            <div class="feedback-content ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="feedback-header">
                    <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <strong>${isCorrect ? 'Correct' : 'Incorrect'}</strong>
                </div>
                <p>${question.explanation}</p>
                <div class="feedback-meta">
                    <span class="topic-tag">${question.topic}</span>
                    <span class="difficulty-tag">${question.difficulty}</span>
                </div>
            </div>
        `;
        feedback.style.display = 'block';
        feedback.classList.add('fade-in');
    }

    // Move to next question
    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayCurrentQuestion();
    }

    // End quiz and show results
    endQuiz() {
        const totalTime = Date.now() - this.startTime;
        const accuracy = (this.score / this.currentQuiz.totalQuestions) * 100;

        // Calculate detailed statistics
        const stats = this.calculateQuizStatistics();

        // Record quiz completion
        window.ProgressTracker.recordQuizCompletion(this.currentQuiz.subjectKey, {
            score: this.score,
            totalQuestions: this.currentQuiz.totalQuestions,
            accuracy: accuracy,
            totalTime: totalTime,
            answers: this.answers,
            stats: stats,
            timestamp: Date.now()
        });

        // Show results
        this.showQuizResults(stats);
    }

    // Calculate detailed quiz statistics
    calculateQuizStatistics() {
        const topicScores = {};
        const difficultyScores = {};
        let totalTime = 0;
        let fastestAnswer = Infinity;
        let slowestAnswer = 0;

        this.answers.forEach(answer => {
            // Topic analysis
            if (!topicScores[answer.topic]) {
                topicScores[answer.topic] = { correct: 0, total: 0 };
            }
            topicScores[answer.topic].total++;
            if (answer.isCorrect) topicScores[answer.topic].correct++;

            // Difficulty analysis
            if (!difficultyScores[answer.difficulty]) {
                difficultyScores[answer.difficulty] = { correct: 0, total: 0 };
            }
            difficultyScores[answer.difficulty].total++;
            if (answer.isCorrect) difficultyScores[answer.difficulty].correct++;

            // Time analysis
            totalTime += answer.timeSpent;
            fastestAnswer = Math.min(fastestAnswer, answer.timeSpent);
            slowestAnswer = Math.max(slowestAnswer, answer.timeSpent);
        });

        return {
            accuracy: (this.score / this.currentQuiz.totalQuestions) * 100,
            totalTime: totalTime,
            averageTime: totalTime / this.answers.length,
            fastestAnswer: fastestAnswer === Infinity ? 0 : fastestAnswer,
            slowestAnswer: slowestAnswer,
            topicScores: topicScores,
            difficultyScores: difficultyScores,
            score: this.score,
            totalQuestions: this.currentQuiz.totalQuestions
        };
    }

    // Show quiz results
    showQuizResults(stats) {
        const resultHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <i class="fas fa-trophy"></i>
                    <h2>Quiz Complete</h2>
                    <div class="final-score">
                        <span class="score">${stats.score}/${stats.totalQuestions}</span>
                        <span class="accuracy">${stats.accuracy.toFixed(1)}%</span>
                    </div>
                </div>
                
                <div class="results-stats">
                    <div class="stat-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <strong>Total Time</strong>
                            <span>${this.formatTime(stats.totalTime)}</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-tachometer-alt"></i>
                        <div>
                            <strong>Average Time</strong>
                            <span>${this.formatTime(stats.averageTime)}</span>
                        </div>
                    </div>
                </div>

                <div class="topic-breakdown">
                    <h3>Topic Performance</h3>
                    ${Object.entries(stats.topicScores).map(([topic, data]) => `
                        <div class="topic-result">
                            <span class="topic-name">${topic}</span>
                            <div class="topic-bar">
                                <div class="topic-fill" style="width: ${(data.correct/data.total)*100}%"></div>
                            </div>
                            <span class="topic-score">${data.correct}/${data.total}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="results-actions">
                    <button class="btn btn-primary" onclick="quizEngine.retakeQuiz()">
                        <i class="fas fa-redo"></i> Retake Quiz
                    </button>
                    <button class="btn btn-secondary" onclick="showSubjects()">
                        <i class="fas fa-book"></i> Choose Another Subject
                    </button>
                    <button class="btn btn-secondary" onclick="viewProgress()">
                        <i class="fas fa-chart-line"></i> View Progress
                    </button>
                </div>
            </div>
        `;

        document.querySelector('.quiz-content').innerHTML = resultHTML;
    }

    // Format time in minutes and seconds
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }

    // Retake current quiz
    retakeQuiz() {
        if (this.currentQuiz) {
            this.startQuiz(this.currentQuiz.subjectKey, this.currentQuiz.config);
        }
    }

    // Exit quiz
    exitQuiz() {
        // Confirm exit if quiz is in progress
        if (this.currentQuestionIndex < this.currentQuiz?.totalQuestions && this.answers.length > 0) {
            if (!confirm('Are you sure you want to exit? Your progress will be lost.')) {
                return;
            }
        }

        // Reset quiz state
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];

        // Show subjects section
        showSubjects();
    }
}

// Create global quiz engine instance
const quizEngine = new QuizEngine();

// Global functions for HTML onclick handlers
function startQuiz(subjectKey) {
    quizEngine.startQuiz(subjectKey);
}

function submitAnswer() {
    quizEngine.submitAnswer();
}

function nextQuestion() {
    quizEngine.nextQuestion();
}

function exitQuiz() {
    quizEngine.exitQuiz();
}

// Export for use in other modules
window.QuizEngine = QuizEngine;
window.quizEngine = quizEngine;
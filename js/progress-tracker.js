// Progress Tracker - Manages user progress, analytics, and learning patterns
class ProgressTracker {
    constructor() {
        this.storageKey = 'conceptRefresher_progress';
        this.data = this.loadProgress();
        this.initializeData();
    }

    // Initialize default data structure
    initializeData() {
        if (!this.data.user) {
            this.data.user = {
                totalQuestions: 0,
                correctAnswers: 0,
                totalTime: 0,
                streakCurrent: 0,
                streakBest: 0,
                daysActive: 0,
                lastActive: null,
                startDate: Date.now()
            };
        }

        if (!this.data.subjects) {
            this.data.subjects = {};
        }

        if (!this.data.sessions) {
            this.data.sessions = [];
        }

        if (!this.data.analytics) {
            this.data.analytics = {
                weakTopics: [],
                strongTopics: [],
                learningPatterns: {},
                recommendations: []
            };
        }
    }

    // Load progress from localStorage
    loadProgress() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading progress:', error);
            return {};
        }
    }

    // Save progress to localStorage
    saveProgress() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    // Record a single answer
    recordAnswer(subjectKey, answerData) {
        const subject = this.getOrCreateSubject(subjectKey);
        
        // Update subject stats
        subject.totalQuestions++;
        if (answerData.isCorrect) {
            subject.correctAnswers++;
        }
        subject.totalTime += answerData.timeSpent;
        subject.lastAttempt = answerData.timestamp;

        // Update topic performance
        if (!subject.topicPerformance) {
            subject.topicPerformance = {};
        }
        
        const topic = answerData.topic;
        if (!subject.topicPerformance[topic]) {
            subject.topicPerformance[topic] = {
                total: 0,
                correct: 0,
                averageTime: 0,
                lastAttempt: 0
            };
        }

        const topicData = subject.topicPerformance[topic];
        topicData.total++;
        if (answerData.isCorrect) {
            topicData.correct++;
        }
        topicData.averageTime = ((topicData.averageTime * (topicData.total - 1)) + answerData.timeSpent) / topicData.total;
        topicData.lastAttempt = answerData.timestamp;

        // Update difficulty performance
        if (!subject.difficultyPerformance) {
            subject.difficultyPerformance = {};
        }

        const difficulty = answerData.difficulty;
        if (!subject.difficultyPerformance[difficulty]) {
            subject.difficultyPerformance[difficulty] = {
                total: 0,
                correct: 0,
                averageTime: 0
            };
        }

        const diffData = subject.difficultyPerformance[difficulty];
        diffData.total++;
        if (answerData.isCorrect) {
            diffData.correct++;
        }
        diffData.averageTime = ((diffData.averageTime * (diffData.total - 1)) + answerData.timeSpent) / diffData.total;

        // Record individual question for spaced repetition
        if (!subject.questionHistory) {
            subject.questionHistory = {};
        }

        const questionKey = answerData.question;
        if (!subject.questionHistory[questionKey]) {
            subject.questionHistory[questionKey] = {
                attempts: 0,
                correct: 0,
                lastAttempt: 0,
                repetitionLevel: 0,
                averageTime: 0
            };
        }

        const questionData = subject.questionHistory[questionKey];
        questionData.attempts++;
        if (answerData.isCorrect) {
            questionData.correct++;
            questionData.repetitionLevel = Math.min(questionData.repetitionLevel + 1, 5);
        } else {
            questionData.repetitionLevel = Math.max(questionData.repetitionLevel - 1, 0);
        }
        questionData.lastAttempt = answerData.timestamp;
        questionData.averageTime = ((questionData.averageTime * (questionData.attempts - 1)) + answerData.timeSpent) / questionData.attempts;

        // Update global stats
        this.data.user.totalQuestions++;
        if (answerData.isCorrect) {
            this.data.user.correctAnswers++;
        }
        this.data.user.totalTime += answerData.timeSpent;

        this.saveProgress();
    }

    // Record quiz completion
    recordQuizCompletion(subjectKey, quizData) {
        const subject = this.getOrCreateSubject(subjectKey);
        
        // Update quiz history
        if (!subject.quizHistory) {
            subject.quizHistory = [];
        }

        subject.quizHistory.push({
            timestamp: quizData.timestamp,
            score: quizData.score,
            totalQuestions: quizData.totalQuestions,
            accuracy: quizData.accuracy,
            totalTime: quizData.totalTime,
            topicBreakdown: quizData.stats.topicScores,
            difficultyBreakdown: quizData.stats.difficultyScores
        });

        // Keep only last 50 quiz attempts per subject
        if (subject.quizHistory.length > 50) {
            subject.quizHistory = subject.quizHistory.slice(-50);
        }

        // Update session data
        this.recordSession(subjectKey, quizData);

        // Update streaks and activity
        this.updateStreakAndActivity(quizData.accuracy >= 70); // 70% threshold for maintaining streak

        // Update analytics
        this.updateAnalytics();

        this.saveProgress();
    }

    // Record learning session
    recordSession(subjectKey, quizData) {
        const session = {
            timestamp: quizData.timestamp,
            subject: subjectKey,
            score: quizData.score,
            totalQuestions: quizData.totalQuestions,
            accuracy: quizData.accuracy,
            duration: quizData.totalTime,
            topicsStudied: Object.keys(quizData.stats.topicScores),
            averageResponseTime: quizData.stats.averageTime
        };

        this.data.sessions.push(session);

        // Keep only last 100 sessions
        if (this.data.sessions.length > 100) {
            this.data.sessions = this.data.sessions.slice(-100);
        }
    }

    // Update streak and daily activity
    updateStreakAndActivity(maintainStreak) {
        const today = new Date().toDateString();
        const lastActiveDate = this.data.user.lastActive ? new Date(this.data.user.lastActive).toDateString() : null;

        // Update days active
        if (lastActiveDate !== today) {
            this.data.user.daysActive++;
            this.data.user.lastActive = Date.now();
        }

        // Update streak
        if (maintainStreak) {
            if (lastActiveDate === today) {
                // Same day, no change to streak
                return;
            }
            
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();

            if (lastActiveDate === yesterdayStr || lastActiveDate === null) {
                // Consecutive day or first attempt
                this.data.user.streakCurrent++;
                this.data.user.streakBest = Math.max(this.data.user.streakBest, this.data.user.streakCurrent);
            } else {
                // Gap in days, reset streak
                this.data.user.streakCurrent = 1;
            }
        } else if (this.data.user.streakCurrent > 0) {
            // Poor performance, end streak
            this.data.user.streakCurrent = 0;
        }
    }

    // Update analytics and recommendations
    updateAnalytics() {
        const subjects = this.data.subjects;
        const allTopics = new Map();
        const recommendations = [];

        // Analyze all topics across subjects
        Object.values(subjects).forEach(subject => {
            if (subject.topicPerformance) {
                Object.entries(subject.topicPerformance).forEach(([topic, performance]) => {
                    if (!allTopics.has(topic)) {
                        allTopics.set(topic, { total: 0, correct: 0, subjects: [] });
                    }
                    const topicData = allTopics.get(topic);
                    topicData.total += performance.total;
                    topicData.correct += performance.correct;
                    topicData.subjects.push(subject);
                });
            }
        });

        // Identify weak and strong topics
        const weakTopics = [];
        const strongTopics = [];

        allTopics.forEach((data, topic) => {
            const accuracy = data.total > 0 ? data.correct / data.total : 0;
            if (data.total >= 3) { // Minimum attempts threshold
                if (accuracy < 0.6) {
                    weakTopics.push({ topic, accuracy, attempts: data.total });
                } else if (accuracy >= 0.8) {
                    strongTopics.push({ topic, accuracy, attempts: data.total });
                }
            }
        });

        // Sort by performance
        weakTopics.sort((a, b) => a.accuracy - b.accuracy);
        strongTopics.sort((a, b) => b.accuracy - a.accuracy);

        this.data.analytics.weakTopics = weakTopics.slice(0, 5);
        this.data.analytics.strongTopics = strongTopics.slice(0, 5);

        // Generate recommendations
        if (weakTopics.length > 0) {
            recommendations.push({
                type: 'improvement',
                title: `Focus on ${weakTopics[0].topic}`,
                description: `Your accuracy in ${weakTopics[0].topic} is ${(weakTopics[0].accuracy * 100).toFixed(1)}%. Consider reviewing fundamentals.`,
                priority: 'high',
                action: 'study_topic',
                data: weakTopics[0].topic
            });
        }

        // Check for consistent learning pattern
        const recentSessions = this.data.sessions.slice(-7); // Last 7 sessions
        if (recentSessions.length >= 3) {
            const avgAccuracy = recentSessions.reduce((sum, session) => sum + session.accuracy, 0) / recentSessions.length;
            if (avgAccuracy >= 80) {
                recommendations.push({
                    type: 'progression',
                    title: 'Ready for Advanced Topics',
                    description: `Your recent accuracy is ${avgAccuracy.toFixed(1)}%. Consider challenging yourself with advanced questions.`,
                    priority: 'medium',
                    action: 'increase_difficulty'
                });
            }
        }

        // Check for inactive periods
        const daysSinceLastActivity = this.data.user.lastActive ? 
            (Date.now() - this.data.user.lastActive) / (1000 * 60 * 60 * 24) : 0;
        
        if (daysSinceLastActivity >= 3) {
            recommendations.push({
                type: 'engagement',
                title: 'Welcome Back!',
                description: `It's been ${Math.floor(daysSinceLastActivity)} days since your last session. Let's get back to learning!`,
                priority: 'medium',
                action: 'continue_learning'
            });
        }

        this.data.analytics.recommendations = recommendations.slice(0, 3);
    }

    // Get or create subject data
    getOrCreateSubject(subjectKey) {
        if (!this.data.subjects[subjectKey]) {
            this.data.subjects[subjectKey] = {
                totalQuestions: 0,
                correctAnswers: 0,
                totalTime: 0,
                lastAttempt: 0,
                topicPerformance: {},
                difficultyPerformance: {},
                questionHistory: {},
                quizHistory: []
            };
        }
        return this.data.subjects[subjectKey];
    }

    // Get subject performance data
    getSubjectPerformance(subjectName) {
        // Convert subject name to key (handle both formats)
        const subjectKey = Object.keys(window.SubjectsManager.subjects).find(key => 
            window.SubjectsManager.subjects[key].name === subjectName
        ) || subjectName.toLowerCase().replace(/\s+/g, '_');

        return this.data.subjects[subjectKey] || null;
    }

    // Get overall statistics
    getOverallStats() {
        const user = this.data.user;
        return {
            totalQuestions: user.totalQuestions,
            accuracy: user.totalQuestions > 0 ? (user.correctAnswers / user.totalQuestions) * 100 : 0,
            streakCurrent: user.streakCurrent,
            streakBest: user.streakBest,
            daysActive: user.daysActive,
            averageSessionTime: this.getAverageSessionTime(),
            favoriteSubject: this.getFavoriteSubject(),
            improvementRate: this.getImprovementRate()
        };
    }

    // Get average session time
    getAverageSessionTime() {
        if (this.data.sessions.length === 0) return 0;
        const totalTime = this.data.sessions.reduce((sum, session) => sum + session.duration, 0);
        return totalTime / this.data.sessions.length;
    }

    // Get favorite subject
    getFavoriteSubject() {
        const subjectCounts = {};
        this.data.sessions.forEach(session => {
            subjectCounts[session.subject] = (subjectCounts[session.subject] || 0) + 1;
        });

        let favoriteSubject = null;
        let maxCount = 0;
        Object.entries(subjectCounts).forEach(([subject, count]) => {
            if (count > maxCount) {
                maxCount = count;
                favoriteSubject = subject;
            }
        });

        return favoriteSubject;
    }

    // Get improvement rate
    getImprovementRate() {
        if (this.data.sessions.length < 5) return 0;

        const recentSessions = this.data.sessions.slice(-5);
        const oldSessions = this.data.sessions.slice(-10, -5);

        if (oldSessions.length === 0) return 0;

        const recentAvg = recentSessions.reduce((sum, session) => sum + session.accuracy, 0) / recentSessions.length;
        const oldAvg = oldSessions.reduce((sum, session) => sum + session.accuracy, 0) / oldSessions.length;

        return recentAvg - oldAvg;
    }

    // Get subject progress for dashboard
    getSubjectProgress() {
        const subjects = window.SubjectsManager.getAllSubjects();
        const progress = [];

        Object.entries(subjects).forEach(([key, subject]) => {
            const data = this.data.subjects[key];
            if (data && data.totalQuestions > 0) {
                const mastery = (data.correctAnswers / data.totalQuestions) * 100;
                progress.push({
                    name: subject.name,
                    mastery: mastery,
                    questionsAnswered: data.totalQuestions,
                    lastAttempt: data.lastAttempt,
                    icon: subject.icon,
                    color: subject.color
                });
            } else {
                progress.push({
                    name: subject.name,
                    mastery: 0,
                    questionsAnswered: 0,
                    lastAttempt: 0,
                    icon: subject.icon,
                    color: subject.color
                });
            }
        });

        return progress.sort((a, b) => b.mastery - a.mastery);
    }

    // Reset all progress (for testing or user request)
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            this.data = {};
            this.initializeData();
            this.saveProgress();
            return true;
        }
        return false;
    }

    // Export progress data
    exportProgress() {
        const exportData = {
            ...this.data,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        return JSON.stringify(exportData, null, 2);
    }

    // Import progress data
    importProgress(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            if (importedData.version && importedData.user) {
                this.data = importedData;
                this.saveProgress();
                return true;
            }
        } catch (error) {
            console.error('Error importing progress:', error);
        }
        return false;
    }
}

// Create global progress tracker instance
const progressTracker = new ProgressTracker();

// Export for use in other modules
window.ProgressTracker = progressTracker;
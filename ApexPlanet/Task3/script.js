// Country Explorer Quiz Application
class CountryQuiz {
    constructor() {
        this.countries = [];
        this.currentScreen = 'loading';
        this.currentCategory = '';
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.timer = null;
        this.timeLeft = 30;
        
        this.init();
    }

    async init() {
        await this.loadCountries();
        this.setupEventListeners();
        this.showScreen('home');
    }

    // Fetch countries from REST Countries API
    async loadCountries() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flag,flags,population,region,area,cca2');
            this.countries = await response.json();
            
            // Filter out countries without required data
            this.countries = this.countries.filter(country => 
                country.capital && 
                country.capital[0] && 
                country.flags && 
                country.flags.png &&
                country.population
            );
            
            // Update total countries count
            document.getElementById('total-countries').textContent = this.countries.length;
            
            console.log(`Loaded ${this.countries.length} countries`);
        } catch (error) {
            console.error('Error loading countries:', error);
            alert('Error loading country data. Please check your internet connection and try again.');
        }
    }

    setupEventListeners() {
        // Category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.startQuiz(category);
            });
        });

        // Quiz navigation
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showScreen('home');
            this.resetQuiz();
        });

        // Option buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!btn.disabled) {
                    this.selectAnswer(parseInt(btn.dataset.option));
                }
            });
        });

        // Next button
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Results buttons
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.startQuiz(this.currentCategory);
        });

        document.getElementById('home-btn').addEventListener('click', () => {
            this.showScreen('home');
            this.resetQuiz();
        });

        document.getElementById('share-btn').addEventListener('click', () => {
            this.shareScore();
        });
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
        
        // Show loading screen temporarily if needed
        if (screenName === 'loading') {
            document.getElementById('loading-screen').style.display = 'flex';
        } else {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById(`${screenName}-screen`).style.display = 'block';
        }
        
        this.currentScreen = screenName;
    }

    startQuiz(category) {
        this.currentCategory = category;
        this.currentQuestions = this.generateQuestions(category);
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        
        // Update quiz title
        const categoryNames = {
            capitals: 'Capitals',
            flags: 'Flags', 
            geography: 'Geography',
            population: 'Population'
        };
        
        document.getElementById('quiz-title').textContent = `${categoryNames[category]} Quiz`;
        document.getElementById('total-questions').textContent = this.currentQuestions.length;
        
        this.showScreen('quiz');
        this.displayQuestion();
    }

    generateQuestions(category) {
        const questions = [];
        const usedCountries = new Set();
        
        // Generate 5 random questions for the category
        for (let i = 0; i < 5; i++) {
            let question;
            let attempts = 0;
            
            do {
                question = this.generateSingleQuestion(category);
                attempts++;
            } while (usedCountries.has(question.countryCode) && attempts < 50);
            
            if (question && !usedCountries.has(question.countryCode)) {
                questions.push(question);
                usedCountries.add(question.countryCode);
            }
        }
        
        return questions;
    }

    generateSingleQuestion(category) {
        const randomCountries = this.getRandomCountries(4);
        if (randomCountries.length < 4) return null;
        
        const correctCountry = randomCountries[0];
        
        let question;
        
        switch (category) {
            case 'capitals':
                {
                    const correctCapital = correctCountry.capital[0];
                    const options = this.shuffleArray(randomCountries.map(country => country.capital[0]));
                    question = {
                        text: `What is the capital of ${correctCountry.name.common}?`,
                        options,
                        correctAnswer: options.indexOf(correctCapital),
                        countryCode: correctCountry.cca2,
                        explanation: `The capital of ${correctCountry.name.common} is ${correctCountry.capital[0]}.`,
                        flagUrl: null
                    };
                }
                break;
                
            case 'flags':
                {
                    const correctName = correctCountry.name.common;
                    const options = this.shuffleArray(randomCountries.map(country => country.name.common));
                    question = {
                        text: `Which country does this flag belong to?`,
                        options,
                        correctAnswer: options.indexOf(correctName),
                        countryCode: correctCountry.cca2,
                        explanation: `This is the flag of ${correctCountry.name.common}.`,
                        flagUrl: correctCountry.flags.png
                    };
                }
                break;
                
            case 'geography':
                {
                    const options = this.shuffleArray([
                        correctCountry.region,
                        ...this.getRandomRegions(3).filter(region => region !== correctCountry.region)
                    ]);
                    question = {
                        text: `Which region does ${correctCountry.name.common} belong to?`,
                        options,
                        correctAnswer: options.indexOf(correctCountry.region),
                        countryCode: correctCountry.cca2,
                        explanation: `${correctCountry.name.common} is located in ${correctCountry.region}.`,
                        flagUrl: null
                    };
                }
                break;
                
            case 'population':
                {
                    const populations = randomCountries
                        .map(country => ({
                            country: country.name.common,
                            population: country.population
                        }))
                        .sort((a, b) => b.population - a.population);
                    const options = this.shuffleArray(populations.map(item => item.country));
                    const correctCountryName = populations[0].country;
                    question = {
                        text: `Which of these countries has the largest population?`,
                        options,
                        correctAnswer: options.indexOf(correctCountryName),
                        countryCode: correctCountry.cca2,
                        explanation: `${populations[0].country} has the largest population with ${this.formatNumber(populations[0].population)} people.`,
                        flagUrl: null
                    };
                }
                break;
                
            default:
                return null;
        }
        
        return question;
    }

    getRandomCountries(count) {
        const shuffled = [...this.countries].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    getRandomRegions(count) {
        const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
        return this.shuffleArray(regions).slice(0, count);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    displayQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        if (!question) return;
        
        // Update question counter and progress
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-percentage').textContent = `${Math.round(progress)}% Complete`;
        
        // Display question text
        document.getElementById('question-text').textContent = question.text;
        
        // Handle flag display
        const flagContainer = document.getElementById('flag-container');
        const flagImage = document.getElementById('flag-image');
        
        if (question.flagUrl) {
            flagImage.src = question.flagUrl;
            flagContainer.style.display = 'block';
        } else {
            flagContainer.style.display = 'none';
        }
        
        // Display options
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            btn.querySelector('.option-text').textContent = question.options[index];
            btn.querySelector('.option-icon').textContent = '';
            btn.className = 'option-btn';
            btn.disabled = false;
        });
        
        // Hide feedback and navigation
        document.getElementById('feedback-card').style.display = 'none';
        document.querySelector('.quiz-navigation').style.display = 'none';
        
        // Start timer
        this.startTimer();
    }

    startTimer() {
        this.timeLeft = 30;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.selectAnswer(null); // Time's up
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer-value');
        timerElement.textContent = `${this.timeLeft}s`;
        
        if (this.timeLeft <= 10) {
            timerElement.parentElement.classList.add('warning');
        } else {
            timerElement.parentElement.classList.remove('warning');
        }
    }

    selectAnswer(selectedIndex) {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        const question = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correctAnswer;
        const isTimeUp = selectedIndex === null;
        
        this.userAnswers.push(isCorrect);
        if (isCorrect) this.score++;
        
        // Update option buttons
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            
            if (index === question.correctAnswer) {
                btn.classList.add('correct');
                btn.querySelector('.option-icon').textContent = '✓';
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
                btn.querySelector('.option-icon').textContent = '✗';
            }
        });
        
        // Show feedback
        this.showFeedback(isCorrect, isTimeUp, question.explanation);
        
        // Show navigation
        setTimeout(() => {
            document.querySelector('.quiz-navigation').style.display = 'block';
            const nextBtn = document.getElementById('next-btn');
            nextBtn.textContent = this.currentQuestionIndex === this.currentQuestions.length - 1 ? 'View Results' : 'Next Question';
        }, 1000);
    }

    showFeedback(isCorrect, isTimeUp, explanation) {
        const feedbackCard = document.getElementById('feedback-card');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackExplanation = document.getElementById('feedback-explanation');
        const feedbackIcon = feedbackCard.querySelector('.feedback-icon');
        
        if (isTimeUp) {
            feedbackTitle.textContent = "Time's up!";
            feedbackCard.className = 'feedback-card incorrect';
            feedbackIcon.textContent = '⏰';
        } else if (isCorrect) {
            feedbackTitle.textContent = 'Correct!';
            feedbackCard.className = 'feedback-card correct';
            feedbackIcon.textContent = '✓';
        } else {
            feedbackTitle.textContent = 'Incorrect!';
            feedbackCard.className = 'feedback-card incorrect';
            feedbackIcon.textContent = '✗';
        }
        
        feedbackExplanation.textContent = explanation;
        feedbackCard.style.display = 'block';
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
        } else {
            this.displayQuestion();
        }
    }

    showResults() {
        const totalQuestions = this.currentQuestions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        
        // Update score display
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-total').textContent = totalQuestions;
        document.getElementById('final-percentage').textContent = percentage;
        
        // Update category badge
        const categoryNames = {
            capitals: 'Capitals',
            flags: 'Flags',
            geography: 'Geography', 
            population: 'Population'
        };
        document.getElementById('results-category').textContent = `${categoryNames[this.currentCategory]} Quiz`;
        
        // Update performance level
        const performance = this.getPerformanceLevel(percentage);
        document.getElementById('performance-level').textContent = performance.level;
        document.getElementById('performance-emoji').textContent = performance.emoji;
        document.getElementById('performance-text').textContent = performance.message;
        
        // Update trophy color
        const trophyIcon = document.querySelector('.trophy-icon');
        trophyIcon.style.background = performance.color;
        
        // Update breakdown
        this.updateBreakdown();
        
        // Update counts
        const correctCount = this.userAnswers.filter(Boolean).length;
        document.getElementById('correct-count').textContent = correctCount;
        document.getElementById('incorrect-count').textContent = totalQuestions - correctCount;
        
        this.showScreen('results');
    }

    getPerformanceLevel(percentage) {
        if (percentage >= 90) {
            return {
                level: 'Excellent!',
                emoji: '🏆',
                color: '#22c55e',
                message: "Outstanding! You're a true geography expert!"
            };
        } else if (percentage >= 70) {
            return {
                level: 'Great Job!',
                emoji: '⭐',
                color: '#3b82f6',
                message: "Impressive knowledge! You know your way around the world."
            };
        } else if (percentage >= 50) {
            return {
                level: 'Good Effort!',
                emoji: '👍',
                color: '#f59e0b',
                message: "Not bad! There's always room to learn more about our world."
            };
        } else {
            return {
                level: 'Keep Learning!',
                emoji: '📚',
                color: '#ef4444',
                message: "Keep exploring! Every expert was once a beginner."
            };
        }
    }

    updateBreakdown() {
        const breakdownGrid = document.getElementById('breakdown-grid');
        breakdownGrid.innerHTML = '';
        
        this.userAnswers.forEach((isCorrect, index) => {
            const item = document.createElement('div');
            item.className = `breakdown-item ${isCorrect ? 'correct' : 'incorrect'}`;
            item.textContent = `Q${index + 1}`;
            breakdownGrid.appendChild(item);
        });
    }

    shareScore() {
        const text = `I scored ${this.score}/${this.currentQuestions.length} (${Math.round((this.score / this.currentQuestions.length) * 100)}%) on the Country Explorer Quiz!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Country Explorer Quiz',
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text + ' ' + window.location.href)
                .then(() => alert('Score copied to clipboard!'))
                .catch(() => alert('Unable to copy to clipboard'));
        } else {
            alert('Score: ' + text);
        }
    }

    resetQuiz() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.currentCategory = '';
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.timeLeft = 30;
    }

    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.quiz = new CountryQuiz();
});

// Add some additional utility functions for better UX
document.addEventListener('keydown', (e) => {
    const quiz = window.quiz;
    if (!quiz) return;
    
    // Allow keyboard navigation
    if (quiz.currentScreen === 'quiz') {
        if (e.key >= '1' && e.key <= '4') {
            const optionIndex = parseInt(e.key) - 1;
            const optionBtn = document.querySelector(`[data-option="${optionIndex}"]`);
            if (optionBtn && !optionBtn.disabled) {
                optionBtn.click();
            }
        } else if (e.key === 'Enter' || e.key === ' ') {
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn.style.display !== 'none') {
                nextBtn.click();
            }
        }
    }
});

// Store quiz instance is set during DOMContentLoaded
const Questions = require('../models/question.model');
const Score = require('../models/score.model');

const startQuiz = async (req, res) => {
    try {
        const { thematique } = req.params;
        const questions = await Questions.getByThematique(thematique);

        if (!questions.length) {
            return res.status(404).json({ error: 'Aucune question trouvée pour cette thématique' });
        }

        req.session.quiz = {
            thematique,
            questions: questions.map(q => ({ ...q, userAnswer: null })),
            currentIndex: 0,
            score: 0,
            startTime: new Date()
        };

        res.json({
            thematique,
            totalQuestions: questions.length,
            currentQuestion: questions[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const submitAnswer = async (req, res) => {
    try {
        const { answer } = req.body;
        const quiz = req.session.quiz;

        if (!quiz) {
            return res.status(400).json({ error: 'Aucun quiz en cours' });
        }

        const currentQuestion = quiz.questions[quiz.currentIndex];
        quiz.questions[quiz.currentIndex].userAnswer = answer;

        console.log('User answer:', answer);
        console.log('Correct answer:', currentQuestion.correctAnswers);
        console.log('Type of correctAnswers:', typeof currentQuestion.correctAnswers);

        // Gérer différents types de correctAnswers
        let correctAnswer = currentQuestion.correctAnswers;
        if (typeof correctAnswer !== 'string') {
            correctAnswer = String(correctAnswer);
        }

        if (answer && correctAnswer && answer.trim() === correctAnswer.trim()) {
            quiz.score++;
            console.log('Score incremented! New score:', quiz.score);
        }

        quiz.currentIndex++;

        if (quiz.currentIndex >= quiz.questions.length) {
            try {
                await Score.create({
                    user_id: req.user.id,
                    thematique: quiz.thematique,
                    score: quiz.score
                });
                console.log('Final score saved:', quiz.score);
            } catch (scoreError) {
                console.error('Erreur sauvegarde score:', scoreError);
            }

            const result = {
                completed: true,
                score: quiz.score,
                totalQuestions: quiz.questions.length,
                percentage: Math.round((quiz.score / quiz.questions.length) * 100),
                thematique: quiz.thematique
            };

            delete req.session.quiz;
            return res.json(result);
        }

        res.json({
            completed: false,
            nextQuestion: quiz.questions[quiz.currentIndex],
            currentIndex: quiz.currentIndex,
            totalQuestions: quiz.questions.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { startQuiz, submitAnswer };

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

const getQuestion = (req, res) => {
    const quiz = req.session.quiz;
    if (!quiz) {
        return res.status(400).json({ error: 'Aucun quiz en cours' });
    }

    const currentQuestion = quiz.questions[quiz.currentIndex];
    if (!currentQuestion) {
        return res.status(404).json({ error: 'Question non trouvée' });
    }

    res.json({
        question: currentQuestion,
        currentIndex: quiz.currentIndex,
        totalQuestions: quiz.questions.length
    });
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

        if (answer === currentQuestion.correctAnswers) {
            quiz.score++;
        }

        quiz.currentIndex++;

        if (quiz.currentIndex >= quiz.questions.length) {
            // Sauvegarder le score dans la base de données
            try {
                await Score.create({
                    user_id: req.user.id,
                    thematique: quiz.thematique,
                    score: quiz.score
                });
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

module.exports = { startQuiz, submitAnswer, getQuestion };




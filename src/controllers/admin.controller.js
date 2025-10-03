const db = require("../../config/db");
const User = require('../models/user.model');
const question = require('../models/question.model');
const Score = require('../models/score.model');

exports.createQuestion = async (req, res) => {
    try {
        const { thematique, question, options, correctAnswers } = req.body;
        const [result] = await db.query(
            "INSERT INTO Questions (thematique, question, options, correctAnswers) VALUES (?, ?, ?, ?)",
            [thematique, question, JSON.stringify(options),  JSON.stringify(correctAnswers) ]
        );
        res.status(201).json({ message: "Question ajoutée", id: result.insertId });
    } catch (err) {
        res.status(500).json(err);
    }
};
exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { thematique, question, options, correctAnswers } = req.body;

        const [result] = await db.query(
            "UPDATE Questions SET thematique = ?, question = ?, options = ?, correctAnswers = ? WHERE questionId = ?",
            [thematique, question, JSON.stringify(options), JSON.stringify(correctAnswers), id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Question introuvable." });
        }
        res.status(200).json({ message: "Question modifiée avec succès." });
    } catch (err) {
        res.status(500).json(err);
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
}
exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM Questions WHERE questionId = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Question introuvable." });
        }

        res.status(200).json({ message: "Question supprimée avec succès." });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.getAllThemes = async (req, res) => {
    try {
        const users = await User.findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.showDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countUsers();
        const thematiques = await question.getThematiques();
        const totalQuestions = await question.countQuestions();
        const totalThemes = await question.countThemes();
        const avgScore = await Score.getAverageScore();

        const userScores = await Score.getAllScores();
        const themeStats = await Score.countGamesByTheme();
        const evolutionStats = await Score.getGamesEvolution();
        console.log(await Score.getGamesEvolution());
        res.render('dashboard', {
            user: req.user,
            totalUsers,
            thematiques,totalQuestions,totalThemes,avgScore,userScores,themeStats,evolutionStats
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
};
exports.getQuestions = async (req, res) => {
    try {
        const questions = await question.getAllQuestions();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
};

exports.getUserScoreDetails = async (req, res) => {
    const { userId, thematique, date } = req.query;

    try {
        const details = await Score.getUserScoreDetails(userId, thematique, date);
        res.json(details);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
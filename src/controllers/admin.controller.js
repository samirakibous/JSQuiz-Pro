const db = require("../../config/db");
const User = require('../models/user.model');

exports.createQuestion = async (req, res) => {
    try {
        const { thematique, question, options, correctAnswers } = req.body;
        const [result] = await db.query(
            "INSERT INTO Questions (thematique, question, options, correctAnswers) VALUES (?, ?, ?, ?)",
            [thematique, question, JSON.stringify(options), correctAnswers]
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
            [thematique, question, JSON.stringify(options), correctAnswers, id]
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

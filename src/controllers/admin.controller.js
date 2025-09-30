const db = require("../../config/db");

exports.createQuestion = (req, res) => {
    console.log("Request body:", req.body); 
    const { thematique, question, options, correctAnswers } = req.body;
    console.log("Inserting question...");
    db.query(
        "INSERT INTO Questions (thematique, question, options, correctAnswers) VALUES (?, ?, ?, ?)",
        [thematique, question, JSON.stringify(options), correctAnswers],
        (err, result) => {
            console.log("DB callback triggered");
            if (err) {
                console.error("DB error:", err);
                return res.status(500).json(err);
            }
            console.log("Insert successful:", result);
            return res.status(201).json({ message: "Question ajoutée", id: result.insertId });
        }
    );
    console.log("Query sent to DB");
};


exports.updateQuestion = (req, res) => {
    console.log("UPDATE ROUTE CALLED", req.params, req.body);
  const { id } = req.params;
  const { thematique, question, options, correctAnswers } = req.body;

  if (!thematique || !question || !options || !correctAnswers) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  db.query(
    "UPDATE Questions SET thematique = ?, question = ?, options = ?, correctAnswers = ? WHERE questionId = ?",
    [thematique, question, JSON.stringify(options), correctAnswers, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Question introuvable." });
      }
      res.status(200).json({ message: "Question modifiée avec succès." });
    }
  );
};

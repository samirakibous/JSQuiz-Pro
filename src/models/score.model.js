const pool = require('../../config/db')

class Score {
    static async create({ user_id, thematique, score }) {
        const [result] = await pool.execute(
            'INSERT INTO Scores (users_id, thematique, score) VALUES (?,?,?)',
            [user_id, thematique, score]
        );
        return result.insertID;
    }
    static async getByUser(user_id) {
        const [rows] = await pool.execute(

            'SELECT * FROM Scores WHERE  user_id = ? ORDER BY date_played DESC',
            [user_id],
        );
        return rows;
    }
    static async getBestScores(thematique, limit = 10) {
        const [rows] = await pool.execute(
            'SELECT s.*, u.username FROM Scores s JOIN Users u ON s.user_id = u.id WHERE s.thematique = ? ORDER BY s.score DESC LIMIT ?',
            [thematique, limit]
        );
        return rows;
    }
    static async getAverageScore() {
        const [rows] = await pool.execute(
            'SELECT AVG(score) AS average FROM Scores'
        );
        return rows[0].average || 0;
    }
    static async getAllScores() {
        const [rows] = await pool.execute(
            `SELECT s.*, u.username 
             FROM Scores s 
             JOIN Users u ON s.user_id = u.id 
             ORDER BY s.date_played DESC`
        );
        return rows;
    }
    static async countGamesByTheme() {
    const [rows] = await pool.execute(
        `SELECT thematique, COUNT(*) as total
         FROM Scores
         GROUP BY thematique`
    );
    return rows;
}
static async getGamesEvolution() {
    const [rows] = await pool.execute(
        `SELECT 
            DATE_FORMAT(date_played, '%Y-%m') AS mois,
            AVG(score) AS avg_score
        FROM Scores
        GROUP BY mois
        ORDER BY mois ASC`
    );
    return rows;
}
 static async getUserScoreDetails(userId, thematique, date) {
       const [rows] = await pool.execute(
                `SELECT q.question, q.options, q.correctAnswers 
                 FROM Scores s
                 JOIN Questions q ON q.thematique = s.thematique
                 WHERE s.user_id = ? AND s.thematique = ? AND DATE(s.date_played) = ?`,
                [userId, thematique, date]
            );
            return rows;
    }
}
module.exports = Score;
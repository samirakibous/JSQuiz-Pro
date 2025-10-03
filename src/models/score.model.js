const pool = require('../../config/db')

class Score {
    static async create({ user_id, thematique, score }) {
        const [result] = await pool.execute(
            'INSERT INTO Scores (user_id, thematique, score) VALUES (?,?,?)',
            [user_id, thematique, score]
        );
        return result.insertId;
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
    static async getUserAverage(user_id) {
        const [rows] = await pool.execute(
            'SELECT AVG(score) as average FROM Scores WHERE user_id = ?',
            [user_id]
        );
        return rows[0]?.average || 0;
    }
    static async getLastScore(user_id) {
        const [rows] = await pool.execute(
            'SELECT * FROM Scores WHERE user_id = ? ORDER BY date_played DESC LIMIT 1',
            [user_id]
        );
        return rows[0];
    }
    static async getTopUsers(limit = 5) {
        try {
            console.log('Exécution de getTopUsers avec limit:', limit);
            const [rows] = await pool.execute(
                'SELECT u.username, COALESCE(AVG(s.score), 0) as average FROM Users u LEFT JOIN Scores s ON u.id = s.user_id GROUP BY u.id, u.username ORDER BY average DESC LIMIT ?',
                [limit]
            );
            console.log('Résultat de getTopUsers:', rows);
            return rows;
        } catch (error) {
            console.error('Erreur dans getTopUsers:', error);
            return [];
        }
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
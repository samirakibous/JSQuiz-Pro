const pool = require('../../config/db')

class Score {
    static async create({user_id, thematique, score}) {
        const [result] = await pool.execute(
            'INSERT INTO Scores (user_id, thematique, score) VALUES (?,?,?)',
            [user_id, thematique, score]
        );
        return result.insertId;
    }
    static  async getByUser(user_id) {
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
}
module.exports = Score;
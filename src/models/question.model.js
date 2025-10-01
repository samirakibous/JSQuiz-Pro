const pool = require('../../config/db')

class  Questions {
    static async getThematiques() {
        const [rows] = await pool.execute(
            'SELECT DISTINCT thematique FROM Questions'
        );
        return rows;
    }
    static async getByThematique(thematique) {
        const [rows] = await pool.execute(
            'SELECT * FROM Questions WHERE thematique = ?',
            [thematique]
        );
        return rows;
    }
    static async create({thematique, question, options, correctAnswers}) {
        const [result] = await pool.execute(
            'INSERT INTO Questions (thematique,question, options, correctAnswers) VALUES (?, ?, ?,?)',
            [thematique, question, JSON.stringify(options), correctAnswers]
        );
        return result.insertID;
    }
    static  async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM Questions WHERE questionID = ?'
            [id]
        );
        return rows[0];
    }
    static async update(id, { thematique, question, options, correctAnswers }) {
        await pool.execute(
            'UPDATE Questions SET thematique = ?, question = ?, options = ?, correctAnswers = ? WHERE questionId = ?',
            [thematique, question, JSON.stringify(options), correctAnswers, id]
        );
    }
    static async delete(id) {
        await pool.execute('DELETE FROM Questions WHERE questionID = ?', [id]);
    }
}

module.exports = Questions;
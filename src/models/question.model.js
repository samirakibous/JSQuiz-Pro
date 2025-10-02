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
    static  async findById(id) {
        const [rows] = await pool.execute(
            'SELECT * FROM Questions WHERE questionID = ?'
            [id]
        );
        return rows[0];
    }
       static async countThemes() {
        const [rows] = await db.execute('SELECT COUNT(DISTINCT thematique) AS total FROM Questions');
        return rows[0].total; 
    }
}

module.exports = Questions;
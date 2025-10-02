const Questions = require('../models/question.model');

const  startQuiz = async (req, res) => {
    try {
        const {thematique} = req.params;
        const questions = await Questions.getByThematique(thematique);

        if (!questions.length) {
            return res.status(404).json({error: 'Aucune questions trouvéé pour cette thématique'})
        }
    } catch (error) {

    }
}
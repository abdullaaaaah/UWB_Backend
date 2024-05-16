const trilaterationService = require('../services/multipleTrilaterate');

function performTrilateration(req, res) {
    const { anchorPositions, tagDistancesArray } = req.body;
    
    try {
        const tagPositions = trilaterationService.multitrilaterate(anchorPositions, tagDistancesArray);
        res.json({ tagPositions });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { performTrilateration };

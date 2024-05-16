const trilaterationService = require('../services/trilaterationService');

function performTrilateration(req, res) {
    const { anchorPositions, distances } = req.body;
    try {
        const estimatedPosition = trilaterationService.trilaterate(anchorPositions, distances);
        res.json({ estimatedPosition });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { performTrilateration };

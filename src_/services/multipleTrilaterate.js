const { linearLeastSquares } = require('../utils/linearLeastSquares');

function multitrilaterate(anchorPositions, tagDistancesArray) {
    const numAnchors = anchorPositions.length;
    const numTags = tagDistancesArray.length;
    
    if (numAnchors < 3) {
        throw new Error("Trilateration requires at least three anchor nodes.");
    }

    const tagPositions = [];

    for (let t = 0; t < numTags; t++) {
        const distances = tagDistancesArray[t];

        if (distances.length !== numAnchors) {
            throw new Error(`Invalid distances array for tag ${t + 1}.`);
        }

        // Initialize matrices
        const A = [];
        const b = [];

        // Build matrices
        for (let i = 0; i < numAnchors - 1; i++) {
            A.push([
                2 * (anchorPositions[i + 1][0] - anchorPositions[0][0]),
                2 * (anchorPositions[i + 1][1] - anchorPositions[0][1])
            ]);
            b.push([
                distances[0]**2 - distances[i + 1]**2 -
                anchorPositions[0][0]**2 + anchorPositions[i + 1][0]**2 -
                anchorPositions[0][1]**2 + anchorPositions[i + 1][1]**2
            ]);
        }

        // Solve linear least squares problem
        const solution = linearLeastSquares(A, b);

        const x = solution[0][0];
        const y = solution[1][0];

        tagPositions.push([x, y]);
    }

    return tagPositions;
}

module.exports = { multitrilaterate };

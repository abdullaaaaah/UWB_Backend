function linearLeastSquares(A, b) {
    const At = transpose(A);
    const AtA = multiplyMatrices(At, A);
    const Atb = multiplyMatrices(At, b);
    const AtAInv = inverseMatrix(AtA);
    return multiplyMatrices(AtAInv, Atb);
}

function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function multiplyMatrices(matrix1, matrix2) {
    const result = [];
    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix2[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < matrix1[0].length; k++) {
                sum += matrix1[i][k] * matrix2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function inverseMatrix(matrix) {
    const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    if (det === 0) {
        throw new Error("Matrix is singular, cannot find inverse.");
    }
    return [
        [matrix[1][1] / det, -matrix[0][1] / det],
        [-matrix[1][0] / det, matrix[0][0] / det]
    ];
}

module.exports = { linearLeastSquares };

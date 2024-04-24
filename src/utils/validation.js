function validateData(data) {
    // Implement validation logic here
    // Example: Check if data has required fields
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error("Invalid data format");
    }
}

module.exports = { validateData };

const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    transmitterSerialNumber: {
        type: String,
        required: true,
    },
    allCount: {
        type: Number,
        required: false,
    },
    reads: [{
        deviceUID: String,
        distance: Number,
    }],
    // Add other fields here as needed
}, { timestamps: true });

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;

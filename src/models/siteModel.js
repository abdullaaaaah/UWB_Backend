const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    anchors: { type: Array, required: true },
    assets: { type: Number, required: true },
    imageUrl: { type: String, required: true },
});

const Site = mongoose.model('Site', siteSchema);

module.exports = Site;

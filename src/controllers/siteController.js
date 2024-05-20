const cloudinary = require('cloudinary').v2;
const Site = require('../models/siteModel');
const fs = require('fs');
const path = require('path');

// Cloudinary configuration
cloudinary.config({
    cloud_name: "dcoajgeh5",
    api_key: "398428448442352",
    api_secret: "Rm7Sy0n4EWRx7MY20-i1SM2CCz0",
});

const uploadImageToCloudinary = async (filePath) => {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const result = await cloudinary.uploader.upload(filePath);
            return result;
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            attempt++;
            if (attempt >= maxRetries) {
                throw error;
            }
        }
    }
};

const addSite = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        // Upload image to Cloudinary with retry logic
        const result = await uploadImageToCloudinary(req.file.path);

        // Remove the file from the server after uploading
        fs.unlinkSync(req.file.path);

        // Create new site object
        const newSite = new Site({
            name: req.body.name,
            description: req.body.description,
            anchors: JSON.parse(req.body.anchors),
            assets: req.body.assets,
            imageUrl: result.secure_url,
        });

        // Save to MongoDB
        await newSite.save();

        res.status(201).json(newSite);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to add site' });
    }
};
const getSiteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Site ID is required' });
    }

    const site = await Site.findById(id);
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.status(200).json(site);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch site' });
  }
};
const getSiteByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Site name is required' });
        }

        const site = await Site.findOne({ name });
        if (!site) {
            return res.status(404).json({ error: 'Site not found' });
        }

        res.status(200).json(site);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch site' });
    }
};

  module.exports = { addSite, getSiteById, getSiteByName };
  

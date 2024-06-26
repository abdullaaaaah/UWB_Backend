const Site = require('../models/siteModel');
const fs = require('fs');

const {uploadImageToCloudinary} = require('../services/cloudnary');
const addSite = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        // Upload image to Cloudinary with retry logic
        const result = await uploadImageToCloudinary(req.file.path);

        // Remove the file from the server after uploading
        fs.unlinkSync(req.file.path);

        // Create new site object
        const newSite = new Site({
            email:req.body.email,
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

const getSiteByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Site name is required' });
        }

        const site = await Site.findOne({ name }).lean(); // .lean() returns a plain JavaScript object
        if (!site) {
            return res.status(404).json({ error: 'Site not found' });
        }

        // Remove the _id and __v fields
        const { _id, __v, ...siteWithoutIdAndV } = site;

        res.status(200).json(siteWithoutIdAndV);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch site' });
    }
};
const getSiteByNameAndEmail = async (req, res) => {
    try {
        const { name, email } = req.query;
        if (!name || !email) {
            return res.status(400).json({ error: 'Site name and email are required' });
        }

        const site = await Site.findOne({ name, email }).lean(); // .lean() returns a plain JavaScript object
        if (!site) {
            return res.status(404).json({ error: 'Site not found' });
        }

        // Remove the _id and __v fields
        const { _id, __v, ...siteWithoutIdAndV } = site;

        res.status(200).json(siteWithoutIdAndV);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch site' });
    }
};
const getAllSitesByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        //added description - azmat
        const sites = await Site.find({ email }).select('name imageUrl description').lean(); // .lean() returns plain JavaScript objects
        // const sites = await Site.find().lean();
        // const sites = await Site.find({}).select('name imageUrl').lean();


        if (sites.length === 0) {
            return res.status(404).json({ error: 'No sites found for the given email' });
        }

        // Remove the _id and __v fields from each site
        const sitesWithoutIdAndV = sites.map(({ _id, __v, ...site }) => site);

        res.status(200).json(sitesWithoutIdAndV);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch sites' });
    }
};

const deleteSiteByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Site name is required' });
        }

        const site = await Site.findOneAndDelete({ name }).lean(); // .lean() returns a plain JavaScript object
        if (!site) {
            return res.status(404).json({ error: 'Site not found' });
        }

        // Remove the _id and __v fields before sending the response
        const { _id, __v, ...siteWithoutIdAndV } = site;

        res.status(200).json({ message: 'Site deleted successfully', site: siteWithoutIdAndV });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to delete site' });
    }
};
const deleteSiteByNameAndEmail = async (req, res) => {
    try {
        const { name, email } = req.query;
        if (!name || !email) {
            return res.status(400).json({ error: 'Site name and email are required' });
        }

        const site = await Site.findOneAndDelete({ name, email }).lean(); // .lean() returns a plain JavaScript object
        if (!site) {
            return res.status(404).json({ error: 'Site not found' });
        }

        // Remove the _id and __v fields before sending the response
        const { _id, __v, ...siteWithoutIdAndV } = site;

        res.status(200).json({ message: 'Site deleted successfully', site: siteWithoutIdAndV });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to delete site' });
    }
};


module.exports = { addSite, getSiteByName ,getAllSitesByEmail,getSiteByNameAndEmail,deleteSiteByName,deleteSiteByNameAndEmail};


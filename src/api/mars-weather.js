const express = require('express');
const axios = require('axios');

const router = express.Router();

const BASE_URL = 'https://api.nasa.gov/insight_weather/?';

router.get('/', async (req, res, next) => {
    try {
        const params = new URLSearchParams({
            api_key: process.env.NASA_API_KEY,
            feedtype: 'json',
            ver: '1.0'
        });

        // Make a request to NASA API
        const { data } = await axios.get(`${BASE_URL}${params}`);

        // Respond to this request with data from NASA API
        res.json(data);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

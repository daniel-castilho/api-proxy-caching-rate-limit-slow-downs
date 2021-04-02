const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const limiter = rateLimit({
	windowMs: 30 * 1000, // 30 seconds
	max: 10, // Limit each IP to 2 request per windowsMs
});

const speedLimiter = slowDown({
	windowMs: 30 * 1000,
	delayAfter: 1,
	delayMs: 500
});

const router = express.Router();

const BASE_URL = "https://api.nasa.gov/insight_weather/?";

let cachedData;
let cacheTime;

router.get("/", limiter, speedLimiter, async (req, res, next) => {
	// In memory cache
	if (cacheTime > Date.now() - 30 * 1000) {
		return res.json(cachedData);
	}
	try {
		const params = new URLSearchParams({
			api_key: process.env.NASA_API_KEY,
			feedtype: "json",
			ver: "1.0",
		});

		// Make a request to NASA API
		const { data } = await axios.get(`${BASE_URL}${params}`);

		// Respond to this request with data from NASA API
		cachedData = data;
		cacheTime = Date.now();
		data.cacheTime = cacheTime;
		return res.json(data);
	} catch (error) {
		return next(error);
	}
});

module.exports = router;

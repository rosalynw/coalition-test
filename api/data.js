// /api/data.js
const axios = require('axios');
require('dotenv').config();

module.exports = async (req, res) => {
  try {
    // Fetch data from external API
    const response = await axios.get('https://fedskillstest.coalitiontechnologies.workers.dev', {
      headers: {
        'Authorization': `Basic ${process.env.API_KEY}`
      }
    });

    // Extract the 'name' query parameter, if available
    const name = req.query.name?.trim().toLowerCase();

    // If a name is provided, filter the data for that user
    if (name) {
      const filteredData = response.data.find(user => user.name.toLowerCase() === name);
      return res.status(200).json(filteredData || { error: 'User not found' });
    }

    // If no name is provided, return the full data
    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

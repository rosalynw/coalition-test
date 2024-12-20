const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://fedskillstest.coalitiontechnologies.workers.dev', {
      headers: {
        'Authorization': `Basic ${process.env.API_KEY}`
      }
    });

    const name = req.query.name?.trim().toLowerCase();

    if (name) {
      const filteredData = response.data.find(user => user.name.toLowerCase() === name);
      res.json(filteredData || {error: 'User not found'});
    } else {
      res.json(response.data);
    }

  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({error: 'Failed to fetch data'});
  }
});

app.listen(PORT, () => console.log(`Server running on Port:${PORT}`));
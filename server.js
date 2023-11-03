const express = require('express');
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.use(express.static('public'));


const axios = require('axios');

app.get('/articles', async (req, res) => {
  try {
    const response = await axios.get('https://newenki.zendesk.com/api/v2/help_center/fr/articles');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Erreur lors de la récupération des articles');
  }
});

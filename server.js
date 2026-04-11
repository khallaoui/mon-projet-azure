const express = require('express');
const path = require('path');
const app = express();

// Azure utilise dynamiquement le port via process.env.PORT
const port = process.env.PORT || 8080;

// Servir les fichiers statiques du dossier courant
app.use(express.static(path.join(__dirname, '.')));

// Route principale qui renvoie ton index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Application Node lancée sur le port ${port}`);
});
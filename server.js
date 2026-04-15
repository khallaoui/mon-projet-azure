const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const os = require('os');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middleware de logging (pour voir les requêtes dans Azure Log Stream)
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, '.')));

// 1. Route d'information système (Check des ressources Azure)
app.get('/api/sysinfo', (req, res) => {
    res.json({
        platform: os.platform(),
        architecture: os.arch(),
        totalMemory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
        freeMemory: (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB",
        uptime: (os.uptime() / 3600).toFixed(2) + " hours",
        nodeVersion: process.version
    });
});

// 2. Test de connectivité sortante (Appel API externe)
app.get('/api/external-test', async (req, res) => {
    try {
        // On récupère une citation au hasard pour tester le réseau
        const response = await axios.get('https://api.quotable.io/random');
        res.json({
            status: "Success",
            message: "Azure can reach external internet",
            data: response.data
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
});

// 3. Test des Variables d'environnement Azure
app.get('/api/config', (req, res) => {
    res.json({
        environment: process.env.NODE_ENV || "not set",
        custom_secret: process.env.MY_CUSTOM_SECRET ? "HIDDEN (Success)" : "NOT_FOUND"
    });
});

// 4. Page d'accueil par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`--- Server Professional Test Mode ---`);
    console.log(`Port: ${port}`);
    console.log(`OS: ${os.type()}`);
});

// Route dans l'App 1 pour appeler l'App 2
app.get('/test-microservice', async (req, res) => {
    try {
        const response = await axios.get('https://app2.azurewebsites.net/api/data');
        res.json({
            message: "App 1 a bien reçu les données !",
            backend_response: response.data
        });
    } catch (error) {
        res.status(500).json({ error: "Connexion impossible" });
    }
});
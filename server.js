const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files (HTML, CSS, JS, XML) from the "public" folder
app.use(express.static('public'));

// Serve XML files
app.get('/playlists', (req, res) => {
    // Define the directory containing playlists (XML files)
    const playlistsDirectory = path.join(__dirname, 'public/playlists');
    
    // Read the directory and get a list of files (playlist names)
    fs.readdir(playlistsDirectory, (err, files) => {
        if (err) {
            console.error('Error reading playlists directory:', err);
            res.status(500).send('Server error');
            return;
        }
        // Respond with the list of playlist names in JSON format
        res.send(files);
    });
});



// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

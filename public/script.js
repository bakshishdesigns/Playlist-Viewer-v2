// Load playlists when the document is ready
document.addEventListener("DOMContentLoaded", function() {
    loadPlaylists();
});

// Load the list of playlists (XML files) available in the server folder
function loadPlaylists() {
    // Define the path to the server endpoint (update as necessary)
    const serverURL = 'http://localhost:3000/playlists';
    
    // Fetch the list of playlists from the server
    fetch(serverURL)
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            // Data contains an array of playlist file names
            const playlistContainer = document.getElementById('playlistContainer');
            data.forEach(fileName => {
                // Create a button for each playlist
                const button = document.createElement('button');
                button.textContent = fileName;
                button.onclick = () => loadPlaylist(fileName);
                playlistContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error fetching playlists:', error));
}

// Load a specific playlist based on the selected file name
async function loadPlaylist(playlistName) {
    // Define the path to the XML file on the server
    const serverURL = `http://localhost:3000/playlists/${playlistName}`;
    
    try {
        // Fetch the XML file from the server
        const response = await fetch(serverURL);
        
        if (!response.ok) {
            console.error(`Failed to fetch playlist ${playlistName}: ${response.statusText}`);
            return;
        }
        
        const data = await response.text(); // Read the XML file as text
        const parser = new DOMParser(); // Create a new DOMParser
        const xmlDoc = parser.parseFromString(data, "text/xml"); // Parse the XML data
        
        // Parse and display the songs
        parseSongs(xmlDoc);
    } catch (error) {
        console.error(`Error loading playlist ${playlistName}:`, error);
    }
}

// Parse songs from the XML document and display them
function parseSongs(xmlDoc) {
    const songs = xmlDoc.getElementsByTagName('dict');
    const songList = [];
    
    // Iterate over each song's <dict> element
    Array.from(songs).forEach(song => {
        const songData = {};
        const children = song.children;
        
        // Extract key-value pairs from the song
        for (let i = 0; i < children.length; i++) {
            if (children[i].tagName === 'key') {
                const key = children[i].textContent;
                const value = children[i + 1].textContent;
                songData[key] = value;
                i++; // Skip the value node
            }
        }
        
        if(songData['Name'] != undefined){
            if(songData['Description'] != undefined){
                const playlistData = songData                
            }
            else {
                songList.push(songData);
            }
        }
        // Add the song to the list
        
    });
    
    // Display the songs in the song list area
    displaySongs(songList);
}

// Display the songs in the list
function displaySongs(songList) {
    const container = document.getElementById('songList');
    container.innerHTML = ''; // Clear existing content
    
    // Iterate over each song in the list and display it
    songList.forEach(song => {
        // Create a container for each song
        const songContainer = document.createElement('div');
        songContainer.classList.add('song');
        
        // Create placeholder album art
        const albumArt = document.createElement('img');
        albumArt.src = 'lpmusic.png'; // Placeholder image URL
        songContainer.appendChild(albumArt);
        
        // Create song details container
        const songDetails = document.createElement('div');
        songDetails.classList.add('song-details');
        
        // Create song title
        const songTitle = document.createElement('div');
        songTitle.classList.add('song-title');
        songTitle.textContent = song.Name;
        songDetails.appendChild(songTitle);
        
        // Create subtext for artist and album
        const subtext = document.createElement('div');
        subtext.classList.add('song-subtext');
        subtext.textContent = `${song.Artist} - ${song.Album}`;
        songDetails.appendChild(subtext);
        
        songContainer.appendChild(songDetails);
        
        // Create counts container
        const countsContainer = document.createElement('div');
        countsContainer.classList.add('song-counts');
        
        // Create play count element
        const playCount = document.createElement('div');
        playCount.classList.add('song-count', 'play-count');
        playCount.textContent = `Play Count: ${song['Play Count']}`;
        countsContainer.appendChild(playCount);
        
        // Create skip count element
        const skipCount = document.createElement('div');
        skipCount.classList.add('song-count', 'skip-count');
        skipCount.textContent = `Skip Count: ${song['Skip Count']}`;
        countsContainer.appendChild(skipCount);
        
        songContainer.appendChild(countsContainer);
        container.appendChild(songContainer);
    });
}

// Sort the list of songs based on the selected order
function sortSongs() {
    const sortOrder = document.getElementById('sortOrder').value;
    const songListContainer = document.getElementById('songList');
    
    // Get all song divs and convert them to an array
    const songDivs = Array.from(songListContainer.children);
    
    // Convert divs to song objects to facilitate sorting
    const songs = songDivs.map(div => {
        const songData = {
            element: div,
            title: div.querySelector('.song-title').textContent,
            artist: div.querySelector('.song-subtext').textContent,
            playCount: parseInt(div.querySelector('.play-count').textContent.split(':')[1].trim()),
            skipCount: parseInt(div.querySelector('.skip-count').textContent.split(':')[1].trim())
        };
        return songData;
    });
    
    // Perform sorting based on the selected sort order
    switch (sortOrder) {
        case 'nameAsc':
            songs.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'artistAsc':
            songs.sort((a, b) => a.artist.localeCompare(b.artist));
            break;
        case 'skipAsc':
            songs.sort((a, b) => a.skipCount - b.skipCount);
            break;
        case 'skipDesc':
            songs.sort((a, b) => b.skipCount - a.skipCount);
            break;
        case 'playAsc':
            songs.sort((a, b) => a.playCount - b.playCount);
            break;
        case 'playDesc':
            songs.sort((a, b) => b.playCount - a.playCount);
            break;
        default:
            console.error(`Unknown sort order: ${sortOrder}`);
    }
    
    // Clear the existing list and append the sorted list back to the container
    songListContainer.innerHTML = '';
    songs.forEach(song => songListContainer.appendChild(song.element));
}

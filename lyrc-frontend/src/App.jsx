import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]); // Updated to store a list of tracks

  useEffect(() => {
    axios.post("http://localhost:4000/get-token").then(res => {
      setToken(res.data.access_token);
    });
  }, []);

  const searchSong = () => {
    if (!query) return;
    axios
      .get(`https://api.spotify.com/v1/search`, {
        headers: {
          Authorization: "Bearer " + token,
        },
        params: {
          q: query,
          type: "track",
          limit: 10, // Fetch up to 10 tracks
        },
      })
      .then(res => {
        setTracks(res.data.tracks.items); // Store the list of tracks
      })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a song"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={searchSong}>Search</button>
      {tracks.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          {tracks.map(track => (
            <div key={track.id} style={{ marginBottom: "20px" }}>
              <h3>{track.name}</h3>
              <p>Artist: {track.artists.map(a => a.name).join(", ")}</p>
              <img
                src={track.album.images[0]?.url}
                alt="Album cover"
                width={200}
              />
              <audio controls src={track.preview_url}>
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
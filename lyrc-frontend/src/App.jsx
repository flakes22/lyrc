import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Import the CSS file

function App() {
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);

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
          limit: 10,
        },
      })
      .then(res => {
        setTracks(res.data.tracks.items);
      })
      .catch(err => console.error(err));
  };

  const Card = ({ track }) => {
    return (
      <div className="card">
        <img
          src={track.album.images[0]?.url || "https://via.placeholder.com/150"}
          alt="Album cover"
          className="card-image"
        />
        <h3 className="card-title">{track.name}</h3>
        <p className="card-artist">Artist: {track.artists.map(a => a.name).join(", ")}</p>
        <audio controls src={track.preview_url} className="card-audio">
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a song"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="search-input"
      />
      <button onClick={searchSong} className="search-button">Search</button>
      {tracks.length > 0 && (
        <div className="grid">
          {tracks.map(track => (
            <Card key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
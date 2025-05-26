const express = require("express"); // Importing necessary modules
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express(); // Middleware setup
app.use(cors());
app.use(express.json());

app.post("/get-token", async (req, res) => {
  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64"),
    },
    data: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  };

  try {
    const response = await axios(authOptions);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to get token" });
  }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));

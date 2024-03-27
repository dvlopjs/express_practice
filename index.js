const express = require("express");
const movies = require("./movies.json");
const crypto = require("node:crypto");
const cors = require("cors");
const { validateMovie } = require("./schemas/movieSchema");
const app = express();

const PORT = process.env.PORT ?? 3001;

app.use(express.json());
app.use(cors());
app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const moviesFilteredByGenre = movies.filter((m) =>
      m.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(moviesFilteredByGenre);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieSelected = movies.find((m) => m.id === id);

  if (movieSelected) return res.json(movieSelected);
  res.status(404).json({ message: "No movie with that id." });
});

app.post("/movies", (req, res) => {
  try {
    const movieId = crypto.randomUUID();

    const result = validateMovie(req.body);
    if (result.error)
      return res.status(400).json({ error: result.error.message });

    // const { title, year, director, duration, poster, genre, rate } = req.body;
    const newMovie = {
      id: movieId,
      ...result.data,
    };

    //ESTAMOS MODIFICANDO MOVIES ASI QUE SIMPLEMENTE ES API NO RESTAPI
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: "Invalid JSON format" });
  }
});

app.listen(PORT, () => {
  console.log(`App listen on port: http://localhost:${PORT}`);
});

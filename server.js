const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const PORT = 8200;
const MOVIEDEX = require("./moviedex.json");

// middleware
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(validateBearerToken);

app.get("/movie", handleGetMovie);

// functions

function handleGetMovie(req, res) {
  let response = MOVIEDEX;

  if (req.query.genre) {
    response = response.filter((movie) => {
      return movie.genre
        .toLocaleLowerCase()
        .includes(req.query.genre.toLocaleLowerCase());
    });
  }

  if (req.query.country) {
    response = response.filter((movie) => {
      return movie.country
        .toLocaleLowerCase()
        .includes(req.query.country.toLocaleLowerCase());
    });
  }

  if (req.query.avg_vote) {
    response = response.filter((movie) => {
      if (Number(movie.avg_vote) >= Number(req.query.avg_vote)) {
        return movie.avg_vote;
      }
    });
  }
  res.json(response);
}

function validateBearerToken(req, res, next) {
  const authToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized Request" });
  }
  next();
}

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

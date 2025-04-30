const express = require("express");
const cors = require("cors");
const {
  searchMovies,
  createCuratedList,
  updateCuratedList,
  addMovieToWatchList,
  addMovieToWishList,
  addToCuratedListItem,
  addReviewRatingToMovie,
  searchMoviesByGenreAndActor,
  sortMoviesByRatingOrReleaseyear,
  getTop5Movies,
} = require("./controllers/movieControllers");
const { sequelize } = require("./models");
require("pg");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Cinebuff API</title>
      </head>
      <body>
        <h1>Welcome to the Cinebuff Backend</h1>
        <p>This is the backend server. Please use the API routes to interact with the service.</p>
      </body>
    </html>
  `);
});

app.get("/api/movies/search", searchMovies);
app.post("/api/curated-lists", createCuratedList);
app.put("/api/curated-lists/:curatedListId", updateCuratedList);
app.post("/api/movies/watchlist", addMovieToWatchList);
app.post("/api/movies/wishlist", addMovieToWishList);
app.post("/api/movies/curated-list", addToCuratedListItem);
app.post("/api/movies/:movieId/reviews", addReviewRatingToMovie);
app.get("/api/movies/searchByGenreAndActor", searchMoviesByGenreAndActor);
app.get("/api/movies/sort", sortMoviesByRatingOrReleaseyear);
app.get("/api/movies/top5", getTop5Movies);

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("unable to connect to database", error));

app.listen(3000, () => {
  console.log("server is listenign to port 3000");
});

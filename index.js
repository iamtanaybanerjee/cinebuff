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
} = require("./controllers/movieControllers");
const { sequelize } = require("./models");
require("pg");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/movies/search", searchMovies);
app.post("/api/curated-lists", createCuratedList);
app.put("/api/curated-lists/:curatedListId", updateCuratedList);
app.post("/api/movies/watchlist", addMovieToWatchList);
app.post("/api/movies/wishlist", addMovieToWishList);
app.post("/api/movies/curated-list", addToCuratedListItem);
app.post("/api/movies/:movieId/reviews", addReviewRatingToMovie);
app.get("/api/movies/searchByGenreAndActor", searchMoviesByGenreAndActor);

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("unable to connect to database", error));

app.listen(3000, () => {
  console.log("server is listenign to port 3000");
});

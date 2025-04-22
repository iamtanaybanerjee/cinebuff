const axiosInstance = require("../lib/axios.lib");
const {
  validateSearchQuery,
  validateCuratedListBodyParams,
  validateUpdateCuratedListBodyParams,
  validateCuratedListId,
  validateReviewAndRating,
  validateMovieId,
  validateGenre,
  validateActor,
  validateSortingQueryParams,
} = require("../validations/validations");
const {
  curatedList: curatedListModel,
  review: reviewModel,
  movie: movieModel,
} = require("../models");
const {
  updateACuratedList,
  saveMovie,
  searchByGenreAndActor,
  sortMovies,
  getReviewList,
  sortMovesBasedOnRating,
  getActorsList,
  getAllMoviesWithReviewList,
} = require("../services/movieServices");

const searchMovies = async (req, res) => {
  const query = req.query.query;

  try {
    const error = validateSearchQuery(query);
    if (error) return res.status(400).json({ error });

    const response = await axiosInstance.get(`/search/movie?query=${query}`);

    if (response.data.results.length === 0)
      return res.status(404).json({ message: "No movies are found" });

    const movies = await Promise.all(
      response.data.results.map(async (item) => {
        let actors = await getActorsList(item.id);
        return {
          title: item.title,
          tmdbId: item.id,
          genre: item.genre_ids.toString(),
          actors: actors,
          releaseYear: item.release_date.slice(0, 4),
          rating: item.vote_average,
          description: item.overview,
        };
      })
    );

    return res.status(200).json({ movies });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createCuratedList = async (req, res) => {
  const body = req.body;
  try {
    const errors = validateCuratedListBodyParams(body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const curatedList = await curatedListModel.create(body);
    return res
      .status(201)
      .json({ message: "Curated list created successfully", curatedList });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateCuratedList = async (req, res) => {
  const body = req.body;
  const id = parseInt(req.params.curatedListId);
  try {
    const errors = validateUpdateCuratedListBodyParams(body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const response = await updateACuratedList(body, id);

    if (!response.message)
      return res
        .status(404)
        .json({ error: `No curatedList found with id ${id}` });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addMovieToWatchList = async (req, res) => {
  const movieId = parseInt(req.body.movieId);
  // const curatedListId = parseInt(req.body.curatedListId);
  try {
    if (!movieId) return res.status(400).json({ error: "movieId is required" });

    const response = await saveMovie(movieId, 0, "watchlist");
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addMovieToWishList = async (req, res) => {
  const movieId = parseInt(req.body.movieId);
  try {
    if (!movieId) return res.status(400).json({ error: "movieId is required" });

    const response = await saveMovie(movieId, 0, "wishlist");
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addToCuratedListItem = async (req, res) => {
  const movieId = parseInt(req.body.movieId);
  const curatedListId = parseInt(req.body.curatedListId);
  try {
    if (!movieId) return res.status(400).json({ error: "movieId is required" });
    if (!curatedListId)
      return res.status(400).json({ error: "curatedListId is required" });

    const error = await validateCuratedListId(curatedListId);
    if (error) return res.status(404).json({ error });

    const response = await saveMovie(movieId, curatedListId, "curatedList");
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addReviewRatingToMovie = async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const body = req.body;
  try {
    const error = await validateMovieId(movieId);
    if (error) return res.status(400).json({ error });

    const errors = validateReviewAndRating(body);
    if (errors.length > 0) return res.status(400).json({ errors });

    const reviewObj = await reviewModel.create({ ...body, movieId });
    return res
      .status(201)
      .json({ message: "Review added successfully.", review: reviewObj });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const searchMoviesByGenreAndActor = async (req, res) => {
  const genre = req.query.genre;
  const actor = req.query.actor;
  try {
    const error = validateGenre(genre);
    if (error) return res.status(400).json({ error });

    const error2 = validateActor(actor);
    if (error2) return res.status(400).json({ error: error2 });

    const movies = await searchByGenreAndActor(genre, actor);

    if (movies.length === 0)
      return res.status(404).json({
        message: `No movies are found with genre ${genre} and actor ${actor}`,
      });

    return res.status(200).json({ movies });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const sortMoviesByRatingOrReleaseyear = async (req, res) => {
  const list = req.query.list;
  const sortBy = req.query.sortBy;
  const order = req.query.order;
  try {
    const errors = validateSortingQueryParams(list, sortBy, order);
    if (errors.length > 0) return res.status(400).json({ errors });

    const movies = await sortMovies(list, sortBy, order);
    if (movies.length === 0)
      return res.status(404).json({ message: "No movies are found" });

    return res.status(200).json({ movies });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getTop5Movies = async (req, res) => {
  try {
    const movieList = await movieModel.findAll();

    if (movieList.length === 0)
      return res.status(404).json({ message: "No movies are found" });

    let movies;

    //get all movies with their review-list
    movies = await getAllMoviesWithReviewList(movieList);

    //sort movies based on rating
    const sortedTopmovies = sortMovesBasedOnRating(movies);

    //the top 5 movies
    const top5movies = [];

    if (sortedTopmovies.length <= 5) top5movies.push(...sortedTopmovies);
    else {
      for (let i = 0; i < 5; i++) {
        top5movies.push(sortedTopmovies[i]);
      }
    }

    return res.status(200).json({ movies: top5movies });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// const getAllMovies = async (req, res) => {

// }

module.exports = {
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
};

const axiosInstance = require("../lib/axios.lib");
const {
  validateSearchQuery,
  validateCuratedListBodyParams,
  validateUpdateCuratedListBodyParams,
  validateCuratedListId,
  validateReviewAndRating,
  validateMovieId,
} = require("../validations/validations");
const {
  curatedList: curatedListModel,
  review: reviewModel,
} = require("../models");
const { updateACuratedList, saveMovie } = require("../services/movieServices");

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

const getActorsList = async (id) => {
  try {
    const response = await axiosInstance.get(`/movie/${id}/credits`);

    const actorList = [];

    for (let i = 0; i < response.data.cast.length; i++) {
      let items = response.data.cast;
      if (items[i].known_for_department === "Acting")
        actorList.push(items[i].name);
    }

    return actorList;
  } catch (error) {
    throw error;
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

module.exports = {
  searchMovies,
  createCuratedList,
  updateCuratedList,
  addMovieToWatchList,
  addMovieToWishList,
  addToCuratedListItem,
  addReviewRatingToMovie,
};

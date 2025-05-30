const {
  curatedList: curatedListModel,
  movie: movieModel,
} = require("../models");
const validateSearchQuery = (query) => {
  let error;
  if (!query) error = "search-term(query) is required as query param";
  return error;
};

const validateCuratedListBodyParams = (body) => {
  const errors = [];
  if (!body.name || body.name === "")
    errors.push("Name is required and should not be empty");
  if (!body.slug || body.slug === "")
    errors.push("Slug is required and should not be empty");
  return errors;
};

const validateUpdateCuratedListBodyParams = (body) => {
  const errors = [];
  if (body.name === "") errors.push("Name should not be empty string");
  if (body.description === "")
    errors.push("Description should not be empty string");
  return errors;
};

const validateCuratedListId = async (curatedListId) => {
  let error;
  const curatedListObj = await curatedListModel.findOne({
    where: { id: curatedListId },
  });
  if (!curatedListObj)
    error = `Curated list does not exist with id ${curatedListId}`;

  return error;
};

const validateReviewAndRating = (body) => {
  const errors = [];

  if (
    typeof body.rating !== "number" ||
    isNaN(body.rating) ||
    !(body.rating >= 0 && body.rating <= 10)
  )
    errors.push("Rating should be a number and must be among 0 and 10");
  if (body.reviewText.length > 500)
    errors.push("Maximum of 500 characters is allowed");

  return errors;
};

const validateMovieId = async (movieId) => {
  let error;

  const movieObj = await movieModel.findOne({ where: { id: movieId } });
  if (!movieObj) error = `Movie does not exist with id ${movieId}`;

  return error;
};

const validateGenre = (genre) => {
  let error;

  if (!genre) error = "Genre is required";

  return error;
};

const validateActor = (actor) => {
  let error;

  if (!actor) error = "Actor is required";

  return error;
};

const validateSortingQueryParams = (list, sortBy, order) => {
  const errors = [];
  if (
    !list ||
    list === "" ||
    !(list === "wishlist" || list === "watchlist" || list === "curatedlist")
  )
    errors.push("List(wishlist or watchlist or curatedlist) is required");
  if (
    !sortBy ||
    sortBy === "" ||
    !(sortBy === "rating" || sortBy === "releaseYear")
  )
    errors.push("sortBy param is requied and must be rating or releaseYear");
  if (!order || !(order === "ASC" || order === "DESC"))
    errors.push("order is required and must be ASC or DESC");

  return errors;
};

module.exports = {
  validateSearchQuery,
  validateCuratedListBodyParams,
  validateUpdateCuratedListBodyParams,
  validateCuratedListId,
  validateReviewAndRating,
  validateMovieId,
  validateGenre,
  validateActor,
  validateSortingQueryParams,
};

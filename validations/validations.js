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

module.exports = {
  validateSearchQuery,
  validateCuratedListBodyParams,
  validateUpdateCuratedListBodyParams,
  validateCuratedListId,
  validateReviewAndRating,
  validateMovieId,
};

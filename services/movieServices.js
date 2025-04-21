const {
  curatedList: curatedListModel,
  movie: movieModel,
  watchlist: watchlistModel,
  wishlist: wishlistModel,
  curatedListItem: curatedListItemModel,
} = require("../models");
const axiosInstance = require("../lib/axios.lib");
const { Op } = require("sequelize");
require("dotenv").config();

const updateACuratedList = async (body, id) => {
  try {
    const curatedListObj = await curatedListModel.findOne({ where: { id } });

    if (!curatedListObj) return {};

    curatedListObj.set(body);
    const updatedCuratedList = await curatedListObj.save();

    return {
      message: "Curated list updated successfully.",
      updatedCuratedList,
    };
  } catch (error) {
    throw error;
  }
};

const saveMovie = async (id, curatedListId, tableName) => {
  try {
    // await getMovieDetails(id);
    const exists = await movieExistsInDB(id);

    if (exists === false) {
      const movieDetails = await getMovieDetails(id);
      console.log("movieDetails", movieDetails);
      const newMovie = await movieModel.create(movieDetails);
      if (tableName === "watchlist")
        await watchlistModel.create({
          movieId: newMovie.id,
        });
      else if (tableName === "wishlist")
        await wishlistModel.create({
          movieId: newMovie.id,
        });
      else {
        await curatedListItemModel.create({
          curatedListId,
          movieId: newMovie.id,
        });
      }
    } else {
      const movieObj = await movieModel.findOne({ where: { tmdbId: id } });
      if (tableName === "watchlist")
        await watchlistModel.create({
          movieId: movieObj.id,
        });
      else if (tableName === "wishlist")
        await wishlistModel.create({
          movieId: movieObj.id,
        });
      else {
        await curatedListItemModel.create({
          curatedListId,
          movieId: movieObj.id,
        });
      }
    }

    return { message: `Movie added to ${tableName} successfully.` };
  } catch (error) {
    throw error;
  }
};

const movieExistsInDB = async (id) => {
  const movieObj = await movieModel.findOne({ where: { tmdbId: id } });

  if (!movieObj) return false;

  return true;
};

const getMovieDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/movie/${id}`, {
      params: { api_key: process.env.API_KEY },
    });

    const movieDetails = response.data;

    const genreList = getGenres(movieDetails.genres);
    const castList = await getMovieCast(id);

    return {
      title: movieDetails.title,
      tmdbId: movieDetails.id,
      genre: genreList.toString(),
      actors: castList.toString(),
      releaseYear: movieDetails.release_date.slice(0, 4),
      rating: movieDetails.vote_average,
      description: movieDetails.overview,
    };
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

const getGenres = (genres) => {
  const genreList = [];
  for (let i = 0; i < genres.length; i++) {
    genreList.push(genres[i].name);
  }
  return genreList;
};

const getMovieCast = async (id) => {
  try {
    const response = await axiosInstance.get(`/movie/${id}/credits`, {
      params: { api_key: process.env.API_KEY },
    });
    const castList = [];
    let count = 0;
    for (let i = 0; i < response.data.cast.length; i++) {
      if (count > 4) break;
      castList.push(response.data.cast[i].name);
      count++;
    }
    return castList;
  } catch (error) {
    throw error;
  }
};

const searchByGenreAndActor = async (genre, actor) => {
  try {
    const genreList = genre.split(",").map((g) => g.trim());
    const actorList = actor.split(",").map((a) => a.trim());

    const genreConditions = genreList.map((g) => ({
      genre: {
        [Op.like]: `%${g}%`,
      },
    }));

    const actorConditions = actorList.map((a) => ({
      actors: {
        [Op.like]: `%${a}%`,
      },
    }));

    const movies = await movieModel.findAll({
      where: {
        [Op.and]: [...genreConditions, ...actorConditions],
      },
    });
    return movies;
  } catch (error) {
    throw error;
  }
};

const sortMovies = async (list, sortBy, order) => {
  try {
    const movies = await getMovieRecords(list, sortBy, order);
    return movies;
  } catch (error) {
    throw error;
  }
};

const getMovieRecords = async (list, sortBy, order) => {
  try {
    let listObjects;
    if (list === "watchlist") {
      listObjects = await watchlistModel.findAll({
        attributes: ["movieId"],
      });
    } else if (list === "wishlist") {
      listObjects = await wishlistModel.findAll({
        attributes: ["movieId"],
      });
    } else {
      const curatedListObjects = await curatedListModel.findAll();
      const curatedListIds = [];
      for (let i = 0; i < curatedListObjects.length; i++) {
        curatedListIds.push(curatedListObjects[i].id);
      }

      listObjects = await curatedListItemModel.findAll({
        where: { curatedListId: { [Op.in]: curatedListIds } },
        attributes: ["movieId"],
      });

      console.log("listObjects", listObjects);
    }

    //getting the movieIds
    const movieIds = [];
    for (let i = 0; i < listObjects.length; i++) {
      movieIds.push(listObjects[i].movieId);
    }
    console.log("movieIds", movieIds);

    //getting the movieRecords for each movieId
    const movieRecords = await movieModel.findAll({
      where: {
        id: { [Op.in]: movieIds },
      },
    });
    console.log("movieRecords", movieRecords);
    //sort this movieRecords
    const movies = sortMovieRecords(movieRecords, sortBy, order);
    return movies;
  } catch (error) {
    throw error;
  }
};

const sortMovieRecords = (movieRecords, sortBy, order) => {
  let movies;
  if (order === "ASC" && sortBy === "rating")
    movies = movieRecords.sort(
      (movie1, movie2) => movie1.rating - movie2.rating
    );
  else if (order === "ASC" && sortBy === "releaseYear")
    movies = movieRecords.sort(
      (movie1, movie2) => movie1.releaseYear - movie2.releaseYear
    );
  else if (order === "DESC" && sortBy === "rating")
    movies = movieRecords.sort(
      (movie1, movie2) => movie2.rating - movie1.rating
    );
  else {
    movies = movieRecords.sort(
      (movie1, movie2) => movie2.releaseYear - movie1.releaseYear
    );
  }

  return movies;
};

module.exports = {
  updateACuratedList,
  saveMovie,
  searchByGenreAndActor,
  sortMovies,
};

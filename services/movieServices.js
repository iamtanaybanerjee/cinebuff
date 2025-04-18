const {
  curatedList: curatedListModel,
  movie: movieModel,
  watchlist: watchlistModel,
  wishlist: wishlistModel,
  curatedListItem: curatedListItemModel,
} = require("../models");
const axiosInstance = require("../lib/axios.lib");
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

module.exports = { updateACuratedList, saveMovie };

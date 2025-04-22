const axiosInstance = require("../lib/axios.lib");
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
} = require("../controllers/movieControllers");
require("dotenv").config();

jest.mock("../lib/axios.lib", () => ({
  get: jest.fn(),
}));

jest.mock("../validations/validations", () => ({
  validateSearchQuery: jest.fn(),
  validateCuratedListBodyParams: jest.fn(),
  validateUpdateCuratedListBodyParams: jest.fn(),
  validateCuratedListId: jest.fn(),
  validateReviewAndRating: jest.fn(),
  validateMovieId: jest.fn(),
  validateGenre: jest.fn(),
  validateActor: jest.fn(),
  validateSortingQueryParams: jest.fn(),
}));
jest.mock("../services/movieServices", () => ({
  getActorsList: jest.fn(),
}));

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
  updateACuratedList,
  saveMovie,
  searchByGenreAndActor,
  sortMovies,
  getReviewList,
  sortMovesBasedOnRating,
  getActorsList,
} = require("../services/movieServices");

describe("movie controller tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should search movies", async () => {
    const mockResponse = {
      movies: [
        {
          title: "The Intouchables",
          tmdbId: 1300792,
          genre: "35,18",
          actors: [
            "Saif Ali Khan",
            "Varun Dhawan",
            "Wamiqa Gabbi",
            "Dia Mirza",
            "Nithya Menen",
          ],
          releaseYear: "",
          rating: 0,
          description:
            "A true story of two men who should never have met – a quadriplegic aristocrat who was injured in a paragliding accident and a young man from the projects.",
        },
        {
          title: "The Intouchables",
          tmdbId: 77338,
          genre: "18,35",
          actors: [
            "François Cluzet",
            "Omar Sy",
            "Anne Le Ny",
            "Clotilde Mollet",
            "Alba Gaïa Bellugi",
            "Audrey Fleurot",
            "Cyril Mendy",
            "Christian Ameri",
            "Marie-Laure Descoureaux",
            "Salimata Kamate",
            "Absa Diatou Toure",
            "Dominique Daguier",
            "François Caron",
            "Thomas Solivérès",
            "Grégoire Oestermann",
            "Dorothée Brière",
            "Joséphine de Meaux",
            "Émilie Caen",
            "Caroline Bourg",
            "Sylvain Lazard",
            "Jean-François Cayrey",
            "Ian Fenelon",
            "Renaud Barse",
            "François Bureloup",
            "Nicky Marbot",
            "Benjamin Baroche",
            "Jérôme Pauwels",
            "Antoine Laurent",
            "Fabrice Mantegna",
            "Hedi Bouchenafa",
            "Michel Winogradoff",
            "Elliot Latil",
            "Yun-Ping He",
            "Kévin Wamo",
            "Pierre-Laurent Barneron",
          ],
          releaseYear: "2011",
          rating: 8.272,
          description:
            "A true story of two men who should never have met – a quadriplegic aristocrat who was injured in a paragliding accident and a young man from the projects.",
        },
        {
          title: "The Intouchables",
          tmdbId: 1308960,
          genre: "35,18",
          actors: [],
          releaseYear: "",
          rating: 0,
          description:
            "A true story of two men who should never have met – a quadriplegic aristocrat who was injured in a paragliding accident and a young man from the projects.",
        },
        {
          title: "The Upside",
          tmdbId: 440472,
          genre: "35,18",
          actors: [
            "Kevin Hart",
            "Bryan Cranston",
            "Nicole Kidman",
            "Golshifteh Farahani",
            "Aja Naomi King",
            "Tate Donovan",
            "Jahi Di'Allo Winston",
            "Genevieve Angelson",
            "Suzanne Savoy",
            "Julianna Margulies",
            "Rachel Alana Handler",
            "Junnie Lopez",
            "Pia Mechler",
            "Amara Karan",
            "Ursula Triplett",
            "Mark Kochanowicz",
            "Annie Pisapia",
            "Phillip Chorba",
            "Alisha Poland",
            "Julie Stackhouse",
            "Lyman Chen",
            "Gary Ayash",
            "Jennifer Butler",
            "Laura Hart",
            "Jeffrey Mowery",
            "Rachel Christopher",
            "Madeleine Woolner",
            "Charmar Jeter",
            "Matthew D'Arcy",
            "Brian Gallagher",
            "Charles W Harris III",
            "Nikki Corinne Thomas",
            "Gemma McIlhenny",
            "Diego Aguirre",
            "Fernando Mateo Jr.",
            "Michael Quinlan",
            "James Georgiades",
          ],
          releaseYear: "2019",
          rating: 7.143,
          description:
            "Phillip is a wealthy quadriplegic who needs a caretaker to help him with his day-to-day routine in his New York penthouse. He decides to hire Dell, a struggling parolee who's trying to reconnect with his ex and his young son. Despite coming from two different worlds, an unlikely friendship starts to blossom.",
        },
      ],
    };
    const mockData = {
      data: {
        page: 1,
        results: [
          {
            adult: false,
            backdrop_path: null,
            genre_ids: [35, 18],
            id: 1300792,
            original_language: "hi",
            original_title: "The Intouchables",
            overview:
              "A true story of two men who should never have met – a quadriplegic aristocrat who was injured in a paragliding accident and a young man from the projects.",
            popularity: 0.5786,
            poster_path: null,
            release_date: "",
            title: "The Intouchables",
            video: false,
            vote_average: 0.0,
            vote_count: 0,
          },
          {
            adult: false,
            backdrop_path: "/oDTHNGAH1gZwNk45do1rOoU3oxN.jpg",
            genre_ids: [18, 35],
            id: 77338,
            original_language: "fr",
            original_title: "Intouchables",
            overview:
              "A true story of two men who should never have met – a quadriplegic aristocrat who was injured in a paragliding accident and a young man from the projects.",
            popularity: 19.6564,
            poster_path: "/1QU7HKgsQbGpzsJbJK4pAVQV9F5.jpg",
            release_date: "2011-11-02",
            title: "The Intouchables",
            video: false,
            vote_average: 8.272,
            vote_count: 17561,
          },
          {
            adult: false,
            backdrop_path: null,
            genre_ids: [35, 18],
            id: 1308960,
            original_language: "ar",
            original_title: "المنبوذين",
            overview:
              "A true story of two men who should never have met – a quadriplegic aristocrat who was injured in a paragliding accident and a young man from the projects.",
            popularity: 0.443,
            poster_path: null,
            release_date: "",
            title: "The Intouchables",
            video: false,
            vote_average: 0.0,
            vote_count: 0,
          },
          {
            adult: false,
            backdrop_path: "/ct2I74zKDrK1Ts2jJa9WixJrigg.jpg",
            genre_ids: [35, 18],
            id: 440472,
            original_language: "en",
            original_title: "The Upside",
            overview:
              "Phillip is a wealthy quadriplegic who needs a caretaker to help him with his day-to-day routine in his New York penthouse. He decides to hire Dell, a struggling parolee who's trying to reconnect with his ex and his young son. Despite coming from two different worlds, an unlikely friendship starts to blossom.",
            popularity: 8.6979,
            poster_path: "/hPZ2caow1PCND6qnerfgn6RTXdm.jpg",
            release_date: "2019-01-10",
            title: "The Upside",
            video: false,
            vote_average: 7.143,
            vote_count: 1305,
          },
        ],
        total_pages: 1,
        total_results: 4,
      },
    };
    validateSearchQuery.mockReturnValue(undefined);
    axiosInstance.get.mockResolvedValue(mockData);
    getActorsList
      .mockResolvedValueOnce([
        "Saif Ali Khan",
        "Varun Dhawan",
        "Wamiqa Gabbi",
        "Dia Mirza",
        "Nithya Menen",
      ])
      .mockResolvedValueOnce([
        "François Cluzet",
        "Omar Sy",
        "Anne Le Ny",
        "Clotilde Mollet",
        "Alba Gaïa Bellugi",
        "Audrey Fleurot",
        "Cyril Mendy",
        "Christian Ameri",
        "Marie-Laure Descoureaux",
        "Salimata Kamate",
        "Absa Diatou Toure",
        "Dominique Daguier",
        "François Caron",
        "Thomas Solivérès",
        "Grégoire Oestermann",
        "Dorothée Brière",
        "Joséphine de Meaux",
        "Émilie Caen",
        "Caroline Bourg",
        "Sylvain Lazard",
        "Jean-François Cayrey",
        "Ian Fenelon",
        "Renaud Barse",
        "François Bureloup",
        "Nicky Marbot",
        "Benjamin Baroche",
        "Jérôme Pauwels",
        "Antoine Laurent",
        "Fabrice Mantegna",
        "Hedi Bouchenafa",
        "Michel Winogradoff",
        "Elliot Latil",
        "Yun-Ping He",
        "Kévin Wamo",
        "Pierre-Laurent Barneron",
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        "Kevin Hart",
        "Bryan Cranston",
        "Nicole Kidman",
        "Golshifteh Farahani",
        "Aja Naomi King",
        "Tate Donovan",
        "Jahi Di'Allo Winston",
        "Genevieve Angelson",
        "Suzanne Savoy",
        "Julianna Margulies",
        "Rachel Alana Handler",
        "Junnie Lopez",
        "Pia Mechler",
        "Amara Karan",
        "Ursula Triplett",
        "Mark Kochanowicz",
        "Annie Pisapia",
        "Phillip Chorba",
        "Alisha Poland",
        "Julie Stackhouse",
        "Lyman Chen",
        "Gary Ayash",
        "Jennifer Butler",
        "Laura Hart",
        "Jeffrey Mowery",
        "Rachel Christopher",
        "Madeleine Woolner",
        "Charmar Jeter",
        "Matthew D'Arcy",
        "Brian Gallagher",
        "Charles W Harris III",
        "Nikki Corinne Thomas",
        "Gemma McIlhenny",
        "Diego Aguirre",
        "Fernando Mateo Jr.",
        "Michael Quinlan",
        "James Georgiades",
      ]);

    const req = {
      query: { query: "the intouchables", api_key: process.env.API_KEY },
    };
    const res = { json: jest.fn(), status: jest.fn(() => res) };

    await searchMovies(req, res);

    // expect(axiosInstance.get).toHaveBeenCalledWith(`/search/movie?query=`)
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });
});

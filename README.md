# Cinebuff

Cinebuff is a movie curation system where users can explore movies using the TMDB API, organize them into personalized watchlists, wishlists, and curated lists, and share reviews and ratings. All content is publicly accessible, encouraging discovery and sharing among movie lovers.

## Installation

Follow these steps to set up Cinebuff locally.

**Prerequisites:**
- Node.js v14.x.x or higher
- PostgreSQL
- A TMDB API key (sign up at [themoviedb.org](https://www.themoviedb.org/))

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cinebuff.git
   cd cinebuff
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a .env file:
   ```bash
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   DB_NAME=postgres
   PORT=3000
   MICROSERVICE_BASE_URL=https://api.themoviedb.org/3
   API_KEY=your_tmdb_api_key
   ```
4. Run database migrations with Sequelize:
   ```bash
   npx sequelize-cli db:migrate
   ```
5. Start the application and interact with the API.
   ```bash
   npm start
   ```
The app will run on http://localhost:3000 (or the port specified in your .env file). You can access the deployed version at https://cinebuff-ten.vercel.app/.

## Features

- **Data Modeling**: Designed a relational database with Sequelize models and associations.
- **Search Movies**: Make API calls to TMDB to search movies by keyword.
- **Curated Lists**: Create curated movie lists with custom names, descriptions, and slugs.
- **List Management**: Rename lists and edit short descriptions.
- **Watchlist & Wishlist**: Save movies to personal watchlists, wishlists, or curated lists.
- **Ratings & Reviews**: Rate and review movies you've watched.
- **Search by Genre or Actor**: Filter curated lists based on genres or actors.
- **Sort Lists**: Sort watchlists, wishlists, and curated lists by rating or year of release.
- **Top-Rated Picks**: Fetch the top 5 highest-rated movies with detailed reviews.
- **Testing**: Unit tests were written with Jest to ensure core functionalities worked as expected.

## API Documentation

Base URL: `https://cinebuff-ten.vercel.app`

Below is a summary of the available API endpoints.

| Method | Endpoint                                      | Description                        | Body (if applicable)                                    |
|--------|-----------------------------------------------|------------------------------------|---------------------------------------------------------|
| GET    | `/api/movies/search?query=keyword`            | Search movies by keyword           | None                                                    |
| POST   | `/api/curated-lists`                          | Create a curated list              | `{"name": "Horror Movies New", "description": "A collection of the best horror films.", "slug": "horror-movies"}` |
| POST   | `/api/movies/watchlist`                       | Add movie to watchlist             | `{"movieId": 77338}`                                    |
| POST   | `/api/movies/wishlist`                        | Add movie to wishlist              | `{"movieId": 27205}`                                    |
| POST   | `/api/movies/curated-list`                    | Add movie to curated list          | `{"movieId": 37799, "curatedListId": 2}`               |
| POST   | `/api/movies/:id/reviews`                     | Add a review and rating to a movie | `{"rating": 10, "reviewText": "Great movie."}`          |
| GET    | `/api/movies/searchByGenreAndActor?genre=Action&actor=Leonardo DiCaprio` | Search movies by genre and actor | None                                                    |
| GET    | `/api/movies/sort?list=curatedlist&sortBy=rating&order=ASC` | Sort movies in lists by rating or release year | None                                                    |
| PUT    | `/api/curated-lists/:id`                      | Update curated list                | `{"description": "A collection of more scary movies"}`  |
| GET    | `/api/movies/top5`                            | Get the top 5 movies               | None                                                    |

## Deployment

The application is deployed and accessible at [https://cinebuff-ten.vercel.app/](https://cinebuff-ten.vercel.app/).

import mongoose from 'mongoose';
import 'dotenv/config';

import Movie from './models/movie.js';
import Review from './models/review.js';
import User from './models/user.js';

import movies from './data/movies.js';
import reviewData from './data/reviews.js';
import userData from './data/users.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected');

    // Clear DB
    await Movie.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();

    const newMovies = await Movie.create(movies);
    console.log(`${movies.length} movies created`);

    const userWithFavMovies = {
      ...userData[0],
      favourites: [newMovies[0]._id, newMovies[1]._id],
    };

    await User.create(userWithFavMovies);
    console.log('User created with favorites');

    const remainingUsers = userData.slice(1);
    const users = await User.create(remainingUsers);
    console.log(`${users.length} users created`);

    if (users.length === 0) {
      throw new Error('No users available to assign as authors for reviews.');
    }

    const reviews = await Review.create(
      reviewData.map((review) => {
        const movie = newMovies.find((movie) => movie.title === review.title);
        if (!movie) {
          throw new Error(`Movie not found for review: ${review.title}`);
        }
        return {
          content: review.content,
          author: users[Math.floor(Math.random() * users.length)]._id,
          movieId: movie._id,
        };
      })
    );

    console.log(`${reviews.length} reviews added`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error during seeding:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
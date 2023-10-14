import mongoose from "mongoose";

const movieModel = mongoose.model(
  "movie",
  new mongoose.Schema({
    title: String,
    genres: [String],
    plot: String,
    cast: [String],
    rated: String,
    upload_date: Date,
    directors: [String],
    poster: String,
    movie: String,
  })
);
export const viewModel = mongoose.model(
  "view",
  new mongoose.Schema({
    movieId: String,
    views: Number,
    date: Date,
  })
);

export default movieModel;

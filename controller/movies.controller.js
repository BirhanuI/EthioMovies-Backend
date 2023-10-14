import movieModel, { viewModel } from "../models/movies.model.js";

export default class moviesController {
  static async addMovie(data) {
    function newPath(i) {
      const oldPath = data.files[i].path;
      const index = oldPath.indexOf("\\") + 1;
      const path = oldPath.slice(index);
      return path;
    }
    const movie = {
      title: data.body.title,
      genres: data.body.genre,
      plot: data.body.plot,
      cast: data.body.cast,
      rated: data.body.rated,
      upload_date: Date.now(),
      directors: data.body.directors,
      poster: newPath(0).trim(),
      movie: newPath(1).trim(),
    };
    try {
      const theMovie = await movieModel.create(movie);
      return theMovie;
    } catch (e) {}
  }
  static async getMovies() {
    const movies = await movieModel.find();
    return movies;
  }
  static async getGenre(parm) {
    const movie = await movieModel.find({
      genres: { $elemMatch: { $eq: parm } },
    });
    return movie;
  }
  static async getMovie(parm) {
    const movie = await movieModel.find({ _id: parm });
    return movie;
  }
  static async setViews(parm) {
    const getDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    let movie = await viewModel.findOne({ movieId: parm, date: getDate() });
    if (!movie) {
      movie = await viewModel.create({
        movieId: parm,
        date: getDate(),
        views: 1,
      });
    } else {

      let views = movie.views;
      movie = await viewModel.updateOne({
        movieId: parm,
        date: getDate()},{
        views: views + 1,
      });
    }
    console.log(movie);
    return movie;
  }
  static async getViews(parm) {
    const movie = await viewModel.find({ movieId: parm });
    let movieView = {totalView:"",}
    return movie;
  }
}

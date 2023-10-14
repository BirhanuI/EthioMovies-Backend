import express from "express";
import upload from "../midlewares/upload.midleware.js";
import moviesController from "../controller/movies.controller.js";
const movie = express.Router();
movie.get("/", async (req, res) => {
  const movies = await moviesController.getMovies();
  res.send(movies);
});
movie.post("/upload/movie", upload.array("file", 3), async (req, res) => {
  const movie = await moviesController.addMovie({
    body: req.body,
    files: req.files,
  });
  console.log(req.body.genre)
  res.send(movie);
});
movie.get("/genre/:genre", async (req, res) => {
  const movies = await moviesController.getGenre(req.params.genre);
  res.send(movies);
});
movie.get("/:movie",async (req,res)=>{
  const movie = await moviesController.getMovie(req.params.movie);
  res.send(movie);
})
movie.put("/views/:movie", async (req, res) => {
  const movie = await moviesController.setViews(req.params.movie);
  console.log(movie)
  res.sendStatus(204);
})
movie.get("/views/:movie", async (req, res) => {
  const movie = await moviesController.getViews(req.params.movie);
  res.send(movie)
})
export default movie;

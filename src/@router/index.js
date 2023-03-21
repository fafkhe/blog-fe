import userRouter from "./user-router";
import blogRouter from "./blog-router";

export default (app) => {
  app.get("/", (req, res) => {
    res.send("hello from fafkhe !!!");
  });

  app.use("/user", userRouter);
  app.use("/blog", blogRouter);

  app.all("*", (req, res, next) => {
    res.send("<h1> Ooops! 404! </h1>");

    // next(new AppError(`Cant find${req.originalUrl} on this server`, 404));
  });

  app.use((err, req, res, next) => {
    flr("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    flg(err.statusCode);
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  });
};

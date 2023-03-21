import express from "express";
import "./run-db";
import _applyMiddlewares from "./middlewares";
import _applyRoutes from "@router";

export default () => {
  const app = express();

  _applyMiddlewares(app);
  _applyRoutes(app);

  app.listen(3000, () => console.log("app is running on port 3000"));
};

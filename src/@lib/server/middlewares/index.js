import express from "express";
import decodeToken from "./jwt-auth";
import path from "path";

export default (app) => {
  app.use(express.json());

  app.use((req, res, next) => {
    try {
      req.user = decodeToken(req.headers.auth);
    } catch (error) {
      req.user = null;
    }
    next();
  });

  app.use((req, res, next) => {
    next();
  });

  app.use(express.static(path.join(process.cwd(), `/src/public/`)));
};

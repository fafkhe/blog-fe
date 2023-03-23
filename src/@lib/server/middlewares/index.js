import express from "express";
import decodeToken from "./jwt-auth";

export default (app) => {
  app.use(express.json());

  app.use((req, res, next) => {
    console.log(req.headers);
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
};

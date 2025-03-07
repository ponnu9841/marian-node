// const express = require('express');
// const { PrismaClient } = require('@prisma/client');
import express, { type Express } from "express";
import User from "./routes/User";
import cors from "cors";
// import dotenv from "dotenv";
// import Todo from "./routes/Todo";
// import Item from "./routes/Item";
// dotenv.config();

const app: Express = express();
const PORT = 8000;
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
// app.use(express.urlencoded({ extended: true }));

app.use("/api/user", User);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

module.exports = app;

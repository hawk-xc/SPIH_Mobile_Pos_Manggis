import express from 'express';
import route from './routes.js';
import bodyParser from 'body-parser';
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.listen(
  process.env.APP_PORT || 8080,
  process.env.APP_HOST || process.env.APP_HOST,
  () => {
    console.log(
      `Server running at http://${process.env.APP_HOST}:${process.env.APP_PORT}`
    );
  }
);


app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.contentType('application/json');
  next();
}, bodyParser.json());

// development route
app.use('/dev', route);
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Routes from "./routes/routes.js";
import http from "http";
import cluster from "cluster";
import os from "os";
import fileUpload from "express-fileupload";
import cors from "cors"; 
import  connectDB  from "./config/db.js";
import errorHandler from "./helper/globalErrorHandler.js";

// Load environment variables from .env file
dotenv.config();

const numCPUs = os.cpus().length; 

if (cluster.isPrimary) {
  // Master process
  console.log(`Master ${process.pid} is running`);

  // Fork workers (one for each CPU core)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // If a worker dies, restart it
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });

} else {
  // Worker processes (these will run the server)
  const app = express();

 
  app.use(cors({
    origin:  ["http://localhost:3001","http://localhost:3002", "https://tour-travels-39t9.vercel.app", "https://tour-travels-theta.vercel.app/admin/all-tours" ], 
    credentials: true,
  }));

  // Middleware for cookies and parsing
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(fileUpload());

  // Middleware for parsing application/json
  app.use(express.json());

  // Connect to the database (only once per worker)
  connectDB()

  // Routes
  app.use("/api/v1", Routes);
  
  // Global error handler
  app.use(errorHandler)

  // Start the server and listen on the specified port
  const port = process.env.PORT || 4000;
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Worker ${process.pid} is running on port ${port}`);
  });
}
import express from "express";
import {  getCategory } from "../controllers/categoryController.js";



const router = express.Router();

// Category routes

router.get("/:id", getCategory);


export default router;

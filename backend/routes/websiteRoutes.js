import express from 'express';
import { changes, deploy, generatewebsite, getAll, getBySlug, getWebsiteById } from '../controllers/websiteControllers.js';
import isAuth from '../middlewares/isAuth.js';


const websiteRouter= express.Router();

websiteRouter.post("/generate",isAuth ,generatewebsite);
websiteRouter.post("/update/:id", isAuth, changes);
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);
websiteRouter.get("/get-all", isAuth, getAll);
websiteRouter.post("/deploy/:id", isAuth, deploy);
websiteRouter.get("/get-by-slug/:slug", getBySlug);


export default websiteRouter;

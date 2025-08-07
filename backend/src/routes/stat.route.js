import { Router } from "express";
import { getStats } from "../controller/stat.controller.js";

const router = Router();

router.get("/", getStats);

export default router;

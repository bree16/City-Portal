import { Router, type IRouter } from "express";
import healthRouter from "./health";
import assistantRouter from "./assistant";
import eventsRouter from "./events";
import profileRouter from "./profile";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assistantRouter);
router.use(eventsRouter);
router.use(profileRouter);

export default router;

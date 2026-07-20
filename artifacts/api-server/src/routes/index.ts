import { Router, type IRouter } from "express";
import healthRouter from "./health";
import assistantRouter from "./assistant";
import eventsRouter from "./events";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assistantRouter);
router.use(eventsRouter);

export default router;

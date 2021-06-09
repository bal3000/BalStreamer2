import express, { Request, Response } from 'express';
import { RabbitMQ } from '../events/rabbit-mq';

export const scheduleRouter = (rmq: RabbitMQ) => {
  const router = express.Router();

  router.post('/api/schedule', async (req: Request, res: Response) => {});

  return router;
};

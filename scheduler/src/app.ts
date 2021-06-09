import express, { json } from 'express';

import { RabbitMQ } from './events/rabbit-mq';
import { scheduleRouter } from './routes/add-to-schedule';

const serve = (port: number, rmq: RabbitMQ): Promise<void> => {
  const app = express();
  app.use(json());

  app.use(scheduleRouter(rmq));

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};

export default serve;

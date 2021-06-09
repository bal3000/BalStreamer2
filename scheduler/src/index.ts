import { RabbitMQ } from './events/rabbit-mq';
import serve from './app';

const start = async () => {
  const rmq = new RabbitMQ('');
  try {
    await rmq.openConnection();

    rmq.startConsumer('', '', (msg) => {
      console.log(msg);
      return true;
    });

    await serve(3001, rmq);
  } finally {
    await rmq.closeConnection();
  }
};

start();

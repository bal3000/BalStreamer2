import { RabbitMQ } from './events/rabbit-mq';
import { AutoPlayer } from './auto-player';
import serve from './app';

const start = async () => {
  const rmq = new RabbitMQ('');
  try {
    await rmq.openConnection();

    rmq.startConsumer('', '', (msg) => {
      console.log(msg);
      return true;
    });

    const player = new AutoPlayer();
    player.setTeam('Liverpool').setCountry('England').invoke();

    await serve(3001, rmq);
  } finally {
    await rmq.closeConnection();
  }
};

start();

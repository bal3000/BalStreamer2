import amqplib from 'amqplib';

export class ScheduleMatchListener {
  #rabbitUrl: string;
  readonly #exchangeName = 'bal-streamer-caster';

  constructor(url: string) {
    this.#rabbitUrl = url;
  }

  async startConsumer(messageHandler: (message: string) => boolean) {
    const conn = await amqplib.connect(this.#rabbitUrl);
    const channel = await conn.createChannel();
    await channel.assertExchange(this.#exchangeName, 'fanout');
    const { queue } = await channel.assertQueue('bal-streamer-scheduler', {
      durable: true,
    });
    await channel.bindQueue(queue, this.#exchangeName, '');

    channel.consume(queue, async (msg) => {
      if (messageHandler(msg)) {
        channel.ack(msg);
      } else {
        channel.nack(msg);
      }
    });
  }
}

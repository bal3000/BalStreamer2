import amqplib from 'amqplib';

import { RabbitEvent } from './rabbit-event';

export class RabbitMQ {
  #rabbitUrl: string;
  #connection: amqplib.Connection | null = null;
  #channel: amqplib.Channel | null = null;

  constructor(url: string) {
    this.#rabbitUrl = url;
  }

  async openConnection(): Promise<amqplib.Channel> {
    this.#connection = await amqplib.connect(this.#rabbitUrl);
    this.#channel = await this.#connection.createChannel();
    return this.#channel;
  }

  async closeConnection() {
    await this.#channel?.close();
    await this.#connection?.close();
  }

  async startConsumer<T extends RabbitEvent>(
    queueName: string,
    exchangeName: string,
    messageHandler: (message: T) => boolean
  ) {
    if (!this.#channel) {
      console.log('no channel available');
      return;
    }
    await this.#channel.assertExchange(exchangeName, 'fanout');
    const { queue } = await this.#channel.assertQueue(queueName, {
      durable: true,
    });
    await this.#channel.bindQueue(queue, exchangeName, '');

    this.#channel.consume(queue, async (msg) => {
      if (!this.#channel) {
        console.log('no channel available');
        return;
      }

      if (msg) {
        const body = msg.content.toString();
        if (!body) {
          return;
        }

        const event = JSON.parse(body) as T;
        if (messageHandler(event)) {
          this.#channel.ack(msg);
        } else {
          this.#channel.nack(msg);
        }
      }
    });
  }

  getType<T>(TCtor: new (...args: any[]) => T): T {
    return new TCtor();
  }
}

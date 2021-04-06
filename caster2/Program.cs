using System;
using RabbitMQ.Client;

namespace BalStreamer2.Caster
{
    class Program
    {
        public static void Main(string[] args)
        {
            var factory = new ConnectionFactory { HostName = "localhost" };
            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            channel.ExchangeDeclare(exchange: "bal-streamer-caster", type: ExchangeType.Fanout);



            Console.WriteLine("Press enter to exit");
            Console.ReadLine();
        }
    }
}

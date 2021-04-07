using System;
using System.Text.Json;
using System.Threading.Tasks;
using BalStreamer2.Caster.EventBus.Events;
using BalStreamer2.Caster.VLC;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace BalStreamer2.Caster.EventBus
{
    public class RabbitMQBus : IRabbitMQBus, IDisposable
    {
        private const string _exchangeName = "bal-streamer-caster";
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly IChromeCastHelper _chromeCastHelper;
        private readonly ILogger<RabbitMQBus> _logger;

        public RabbitMQBus(IChromeCastHelper chromeCastHelper, ILogger<RabbitMQBus> logger)
        {
            _chromeCastHelper = chromeCastHelper;
            _logger = logger;
            var factory = new ConnectionFactory { HostName = "localhost" };
            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();
            _channel.ExchangeDeclare(exchange: _exchangeName, type: ExchangeType.Fanout);
        }

        public void SendMessage<T>(T message, string routingkey) where T : IChromecastEvent
        {
            var body = message.GetMessage();
            var props = _channel.CreateBasicProperties();
            props.ContentType = "application/json";
            props.Type = message.MessageType;
            props.DeliveryMode = 2;

            _channel.BasicPublish(
                exchange: _exchangeName,
                routingKey: routingkey,
                mandatory: false,
                basicProperties: props,
                body: body);
        }

        public void StartConsumer(string routingkey, Func<BasicDeliverEventArgs, Task> eventReceived)
        {
            var queueName = _channel.QueueDeclare(durable: true).QueueName;
            _channel.QueueBind(queue: queueName,
                              exchange: _exchangeName,
                              routingKey: routingkey);

            var consumer = new RabbitMQ.Client.Events.AsyncEventingBasicConsumer(_channel);

            consumer.Received += (sender, e) => eventReceived(e);

            _channel.BasicConsume(queue: queueName, autoAck: true, consumer: consumer);
        }

        public void Dispose()
        {
            _logger.LogInformation($"Stopping rabbit connection and disposing resources");
            _channel.Close();
            _connection.Close();
            _channel.Dispose();
            _connection.Dispose();
        }
    }
}
using System;
using System.Text.Json;
using System.Threading.Tasks;
using BalStreamer2.Caster.EventBus.Events;
using BalStreamer2.Caster.VLC;
using RabbitMQ.Client;

namespace BalStreamer2.Caster.EventBus
{
    public class RabbitMQBus : IRabbitMQBus, IDisposable
    {
        private const string _exchangeName = "bal-streamer-caster";
        private readonly IConnection _connection;
        private readonly IModel _channel;
        private readonly IChromeCastHelper _chromeCastHelper;

        public RabbitMQBus(IChromeCastHelper chromeCastHelper)
        {
            _chromeCastHelper = chromeCastHelper;

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

        public void StartConsumer(string routingkey, Func<StreamToChromecastEvent, Task> castEventReceived, Func<StopPlayingStreamEvent, Task> stopEventReceived)
        {
            var queueName = _channel.QueueDeclare(durable: true).QueueName;
            _channel.QueueBind(queue: queueName,
                              exchange: _exchangeName,
                              routingKey: routingkey);

            var consumer = new RabbitMQ.Client.Events.AsyncEventingBasicConsumer(_channel);

            consumer.Received += async (sender, e) =>
            {
                using var body = new System.IO.MemoryStream(e.Body.ToArray());
                if (Enum.TryParse(e.BasicProperties.Type, out EventTypes msgType))
                {
                    if (msgType == EventTypes.PlayStreamEvent)
                    {
                        var eve = await JsonSerializer.DeserializeAsync<StreamToChromecastEvent>(
                            body,
                            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                        );
                        await castEventReceived(eve);
                    }
                    else if (msgType == EventTypes.StopStreamEvent)
                    {
                        var eve = await JsonSerializer.DeserializeAsync<StopPlayingStreamEvent>(
                            body,
                            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                        );
                        await stopEventReceived(eve);
                    }
                }
            };

            _channel.BasicConsume(queue: queueName, autoAck: true, consumer: consumer);
        }

        public void Dispose()
        {
            _channel.Close();
            _connection.Close();
            _channel.Dispose();
            _connection.Dispose();
        }
    }
}
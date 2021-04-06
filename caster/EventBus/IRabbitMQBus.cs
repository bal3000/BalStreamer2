using System;
using System.Threading.Tasks;
using BalStreamer2.Caster.EventBus.Events;
using RabbitMQ.Client.Events;

namespace BalStreamer2.Caster.EventBus
{
    public interface IRabbitMQBus
    {
        void SendMessage<T>(T message, string routingkey) where T : IChromecastEvent;
        void StartConsumer(string routingkey, Func<object, BasicDeliverEventArgs, Task> eventReceived);
    }
}
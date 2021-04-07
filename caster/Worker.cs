using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using BalStreamer2.Caster.EventBus;
using BalStreamer2.Caster.EventBus.Events;
using BalStreamer2.Caster.VLC;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BalStreamer2.Caster
{
    public class Worker : BackgroundService
    {
        private const string routingKey = "chromecast-key";
        private readonly IRabbitMQBus _rabbitMQ;
        private readonly IChromeCastHelper _castHelper;
        private readonly ILogger<Worker> _logger;

        private List<string> CurrentChromecasts { get; set; } = new List<string>();

        public Worker(IRabbitMQBus rabbitMQ, IChromeCastHelper castHelper, ILogger<Worker> logger)
        {
            _rabbitMQ = rabbitMQ;
            _castHelper = castHelper;
            _logger = logger;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            // Start discovery
            _castHelper.DiscoverChromecasts();

            return base.StartAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Start consuming rabbit cast events
            ListenForEvents();

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

                UpdateChromecastList();

                await Task.Delay(2 * 1000, stoppingToken);
            }
        }

        private void UpdateChromecastList()
        {
            _logger.LogInformation("Getting current found chromecasts");

            var foundChromecasts = _castHelper.RendererItems.Where(x => !CurrentChromecasts.Contains(x.Name));
            var lostChromecasts = CurrentChromecasts.Where(x => !_castHelper.RendererItems.Any(a => a.Name == x));

            // Not found before, adding
            foreach (var item in foundChromecasts)
            {
                _logger.LogInformation($"Found chromecast {item.Name}");
                CurrentChromecasts.Add(item.Name);
                _rabbitMQ.SendMessage<ChromecastFoundEvent>(new ChromecastFoundEvent { Chromecast = item.Name }, routingKey);
            }

            // found before, not there anymore, removing
            foreach (var item in lostChromecasts)
            {
                _logger.LogInformation($"Lost chromecast {item}");
                CurrentChromecasts.Remove(item);
                _rabbitMQ.SendMessage<ChromecastLostEvent>(new ChromecastLostEvent { Chromecast = item }, routingKey);
            }
        }

        private void ListenForEvents()
        {
            _rabbitMQ.StartConsumer(routingKey, async (e) =>
            {
                if (Enum.TryParse(e.BasicProperties.Type, out EventTypes msgType))
                {
                    if (msgType == EventTypes.PlayStreamEvent)
                    {
                        var eve = await DeserializeEventAsync<StreamToChromecastEvent>(e.Body.ToArray());
                        var item = _castHelper.RendererItems.Where(x => x.Name == eve.Chromecast).FirstOrDefault();
                        if (item != null)
                            _castHelper.StartCasting(new Uri(eve.StreamURL), item);
                        else
                            _logger.LogError("Chromecast not found for given cast event");
                    }
                    else if (msgType == EventTypes.StopStreamEvent)
                    {
                        var eve = await DeserializeEventAsync<StopPlayingStreamEvent>(e.Body.ToArray());
                        _logger.LogError($"Stopping cast at {eve.StopDateTime.ToString("yyyy-MM-dd hh:mm")}");
                        await Task.Run(() => _castHelper.StopCasting());
                    }
                    else if (msgType == EventTypes.ChromecastLatestEvent)
                    {
                        foreach (var item in _castHelper.RendererItems)
                        {
                            _logger.LogInformation($"Found chromecast {item.Name}");
                            CurrentChromecasts.Add(item.Name);
                            _rabbitMQ.SendMessage<ChromecastFoundEvent>(new ChromecastFoundEvent { Chromecast = item.Name }, routingKey);
                        }
                    }
                }
            });
        }

        private async Task<T> DeserializeEventAsync<T>(byte[] body)
        {
            using var msg = new System.IO.MemoryStream(body.ToArray());
            return await JsonSerializer.DeserializeAsync<T>(msg, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
    }
}

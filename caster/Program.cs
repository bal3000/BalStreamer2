using BalStreamer2.Caster.VLC;
using BalStreamer2.Caster.EventBus;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace BalStreamer2.Caster
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddSingleton<IChromeCastHelper, ChromeCastHelper>();
                    services.AddSingleton<IRabbitMQBus, RabbitMQBus>();

                    services.AddHostedService<Worker>();
                });
    }
}

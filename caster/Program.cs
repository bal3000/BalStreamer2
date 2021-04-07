using BalStreamer2.Caster.VLC;
using BalStreamer2.Caster.EventBus;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using System;

namespace BalStreamer2.Caster
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .Enrich.FromLogContext()
                .WriteTo.File(@"D:\BalStreamer2\logs\LogFile.txt", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 3, rollOnFileSizeLimit: true)
                .WriteTo.Console()
                .CreateLogger();

            try
            {
                Log.Information("Starting the BalStreamer Caster");
                CreateHostBuilder(args).Build().Run();
                return;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "There was a problem starting the BalStreamer Caster");
                return;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddSingleton<IChromeCastHelper, ChromeCastHelper>();
                    services.AddSingleton<IRabbitMQBus, RabbitMQBus>();

                    services.AddHostedService<Worker>();
                })
                .UseSerilog();
    }
}

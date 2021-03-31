using BalStreamer2.Caster.Protos;
using BalStreamer2.Caster.VLC;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using System;
using System.Threading.Tasks;

namespace BalStreamer2.Caster.Services
{
    public class ChromecastService : Chromecast.ChromecastBase
    {
        private readonly IChromeCastHelper _chromecastHelper;

        public ChromecastService(IChromeCastHelper chromecastHelper)
        {
            _chromecastHelper = chromecastHelper;
        }

        public override async Task FindChromecasts(Empty request, IServerStreamWriter<FindChromecastsResponse> responseStream, ServerCallContext context)
        {
            _chromecastHelper.DiscoverChromecasts(
                async (_, e) =>
                {
                    await responseStream.WriteAsync(new FindChromecastsResponse
                    {
                        ChromecastName = e.RendererItem.Name,
                        ChromecastStatus = Protos.Status.Found
                    });
                },
                async (_, e) =>
                {
                    await responseStream.WriteAsync(new FindChromecastsResponse
                    {
                        ChromecastName = e.RendererItem.Name,
                        ChromecastStatus = Protos.Status.Lost
                    });
                });

            while (!context.CancellationToken.IsCancellationRequested)
            {
                await Task.Delay(TimeSpan.FromSeconds(1));
            }
        }
    }
}

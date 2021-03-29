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
            // send inital list
            foreach (var cast in _chromecastHelper.RendererItems)
            {
                await responseStream.WriteAsync(new FindChromecastsResponse
                {
                    ChromecastName = cast.Name,
                    ChromecastStatus = Protos.Status.Found
                });
            }

            while (!context.CancellationToken.IsCancellationRequested)
            {
                // hook up to chromecast events

                await responseStream.WriteAsync(new FindChromecastsResponse
                {
                    ChromecastName = "",
                    ChromecastStatus = Protos.Status.Found
                });

                await Task.Delay(TimeSpan.FromSeconds(1));
            }
        }
    }
}

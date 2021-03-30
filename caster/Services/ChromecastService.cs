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
            _chromecastHelper.DiscoverChromecasts();
        }

        public override async Task FindChromecasts(Empty request, IServerStreamWriter<FindChromecastsResponse> responseStream, ServerCallContext context)
        {
            // var chromecasts = new List<string>();

            while (!context.CancellationToken.IsCancellationRequested)
            {
                foreach (var cast in _chromecastHelper.RendererItems)
                {
                    await responseStream.WriteAsync(new FindChromecastsResponse
                    {
                        ChromecastName = cast.Name,
                        ChromecastStatus = Protos.Status.Found
                    });
                }

                // PUT TO ONE SIDE TO TRY A MORE SIMPLE APPROACH
                // // Add new found chromecasts
                // foreach (var item in _chromecastHelper.RendererItems)
                // {
                //     if (!chromecasts.Contains(item.Name))
                //     {
                //         chromecasts.Add(item.Name);
                //         await responseStream.WriteAsync(new FindChromecastsResponse
                //         {
                //             ChromecastName = item.Name,
                //             ChromecastStatus = Protos.Status.Found
                //         });
                //     }
                // }

                // // remove lost chromecasts
                // var lostCasts = new List<string>();
                // foreach (var item in chromecasts)
                // {
                //     if (!_chromecastHelper.RendererItems.Any(a => a.Name == item))
                //     {
                //         lostCasts.Add(item);
                //         await responseStream.WriteAsync(new FindChromecastsResponse
                //         {
                //             ChromecastName = item,
                //             ChromecastStatus = Protos.Status.Lost
                //         });
                //     }
                // }

                // chromecasts.RemoveAll(c => lostCasts.Contains(c));

                await Task.Delay(TimeSpan.FromSeconds(1));
            }
        }
    }
}

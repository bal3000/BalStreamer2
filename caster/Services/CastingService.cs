using BalStreamer2.Caster.Protos;
using BalStreamer2.Caster.VLC;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BalStreamer2.Caster.Services
{
    public class CastingService : Casting.CastingBase
    {
        private readonly IChromeCastHelper _chromecastHelper;

        public CastingService(IChromeCastHelper chromecastHelper)
        {
            _chromecastHelper = chromecastHelper;
        }

        public override Task<CastStartResponse> CastStream(CastStartRequest request, ServerCallContext context)
        {
            var chromecast = _chromecastHelper.RendererItems.Where(x => x.Name == request.Chromecast).FirstOrDefault();
            var success = _chromecastHelper.StartCasting(new Uri(request.Stream), chromecast);
            return Task.FromResult(new CastStartResponse { Success = success  });
        }

        public override Task<Empty> StopStream(StopStreamRequest request, ServerCallContext context)
        {
            _chromecastHelper.StopCasting();
            return base.StopStream(request, context);
        }
    }
}

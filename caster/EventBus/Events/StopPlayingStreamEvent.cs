using System;

namespace BalStreamer2.Caster.EventBus.Events
{
    public record StopPlayingStreamEvent(string ChromeCastToStop, DateTime StopDateTime);
}
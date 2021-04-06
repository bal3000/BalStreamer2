namespace BalStreamer2.Caster.EventBus.Events
{
    public record StreamToChromecastEvent(string Chromecast, string StreamURL);
}
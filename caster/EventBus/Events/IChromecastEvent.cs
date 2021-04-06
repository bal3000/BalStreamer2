namespace BalStreamer2.Caster.EventBus.Events
{
    public interface IChromecastEvent
    {
        byte[] GetMessage();
        string MessageType { get; }
    }
}
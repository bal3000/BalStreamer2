using System.Text;
using System.Text.Json;

namespace BalStreamer2.Caster.EventBus.Events
{
    public class ChromecastFoundEvent : IChromecastEvent
    {
        public string Chromecast { get; init; }

        public string MessageType => EventTypes.ChromecastFoundEvent.ToString();

        public byte[] GetMessage()
        {
            var message = JsonSerializer.Serialize<ChromecastFoundEvent>(this);
            if (string.IsNullOrWhiteSpace(message))
                return null;

            return Encoding.UTF8.GetBytes(message);
        }
    }
}
using System.Text;
using System.Text.Json;

namespace BalStreamer2.Caster.EventBus.Events
{
    public class ChromecastLostEvent : IChromecastEvent
    {
        public string Chromecast { get; init; }

        public string MessageType => EventTypes.ChromecastLostEvent.ToString();

        public byte[] GetMessage()
        {
            var message = JsonSerializer.Serialize<ChromecastLostEvent>(this);
            if (string.IsNullOrWhiteSpace(message))
                return null;

            return Encoding.UTF8.GetBytes(message);
        }
    }
}
using LibVLCSharp.Shared;
using System;
using System.Collections.Generic;

namespace BalStreamer2.Caster.VLC
{
    public class ChromeCastHelper : IChromeCastHelper, IDisposable
    {
        private readonly LibVLC _libVLC;
        private readonly MediaPlayer _mediaPlayer;

        public ChromeCastHelper(bool startDiscovery = false)
        {
            // Load native libvlc library
            Core.Initialize();
            _libVLC = new LibVLC("--no-audio");
            _mediaPlayer = new MediaPlayer(_libVLC);

            // Redirect log output to the console
            // _libVLC.Log += (sender, e) => Console.WriteLine($"[{e.Level}] {e.Module}:{e.Message}");

            if (startDiscovery)
                DiscoverChromecasts();
        }

        public List<RendererItem> RendererItems { get; set; } = new List<RendererItem>();
        public event EventHandler<RendererDiscovererItemAddedEventArgs> ChromecastFound;
        public event EventHandler<RendererDiscovererItemDeletedEventArgs> ChromecastLost;

        public void DiscoverChromecasts()
        {
            var rendererDiscoverer = new RendererDiscoverer(_libVLC);
            rendererDiscoverer.ItemAdded += RendererDiscoverer_ItemAdded;
            rendererDiscoverer.ItemDeleted += RendererDiscoverer_ItemDeleted;
            rendererDiscoverer.Start();
        }
        public void DiscoverChromecasts(Action<object, RendererDiscovererItemAddedEventArgs> chromecastFound, Action<object, RendererDiscovererItemDeletedEventArgs> chromecastLost)
        {
            var rendererDiscoverer = new RendererDiscoverer(_libVLC);
            rendererDiscoverer.ItemAdded += (sender, e) => chromecastFound(sender, e);
            rendererDiscoverer.ItemDeleted += (sender, e) => chromecastLost(sender, e);
            rendererDiscoverer.Start();
        }

        public bool StartCasting(Uri stream, RendererItem rendererItem)
        {
            Console.WriteLine($"Starting cast with stream: {stream} on renderer {rendererItem.Name} or type {rendererItem.Type}");
            // create a media
            using var media = new Media(_libVLC, stream);

            // set the first discovered renderer item (chromecast) on the mediaplayer
            // if you set it to null, it will start to render normally (i.e. locally) again
            _mediaPlayer.SetRenderer(rendererItem);

            // start the playback
            return _mediaPlayer.Play(media);
        }

        public void StopCasting()
        {
            if (_mediaPlayer.IsPlaying)
                _mediaPlayer.Stop();
        }

        protected void RendererDiscoverer_ItemAdded(object sender, RendererDiscovererItemAddedEventArgs e)
        {
            Console.WriteLine($"New chromecast discovered: {e.RendererItem.Name} of type {e.RendererItem.Type}");

            if (e.RendererItem.CanRenderVideo)
                Console.WriteLine("Can render video");
            if (e.RendererItem.CanRenderAudio)
                Console.WriteLine("Can render audio");

            RendererItems.Add(e.RendererItem);

            ChromecastFound?.Invoke(this, e);
        }

        protected void RendererDiscoverer_ItemDeleted(object sender, RendererDiscovererItemDeletedEventArgs e)
        {
            Console.WriteLine($"Chromecast {e.RendererItem.Name} of type {e.RendererItem.Type} cannot be found so removing");

            RendererItems.Remove(e.RendererItem);

            ChromecastLost?.Invoke(this, e);
        }

        public void Dispose()
        {
            Console.WriteLine($"Stopping chromecast connection and disposing resources");
            _mediaPlayer.Stop();
            _libVLC.Dispose();
            _mediaPlayer.Dispose();
        }
    }
}

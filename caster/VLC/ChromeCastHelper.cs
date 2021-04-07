using System;
using System.Collections.Generic;
using LibVLCSharp.Shared;
using Microsoft.Extensions.Logging;

namespace BalStreamer2.Caster.VLC
{
    public class ChromeCastHelper : IChromeCastHelper, IDisposable
    {
        private readonly LibVLC _libVLC;
        private readonly MediaPlayer _mediaPlayer;
        private readonly ILogger<ChromeCastHelper> _logger;

        public ChromeCastHelper(ILogger<ChromeCastHelper> logger)
        {
            // Load native libvlc library
            Core.Initialize();
            _libVLC = new LibVLC("--no-audio");
            _mediaPlayer = new MediaPlayer(_libVLC);
            _logger = logger;

            // Redirect log output to the console
            // _libVLC.Log += (sender, e) => _logger.LogInformation($"[{e.Level}] {e.Module}:{e.Message}");
        }

        public List<RendererItem> RendererItems { get; set; } = new List<RendererItem>();

        public void DiscoverChromecasts()
        {
            var rendererDiscoverer = new RendererDiscoverer(_libVLC);
            rendererDiscoverer.ItemAdded += RendererDiscoverer_ItemAdded;
            rendererDiscoverer.ItemDeleted += RendererDiscoverer_ItemDeleted;
            rendererDiscoverer.Start();
        }

        public bool StartCasting(Uri stream, RendererItem rendererItem)
        {
            _logger.LogInformation($"Starting cast with stream: {stream} on renderer {rendererItem.Name} or type {rendererItem.Type}");
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
            _logger.LogInformation($"New chromecast discovered: {e.RendererItem.Name} of type {e.RendererItem.Type}");

            if (e.RendererItem.CanRenderVideo)
                _logger.LogInformation("Can render video");
            if (e.RendererItem.CanRenderAudio)
                _logger.LogInformation("Can render audio");

            RendererItems.Add(e.RendererItem);
        }

        protected void RendererDiscoverer_ItemDeleted(object sender, RendererDiscovererItemDeletedEventArgs e)
        {
            _logger.LogInformation($"Chromecast {e.RendererItem.Name} of type {e.RendererItem.Type} cannot be found so removing");

            RendererItems.Remove(e.RendererItem);
        }

        public void Dispose()
        {
            _logger.LogInformation($"Stopping chromecast connection and disposing resources");
            _mediaPlayer.Stop();
            _libVLC.Dispose();
            _mediaPlayer.Dispose();
        }
    }
}
using LibVLCSharp.Shared;
using System;
using System.Collections.Generic;

namespace BalStreamer2.Caster.VLC
{
    public interface IChromeCastHelper
    {
        List<RendererItem> RendererItems { get; set; }

        void DiscoverChromecasts();

        void DiscoverChromecasts(Action<object, RendererDiscovererItemAddedEventArgs> chromecastFound, Action<object, RendererDiscovererItemDeletedEventArgs> chromecastLost);

        bool StartCasting(Uri stream, RendererItem rendererItem);

        void StopCasting();
    }
}

using System;
using System.Collections.Generic;
using LibVLCSharp.Shared;

namespace BalStreamer2.Caster.VLC
{
    public interface IChromeCastHelper
    {
        List<RendererItem> RendererItems { get; set; }

        void DiscoverChromecasts();

        bool StartCasting(Uri stream, RendererItem rendererItem);

        void StopCasting();
    }
}
Motif.Page.include("Motif.Ui.Controls.Swf.js");
Motif.Page.include("Motif.Ui.Utility.js");

/**
 * Youtube player, play youtube movies by id
 * @constructor
 * @extends Motif.Ui.Controls.Swf
 * @requires Motif.Ui.Controls.Swf
 * @requires Motif.Ui.Utility
 * @author Rayraegah
 */
Motif.Ui.Controls.YoutubePlayer = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Swf");
    this.__class.push("Motif.Ui.Controls.YoutubePlayer");

    this._video = "";

    /** Adds the swf object to the element and adds the specific evnts to it */
    this._appendSwf = function JwPlayer__appendSwf() {
        this.Motif$Ui$Controls$Swf._appendSwf();
        this._setSwfEvents();
    };

    /** Add the jwplayer specific events to the control */
    this._setSwfEvents = function() {
        if (typeof this.swf.addEventListener == "undefined") {
            window.setTimeout(this.referenceString() + "._setSwfEvents();", 100);
            return;
        }

        this.swf.addEventListener("onStateChange", this.referenceString() + "._handlers.state");
        this.swf.addEventListener("onError", this.referenceString() + "._handlers.error");
    };

    /** Load a video by ID */
    this.setVideo = function(video) {
        Motif.Page.log.write("Motif.Ui.Controls.YoutubePlayer.setVideo: Setting video to: '" + video + "'");
        this.swf.loadVideoById(video);
        this._video = video;
        this._isAutoplaying = true;

    };

    /** Get the loaded video id */
    this.getVideo = function() {
        return this._video;
    };

    /** Mute the player */
    this.mute = function() {
        Motif.Page.log.write("Motif.Ui.Controls.YoutubePlayer.mute: Muting player.");
        this.swf.mute();
    };

    /** Unmute the player */
    this.unmute = function() {
        Motif.Page.log.write("Motif.Ui.Controls.YoutubePlayer.unmute: Unmuting player.");
        this.swf.unMute();
    };

    /** Start playback */
    this.play = function() {
        Motif.Page.log.write("Motif.Ui.Controls.YoutubePlayer.setVideo: Starting playback.");
        this.swf.playVideo();
    };

    /** Start playback */
    this.pause = function() {
        Motif.Page.log.write("Motif.Ui.Controls.YoutubePlayer.setVideo: Pausing playback.");
        this.swf.pauseVideo();
    };

    /** Stop playback */
    this.stop = function() {
        Motif.Page.log.write("Motif.Ui.Controls.YoutubePlayer.setVideo: Stopping playback and clearing video.");
        this.swf.seekTo(0);
        setTimeout("var swf = " + this.referenceString() + ".swf; swf.stopVideo(); swf.clearVideo();", 25);
    };

    /** Goto a specific position in seconds */
    this.seek = function(position) {
        Motif.Page.log.write("Motif.Ui.Controls.YoutubePlayer.setVideo: Moving to position: '" + position + "'.");
        this.swf.seekTo(position);
    };

    /** Set the volume to te supplied percentage */
    this.setVolume = function(percentage) {
        Motif.Page.log.write("Motif.Ui.Controls.YoutubePlayer.setVolume: Setting volume to: '" + percentage + "'.");
        this.swf.setVolume(percentage);
    };

    /** Get the volume @type Number */
    this.getVolume = function(percentage) {
        Motif.Page.log.write("Motif.Ui.Controls.YoutubePlayer.setVolume: Getting the volume.");
        this.swf.getVolume();
    };

    /** Event fired when the YoutubePlayer's playback state changes (-1=unstarted,0=ended, 1=playing, 2=paused, 3=buffering, 5=cued) */
    this.onstatechange = function(newstate) {};

    /** Event fired when an error occurs (100=video mising, 101=not allowed in embedded players, 150=101)*/
    this.onerror = function(code) {};

    this._stateTracker = function(state) {
        if (this._isAutoplaying === true && state == 1) {
            this.swf.stopVideo();
            setTimeout(this.referenceString() + ".swf.clearVideo();", 5);
            this._isAutoplaying = false;
            return;
        }
        if (state == -1 || state == 5) {
            this.isPaused = false;
            this.isPlaying = false;
        }
        if (state == 1) {
            this.isPaused = false;
            this.isPlaying = true;
        }
        if (state == 2) {
            this.isPaused = true;
            this.isPlaying = false;
        }
    };

    /** @ignore */
    this.main = function YoutubePlayer_main(config) {
        this.src = "http://www.youtube.com/apiplayer?enablejsapi=1&loop=0&autoplay=0&rel=0&fs=0&showinfo=0&showsearch=0";

        this.attachEvent("onstatechange", this._stateTracker);
        if (config) {
            this.configure(config);
        }

        this._handlers = {
            control: this,
            state: function(newstate) {
                this.control.fireEvent("onstatechange", [newstate]);
            },
            error: function(code) {
                this.control.fireEvent("onerror", [code]);
            }
        };
    };
    this.main(config);
};
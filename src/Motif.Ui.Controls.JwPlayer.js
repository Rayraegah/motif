Motif.Page.include("Motif.Ui.Controls.Swf.js");
Motif.Page.include("Motif.Ui.Utility.js");

/**
 * JW Player, flash FLV player control
 * Used for the empty canvas of the player, playlist control buttons should be javascript objects.
 * A commercial license and full documentation can be obtained from: longtailvideo.com
 * @constructor
 * @extends Motif.Ui.Controls.Swf
 * @requires Motif.Ui.Controls.Swf
 * @requires Motif.Ui.Utility
 * @author Rayraegah
 */
Motif.Ui.Controls.JwPlayer = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Swf");
    this.__class.push("Motif.Ui.Controls.JwPlayer");

    /** Currently loaded video @type String */
    this._video = "";

    /** Indication whether the player is paused @type Boolean */
    this.isPaused = false;
    /** Indication whether the player is playing @type Boolean */
    this.isPlaying = false;
    /** Indication whether the player is muted @type Boolean */
    this.isMuted = false;

    /** Adds the swf object to the element and adds the specific evnts to it */
    this._appendSwf = function JwPlayer__appendSwf() {
        this.Motif$Ui$Controls$Swf._appendSwf();
        this._setSwfEvents();
    };

    /** Add the jwplayer specific events to the control */
    this._setSwfEvents = function JwPlayer__setSwfEvents() {
        if (typeof this.swf.addModelListener == "undefined" || typeof this.swf.addControllerListener == "undefined") {
            window.setTimeout(this.referenceString() + "._setSwfEvents();", 100);
            return;
        }

        this.swf.addModelListener("STATE", this.referenceString() + "._handlers.state");
        this.swf.addModelListener("ERROR", this.referenceString() + "._handlers.error");
        this.swf.addModelListener("LOADED", this.referenceString() + "._handlers.loaded");
        this.swf.addModelListener("BUFFER", this.referenceString() + "._handlers.buffer");
        this.swf.addModelListener("TIME", this.referenceString() + "._handlers.time");
    };

    /** Load a video */
    this.setVideo = function JwPlayer_setVideo(video) {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Setting video to: '" + video + "'");
        //LOAD, object
        this.execute("LOAD", video);
        this._video = video;
    };

    /** Get the currently loaded video @type String */
    this.getVideo = function JwPlayer_getVideo() {
        return this._video;
    };

    /** Muting player */
    this.mute = function JwPlayer_mute() {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Toggling mute.");
        //MUTE, state
        this.execute("MUTE", true);
        this.isMuted = true;
    };

    /** Unmuting player */
    this.unmute = function JwPlayer_unmute() {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Toggling mute.");
        //MUTE, state
        this.execute("MUTE", false);
        this.isMuted = false;
    };

    /** Play video */
    this.play = function JwPlayer_play() {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Playing video.");
        //PLAY, state
        this.execute("PLAY", true);
        this.isPaused = false;
        this.isPlaying = true;
    };

    /** Toggle play / pause */
    this.pause = function JwPlayer_pause() {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Pausing video.");
        //PLAY, state
        this.execute("PLAY", false);
        this.isPaused = true;
        this.isPlaying = false;
    };

    /** Stop playback */
    this.stop = function JwPlayer_stop() {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Stopping playback.");
        //STOP
        this.execute("STOP");
        this.isPaused = false;
        this.isPlaying = false;
    };

    /** Goto a specific position in seconds */
    this.seek = function JwPlayer_seek(position) {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Moving to position: '" + position + "'.");
        //SEEK, position
        this.execute("SEEK", position);
    };

    /** Set the volume to the specified percentage */
    this.setVolume = function JwPlayer_setVolume(percentage) {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Setting volume to: '" + percentage + "'.");
        //VOLUME, percentage
        this.execute("VOLUME", percentage);
    };

    /** Get the current volume @type Number */
    this.getVolume = function JwPlayer_getVolume() {
        var conf = this.swf.getConfig();
        return parseInt(conf.volume);
    };

    /** Redraw the player */
    this.redraw = function JwPlayer_redraw() {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Redrawing player.");
        //REDRAW
        this.execute("REDRAW");
    };

    /** Move to previous item in playlist */
    this.previous = function JwPlayer_previous() {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Going previous.");
        //PREV
        this.execute("PREV");
    };

    /** Move to next item in playlist */
    this.next = function JwPlayer_next() {
        Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Going next.");
        //NEXT
        this.execute("NEXT");
    };

    /** Set the player to fullscreen according to a specified state */
    this.fullscreen = function JwPlayer_fullscreen(state) {
        //FULLSCREEN, state
        this.execute("FULLSCREEN", state);
    };

    /** Failsafe send command to the SWF */
    this.execute = function JwPlayer_execute(command, value) {
        if (this.swf == null) {
            return;
        }
        this.swf.sendEvent(command, value);
    };

    /** Configure the JwPlayer control @type Object */
    this.configure = function JwPlayer_configure(config) {
        config = this.Motif$Ui$Controls$Swf.configure(config);
        if (config.video) {
            this.flashvars.video = config.video;
            this.setVideo(config.video);
        }
        if (config.mute) {
            this.flashvars.mute = config.mute;
            if (config.mute === true) {
                this.mute();
            } else {
                this.unmute();
            }
        }
        if (Motif.Type.isNumber(config.volume)) {
            this.flashvars.volume = config.volume;
            this.setVolume(config.volume);
        }
        return config;
    };

    /** Event fired when the jwplayer's playback state changes (IDLE, BUFFERING, PLAYING, PAUSED, COMPLETED) */
    this.onstatechange = function(oldstate, newstate) {};
    /** Event fired when a video is loaded by the jwplayer */
    this.onsetvideo = function(loaded, total, offset) {};
    /** Event fired when a playback error occurs. The player then automatically stops */
    this.onerror = function(message) {};
    /** Event fired when the playback buffer changes. The buffer indicates how long the player still has to load before starting playback. */
    this.onbuffer = function(percentage) {};
    /** Event fired when the playback position is changing (i.e. the videosound/image is playing). It is fired with a resolution of 1/10 second. */
    this.ontime = function(position, duration) {};

    /** @ignore */
    this.main = function JwPlayer_main(config) {
        this.src = Motif.Page.scriptLoader.path + "ext/jwplayer.swf";
        this.flashvars.controlbar = "none";
        this.flashvars.screencolor = "#FFFFFF";
        this.flashvars.displayclick = "none";
        this.flashvars.icons = "none";

        if (config) {
            this.configure(config);
        }

        this._handlers = {
            control: this,
            state: function(obj) {
                this.control.fireEvent("onstatechange", [obj.newstate, obj.oldstate]);
            },
            error: function(obj) {
                this.control.fireEvent("onerror", [obj.message]);
            },
            loaded: function(obj) {
                this.control.fireEvent("onsetvideo", [obj.loaded, obj.total, obj.offset]);
            },
            buffer: function(obj) {
                this.control.fireEvent("onbuffer", [obj.percentage]);
            },
            time: function(obj) {
                this.control.fireEvent("ontime", [obj.position, obj.duration]);
            }
        };
    };
    this.main(config);
};

/**
 * JW Player configuration object
 * @constructor
 * @author Rayraegah
 */
Motif.Ui.Controls.JwPlayerConfig = function() {
    /** Video resource location @type String */
    this.video = "";
    /** Mute state indication @type Boolean */
    this.mute = false;
    /** Player sound volume @type Number */
    this.volume = 100;
};
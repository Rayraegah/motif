Motif.Page.include("Motif.Ui.Controls.Swf.js"),Motif.Page.include("Motif.Ui.Utility.js"),Motif.Ui.Controls.JwPlayer=function(t){Motif.Utility.extend(this,"Motif.Ui.Controls.Swf"),this.__class.push("Motif.Ui.Controls.JwPlayer"),this._video="",this.isPaused=!1,this.isPlaying=!1,this.isMuted=!1,this._appendSwf=function(){this.Motif$Ui$Controls$Swf._appendSwf(),this._setSwfEvents()},this._setSwfEvents=function(){return"undefined"==typeof this.swf.addModelListener||"undefined"==typeof this.swf.addControllerListener?void window.setTimeout(this.referenceString()+"._setSwfEvents();",100):(this.swf.addModelListener("STATE",this.referenceString()+"._handlers.state"),this.swf.addModelListener("ERROR",this.referenceString()+"._handlers.error"),this.swf.addModelListener("LOADED",this.referenceString()+"._handlers.loaded"),this.swf.addModelListener("BUFFER",this.referenceString()+"._handlers.buffer"),void this.swf.addModelListener("TIME",this.referenceString()+"._handlers.time"))},this.setVideo=function(t){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Setting video to: '"+t+"'"),this.execute("LOAD",t),this._video=t},this.getVideo=function(){return this._video},this.mute=function(){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Toggling mute."),this.execute("MUTE",!0),this.isMuted=!0},this.unmute=function(){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Toggling mute."),this.execute("MUTE",!1),this.isMuted=!1},this.play=function(){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Playing video."),this.execute("PLAY",!0),this.isPaused=!1,this.isPlaying=!0},this.pause=function(){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Pausing video."),this.execute("PLAY",!1),this.isPaused=!0,this.isPlaying=!1},this.stop=function(){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Stopping playback."),this.execute("STOP"),this.isPaused=!1,this.isPlaying=!1},this.seek=function(t){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Moving to position: '"+t+"'."),this.execute("SEEK",t)},this.setVolume=function(t){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Setting volume to: '"+t+"'."),this.execute("VOLUME",t)},this.getVolume=function(){var t=this.swf.getConfig();return parseInt(t.volume)},this.redraw=function(){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Redrawing player."),this.execute("REDRAW")},this.previous=function(){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Going previous."),this.execute("PREV")},this.next=function(){Motif.Page.log.write("Motif.Ui.Controls.JwPlayer.setVideo: Going next."),this.execute("NEXT")},this.fullscreen=function(t){this.execute("FULLSCREEN",t)},this.execute=function(t,e){null!=this.swf&&this.swf.sendEvent(t,e)},this.configure=function(t){return t=this.Motif$Ui$Controls$Swf.configure(t),t.video&&(this.flashvars.video=t.video,this.setVideo(t.video)),t.mute&&(this.flashvars.mute=t.mute,t.mute===!0?this.mute():this.unmute()),Motif.Type.isNumber(t.volume)&&(this.flashvars.volume=t.volume,this.setVolume(t.volume)),t},this.onstatechange=function(t,e){},this.onsetvideo=function(t,e,i){},this.onerror=function(t){},this.onbuffer=function(t){},this.ontime=function(t,e){},this.main=function(t){this.src=Motif.Page.scriptLoader.path+"ext/jwplayer.swf",this.flashvars.controlbar="none",this.flashvars.screencolor="#FFFFFF",this.flashvars.displayclick="none",this.flashvars.icons="none",t&&this.configure(t),this._handlers={control:this,state:function(t){this.control.fireEvent("onstatechange",[t.newstate,t.oldstate])},error:function(t){this.control.fireEvent("onerror",[t.message])},loaded:function(t){this.control.fireEvent("onsetvideo",[t.loaded,t.total,t.offset])},buffer:function(t){this.control.fireEvent("onbuffer",[t.percentage])},time:function(t){this.control.fireEvent("ontime",[t.position,t.duration])}}},this.main(t)},Motif.Ui.Controls.JwPlayerConfig=function(){this.video="",this.mute=!1,this.volume=100};
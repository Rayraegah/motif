Motif.Ui.Controls.Image=function(t){this.inheritFrom=Motif.Ui.Controls.Control,this.inheritFrom(),this.__class.push("Motif.Ui.Controls.Image"),this.getUrl=function(){return this._image.src},this.setUrl=function(t){this._image.src=t},this.getAlignment=function(){return this._image.align},this.setAlignment=function(t){this._image.align=t},this._setElementImage=function(){Motif.Utility.attachEvent(this.element,"onload",new Function(this.referenceString()+'.fireEvent("onload");'))},this._configureImage=function(t){t&&(t.src&&this.setUrl(t.src),t.url&&this.setUrl(t.url))},this.onload=function(){},this.main=function(t){this.attachEvent("onsetelement",this._setElementImage),this.attachEvent("onconfigure",this._configureImage),this.setElement(document.createElement("img")),this.configure(t)},this.main(t)};
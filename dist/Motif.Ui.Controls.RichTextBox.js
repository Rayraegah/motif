Motif.Page.include("Motif.Ui.Controls.WebBrowser.js"),Motif.Page.include("Motif.Ui.Controls.RichTextCommands.js"),Motif.Page.include("Motif.Ui.Xhtml.EmptyElements.js"),Motif.Page.include("Motif.Dom.Selection.js"),Motif.Ui.Controls.RichTextBox=function(t){Motif.Utility.extend(this,"Motif.Ui.Controls.WebBrowser"),this.__class.push("Motif.Ui.Controls.RichTextBox"),this.textarea=null,this.lastSelection=null,this.execute=function(t,e){if(this.isReady&&this.fireEvent("onbeforeexecute",[t,e])!==!0){t in Motif.Ui.Controls.RichTextCommands&&Motif.Ui.Controls.RichTextCommands[t].parameter===!0&&"undefined"==typeof e&&(e=prompt());var i=!1;"ToggleSource"==t?this.toggleSource():(i=this.document.execCommand(t,!1,e),this.document.body.focus()),i&&(this.fireEvent("onchange"),this.fireEvent("onexecute",[t,e]))}},this.toggleSource=function(){"none"==this.textarea.style.display?(this.iframe.style.display="none",this.textarea.style.display="block",this.textarea.value=this.getXhtml()):(this.textarea.style.display="none",this.iframe.style.display="block",this.document.body.innerHTML=this.textarea.value)},this.setElement=function(t){Motif.Page.log.write("Motif.Ui.Controls.RichTextBox.setElement: Setting the element and invoking enableEdit."),this.Motif$Ui$Controls$WebBrowser.setElement(t),this.element.appendChild(this.textarea),setTimeout(this.referenceString()+".enableEdit();",500)},this._blur=function(){this.lastSelection=this.getSelection()},this.onbeforeexecute=function(t,e){return!1},this.onexecute=function(t,e){},this.onchange=function(){},this.onrichtextboxready=function(){},this.main=function(t){this.textarea=document.createElement("textarea"),this.textarea.style.border=this.textarea.style.display="none",this.textarea.style.width=this.textarea.style.height="100%",this.attachEvent("onblur",this._blur),t&&this.configure(t)},this.main(t)};
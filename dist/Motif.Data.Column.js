Motif.Page.include("Motif.Data.ColumnCollection.js"),Motif.Data.Column=function(t){Motif.Utility.extend(this,"Motif.Object"),this.__class.push("Motif.Data.Column"),this.parent=null,this.ordinal=-1,this.name="",this.label="",this.description="",this.datatype="varchar",this.value=null,this["default"]=null,this.configure=function(t){return t=this.Motif$Object.configure(t),t.parent&&(this.parent=t.parent),Motif.Type.isNumber(t.ordinal)&&(this.ordinal=t.ordinal),t.name&&(this.name=t.name),t.label&&(this.label=t.label),t.description&&(this.description=t.description),t.datatype&&(this.datatype=t.datatype),t.value&&(this.value=t.value),t["default"]&&(this["default"]=t["default"]),t},this.main=function(t){t&&this.configure(t)},this.main(t)},Motif.Data.ColumnConfig=function(){this.parent=null,this.ordinal=-1,this.name="",this.label="",this.description="",this.datatype="",this.value=null};
Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Utility.js");

Motif.Ui.Controls.InputBoxIp4 = function() {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.InputBoxIp4");

    this.inputs = {
        a: null,
        b: null,
        c: null,
        d: null
    };

    this.createElement = function() {
        var table = document.createElement("table");
        var tr = table.appendChild(document.createElement("tbody")).appendChild(document.createElement("tr"))
        for (e in this.inputs) {
            var td = tr.appendChild(document.createElement("td"));
            this.inputs[e] = document.createElement("input");
            this.inputs[e].type = "text";
            this.inputs[e].style.width = "100%";
            this.inputs[e].style.textAlign = "center";
            this.inputs[e].setAttribute("maxlength", "3");
            this.inputs[e].onkeyup = function() {
                alert(Motif.Ui.Utility.getCarretPosition(this));
            };
            td.appendChild(this.inputs[e]);
        };
        return table;
    };

    this.onbeforeconfigure_inputboxip4 = function(config) {
        if (!Motif.Type.isElement(config.element) || config.element.tagName.toLowerCase() != "table") {
            Motif.Page.log.write("Motif.Ui.Controls.InputBoxIp4.onbeforeconfigure_inputboxip4: Replacing config.element with new table element.");
            var table = this.createElement();
            Motif.Ui.Utility.copyAttributes(config.element, table);
            config.element.parentNode.replaceChild(table, config.element);
            config.element = table;
        }
    };

    this.main = function() {
        var table = this.createElement();
        this.attachEvent("onbeforeconfigure", this.onbeforeconfigure_inputboxip4);
        this.configure({
            element: table
        });
    };
    this.main();
}
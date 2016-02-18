Motif.Page.include("Motif.Collections.List.js");

Motif.Ui.Xhtml.Table = function() {
    /** @ignore */
    this.inheritFrom = Motif.Object;
    this.inheritFrom();

    this.element = null;
    this._tbody = null;

    this.addRow = function() {
        var row = document.createElement("tr");
        this.fireEvent("onbeforeaddrow", [row]);
        this._tbody.appendChild(row);
        this.fireEvent("onaddrow", [row]);
        return row;
    };

    this.insertRow = function(index) {
        var currentRow = this.getRow(index);
        var row = document.createElement("tr");
        this.fireEvent("onbeforeinsertrow", [row]);
        this._tbody.insertBefore(row, currentRow);
        this.fireEvent("oninsertrow", [row]);
        return row;
    };

    this.removeRow = function(index) {
        var row = this.getRow(index);
        this.fireEvent("onbeforeremoverow", [row]);
        this._tbody.removeChild(row);
        this.fireEvent("onremoverow", [row]);
    };

    this.rowExists = function(index) {
        var rows = this.getRows();
        return index > -1 && index < rows.length;
    };

    this.getRow = function(index) {
        var rows = this.getRows();
        if (index < 0 && index >= rows.length) {
            throw new Error("Motif.Ui.Elements.HtmlTable.getRow: Index out of range.");
        }
        return rows[index];
    };

    this.getRows = function() {
        var rows = this._tbody.getElementsByTagName("tr");
        var ret = [];
        for (var i = 0; i < rows.length; i++) {
            ret.push(rows[i]);
        }
        return ret;
    };

    this.addCell = function(rowIndex) {
        var row = this.getRow(rowIndex);
        var cell = document.createElement("td");
        this.fireEvent("onbeforeaddcell", [cell]);
        row.appendChild(cell);
        this.fireEvent("onaddcell", [cell]);
        return cell;
    };

    this.insertCell = function(rowIndex, index) {
        var row = this.getRow(rowIndex);
        var currentCell = this.getCell(rowIndex, index);
        var cell = document.createElement("td");
        this.fireEvent("onbeforeinsertcell", [cell]);
        row.insertBefore(cell, currentCell);
        this.fireEvent("oninsertcell", [row]);
        return cell;
    };

    this.removeCell = function(rowIndex, index) {
        var row = this.getRow(rowIndex);
        var cell = this.getCell(rowIndex, index);
        this.fireEvent("onbeforeremovecell", [cell]);
        row.removeChild(cell);
        this.fireEvent("onremoverow", [row]);
    };

    this.cellExists = function(rowIndex, index) {
        var cells = this.getCells(rowIndex);
        return index > -1 && index < cells.length;
    };

    this.getCell = function(rowIndex, index) {
        var cells = this.getCells(rowIndex);
        if (index < 0 && index >= cells.length) {
            throw new Error("Motif.Ui.Elements.HtmlTable.getCell: Index out of range.");
        }
        return cells[index];
    };

    this.getCells = function(rowIndex) {
        var ret = [];
        var row = this.getRow(rowIndex);
        if (row)
            for (var i = 0; i < row.childNodes; i++)
                if (row.childNodes[i].nodeType == 1 && row.childNodes[i].nodeName.toLowerCase() == "td")
                    ret.push(row.childNodes[i]);

        return ret;
    };

    this.sort = function(cellIndex) {
        var rowsSort = this.getRows();
        var fnString = "var a1 = a && a.getElementsByTagName && a.getElementsByTagName('td')[" + cellIndex + "]? a.getElementsByTagName('td')[" + cellIndex + "].innerHTML: '';" + "var b1 = b && b.getElementsByTagName && b.getElementsByTagName('td')[" + cellIndex + "]? b.getElementsByTagName('td')[" + cellIndex + "].innerHTML: '';" + "if(a1 < b1){return -1;}" + "if(a1 > b1){return 1;}" + "return 0;"
        var fn = new Function("a", "b", fnString);

        Motif.Page.log.write("Motif.Ui.Elements.HtmlTable.sort: Sorting rows (" + this.getRows().length + ") with '" + fnString + "'.");

        rowsSort.sort(fn);

        while (this._tbody.childNodes.length > 0) {
            this._tbody.removeChild(this._tbody.childNodes[0]);
        }
        for (var i = 0; i < rowsSort.length; i++) {
            this._tbody.appendChild(rowsSort[i]);
        }
    };

    this.setElement = function(element) {
        if (!Motif.Type.isElement(element)) {
            throw new Error("Motif.Ui.Elements.HtmlTable.setElement: Wrong parameter type, HtmlElement expected.");
        }
        if (element.tagName.toLowerCase() != "table") {
            throw new Error("Motif.Ui.Elements.HtmlTable.setElement: Wrong element type '" + element.tagName + "'");
        }

        if (element.getElementsByTagName("tbody").length == 0) {
            element.appendChild(document.createElement("tbody"));
        }
        this.element = element;
        this._tbody = element.getElementsByTagName("tbody")[0];
    };

    this.load = function(element) {
        Motif.Page.log.write("Motif.Ui.Elements.HtmlTable.load: Loading element from document.");
        this.element = element;
    };

    this.onbeforeaddrow = function() {};
    this.onaddrow = function() {};
    this.onbeforeinsertrow = function() {};
    this.oninsertrow = function() {};
    this.onbeforedeleterow = function() {};
    this.ondeleterow = function() {};
    this.onbeforeaddcell = function() {};
    this.onaddcell = function() {};
    this.onbeforeinsertcell = function() {};
    this.oninsertcell = function() {};
    this.onbeforedeletecell = function() {};
    this.ondeletecell = function() {};

    this.main = function() {
        this.element = document.createElement("table");
        this._tbody = this.table.appendChild(document.createElement("tbody"))
    };
};
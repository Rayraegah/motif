Motif.Page.include("Motif.Ui.Controls.Control.js");
Motif.Page.include("Motif.Ui.Css.js");
Motif.Page.include("Javascript.Prototype.Date.js");
Motif.Page.include("Motif.Dom.Utility.js");

/** 
 * Date selection control
 * @extends Motif.Ui.Controls.Control
 * @requires Motif.Ui.Controls.Control
 * @requires Motif.Ui.Css
 * @requires Motif.Dom.Utility
 * @requires Date
 * @author Rayraegah
 * @constructor
 */
Motif.Ui.Controls.DatePicker = function(config) {
    /** @ignore */
    Motif.Utility.extend(this, "Motif.Ui.Controls.Control");
    this.__class.push("Motif.Ui.Controls.DatePicker");

    /** The year value of this control @type Number */
    this.year = 1;
    /** The month value of this control @type Number */
    this.month = 1;
    /** The date value of this control @type Number */
    this.date = 1;

    /** List of cells per row and their labels @type Object */
    this.row = {
        week: {
            char: "",
            title: "Week"
        },
        sunday: {
            char: "Su",
            title: "Sunday"
        },
        monday: {
            char: "Mo",
            title: "Monday"
        },
        tuesday: {
            char: "Tu",
            title: "Tuesday"
        },
        wednesday: {
            char: "We",
            title: "Wednesday"
        },
        thursday: {
            char: "Th",
            title: "Thursday"
        },
        friday: {
            char: "Fr",
            title: "Friday"
        },
        saturday: {
            char: "Sa",
            title: "Saturday"
        }

    };

    /** Set the value of this control by specifying a Date object */
    this.setValue = function DatePicker_setValue(date) {
        this.setYear(date.getFullYear());
        this.setMonth(date.getMonth() + 1);
        this.setDate(date.getDate());
    };

    /** Get the value of this control @type Date */
    this.getValue = function DatePicker_getValue() {
        return new Date(this.year, this.month - 1, this.date);
    };

    /** Set the year value of this control */
    this.setYear = function DatePicker_setYear(year) {
        year = parseInt(year);
        if (isNaN(year)) {
            throw new Error("Motif.Ui.Controls.DatePicker.setYear: Incorrect parameter specified.");
        }
        if (this.year === year) {
            return;
        }

        var old = new Date(this.year, this.month - 1, this.date);
        old.setFullYear(year);
        year = old.getFullYear();

        this.fireEvent("onbeforeyearchange", [year, this.year]);
        this.year = old.getFullYear();
        this.refresh();
        this.fireEvent("onyearchange", [this.year]);
    };

    /** Get the year value of this control @type Number */
    this.getYear = function DatePicker_getYear() {
        return this.year;
    };

    /** Set the month value of this control */
    this.setMonth = function DatePicker_setMonth(month) {
        month = parseInt(month);
        if (isNaN(month)) {
            throw new Error("Motif.Ui.Controls.DatePicker.setMonth: Incorrect parameter specified.");
        }
        if (this.month === month) {
            return;
        }

        var old = new Date(this.year, this.month - 1, this.date);
        old.setMonth(month - 1);
        if (this.year !== old.getFullYear()) {
            this.setYear(old.getFullYear());
        }
        month = old.getMonth() + 1;

        this.fireEvent("onbeforemonthchange", [month, this.month]);
        this.month = month;
        this.refresh();
        var td1 = Motif.Dom.Utility.getElementsByClassName(this.element, "MonthYear")[0];
        if (td1) {
            td1.innerHTML = this.month.toString() + " / " + this.year.toString();
        }
        this.fireEvent("onmonthchange", [this.month]);
    };

    /** Get the month value of this control @type Number */
    this.getMonth = function DatePicker_getMonth() {
        return this.month;
    };

    /** Set the date value of this control */
    this.setDate = function DatePicker_setDate(day) {
        day = parseInt(day);
        if (isNaN(day)) {
            throw new Error("Motif.Ui.Controls.DatePicker.setDate: Incorrect parameter specified.");
        }
        if (this.date === day) {
            return;
        }

        var old = new Date(this.year, this.month - 1, this.date);
        old.setDate(day);
        if (this.year !== old.getFullYear()) {
            this.setYear(old.getFullYear());
        }
        if (this.month !== old.getMonth() + 1) {
            this.setMonth(old.getMonth() + 1);
        }
        day = old.getDate();

        this.fireEvent("onbeforedatechange", [this.date, day]);

        var td = Motif.Dom.Utility.getElementsByClassName(this.element, "Selected")[0];
        if (td) {
            Motif.Ui.Css.removeClassName(td, "Selected");
        }

        this.date = day;

        td = this._getCellByDay(this.date);
        if (td) {
            Motif.Ui.Css.addClassName(td, "Selected");
        }

        this.fireEvent("ondatechange", [this.date]);
    };

    /** Get the date value of this control @type Number */
    this.getDate = function DatePicker_getDate() {
        return this.date;
    };

    /** Set the element value of this control, HTMLTable is expected or it will be replaced with the default element @type HTMLTable */
    this.setElement = function DatePicker_setElement(element) {
        if (element.tagName.toLowerCase() != "table") {
            newElement = this.createElement();
            if (element.parentNode != null) {
                element.parentNode.replaceChild(newElement, element);
            }
            element = newElement;

        }
        this.Motif$Ui$Controls$Control.setElement(element);
        this.setValue(new Date());
        this.refresh();

        var td1 = Motif.Dom.Utility.getElementsByClassName(this.element, "PreviousMonth")[0];
        if (td1) {
            Motif.Utility.attachEvent(td1, "onclick", new Function(this.referenceString() + ".previousMonth();"));
        }

        var td2 = Motif.Dom.Utility.getElementsByClassName(this.element, "NextMonth")[0];
        if (td2) {
            Motif.Utility.attachEvent(td2, "onclick", new Function(this.referenceString() + ".nextMonth();"));
        }

        return element;
    };

    /** Get the default element for this control @type HTMLTable */
    this.createElement = function() {
        var table = document.createElement("table");
        var tbody = table.appendChild(document.createElement("tbody"));
        var tr1 = tbody.appendChild(document.createElement("tr"));
        for (e in this.row) {
            var td = tr1.appendChild(document.createElement("td"));
            td.className = "Cell";

            td.style.height = "1px";
            td.style.paddingTop = "0px";
            td.style.paddingBottom = "0px";
        }
        var tr2 = tbody.appendChild(document.createElement("tr"));
        var td = tr2.appendChild(document.createElement("td"));
        td.className = "PreviousMonth";

        td = tr2.appendChild(document.createElement("td"));
        td.className = "MonthYear";
        td.colSpan = 6;

        td = tr2.appendChild(document.createElement("td"));
        td.className = "NextMonth";

        var tr3 = tbody.appendChild(document.createElement("tr"));
        for (e in this.row) {
            var td = tr3.appendChild(document.createElement("td"));
            td.className = "Cell";
            td.innerHTML = this.row[e].char;
            td.title = this.row[e].title;
        }

        for (var i = 0; i < 6; i++) {
            var tr = tbody.appendChild(document.createElement("tr"));
            for (e in this.row) {
                var td = tr.appendChild(document.createElement("td"));
                td.className = "Cell";
                Motif.Ui.Css.addClassName(td, e == "week" ? "Week" : "Day");

            }
        }
        return table;
    };

    /** Refresh the date grid */
    this.refresh = function(date) {
        date = date ? date : this.value;

        var firstDay = new Date(this.year, this.month - 1, 1);
        var firstWeek = firstDay.getWeek();
        var dayStart = firstDay.getDay();
        var dayCount = firstDay.getDaysInMonth();
        var current = new Date();
        var write = false;
        var count = 0;

        var trs = this.element.getElementsByTagName("tr");

        for (var i = trs.length - 6; i < trs.length; i++) {
            var tds = trs[i].getElementsByTagName("td");
            for (var j = 0; j < tds.length; j++) {
                tds[j].innerHTML = "";
            }
            tds[0].innerHTML = (firstWeek - 2 + i).toString();

            for (var j = 1; j < 8; j++) {
                tds[j].onclick = null;
                tds[j].className = "Cell Day";
                if (i == trs.length - 6 && j > dayStart) {
                    write = true;
                }
                if (write === true && count < dayCount) {
                    count++;
                    tds[j].innerHTML = count.toString();
                    if (current.getFullYear() === this.year && current.getMonth() + 1 === this.month && current.getDate() === count) {
                        Motif.Ui.Css.addClassName(tds[j], "ToDay");
                    }

                    if (count === this.date) {
                        Motif.Ui.Css.addClassName(tds[j], "Selected");
                    }
                    tds[j].onclick = new Function(this.referenceString() + ".setDate(" + count.toString() + ");");
                }
            }
        }
    };

    /** Set the previous month depending on the current month property value */
    this.previousMonth = function DatePicker_previousMonth() {
        this.setMonth(this.getMonth() - 1);
    };

    /** Set the next month depending on the current month property value */
    this.nextMonth = function DatePicker_nextMonth() {
        this.setMonth(this.getMonth() + 1);
    };

    /** Get the table data cell which innerHTML property matches the day parameter @type HTMLTd */
    this._getCellByDay = function(day) {
        var tds = Motif.Dom.Utility.getElementsByClassName(this.element, "Day");
        for (var i = 0; i < tds.length; i++) {
            if (parseInt(tds[i].innerHTML) === day) {
                return tds[i];
            }
        }
        return null;
    };

    /** Get the object values in string format @type String */
    this.toString = function() {
        return [this.month, this.date, this.year].join("/");
    };

    /** Event fired before a year change takes place */
    this.onbeforeyearchange = function(newYear, oldYear) {};
    /** Event fired when a year change takes place */
    this.onyearchange = function(newYear) {};
    /** Event fired before a month change takes place */
    this.onbeforemonthchange = function(newMonth, oldMonth) {};
    /** Event fired when a month change takes place */
    this.onmonthchange = function(newYear) {};
    /** Event fired before a date change takes place */
    this.onbeforedatechange = function(newDate, oldDate) {};
    /** Event fired when a date change takes place */
    this.ondatechange = function(newDate) {};

    /** @ignore */
    this.main = function(config) {
        if (config) {
            this.configure(config);
        }
    };
    this.main(config);
};
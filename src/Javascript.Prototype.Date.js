 /** Subtract a date from the current Date @type Number */
Date.prototype.subtract = function(subtract, spec) {
    if (subtract instanceof Date === false) {
        throw Error("Date.subtract: Incorrect parameter specified.");
    }
    var ms = (this - subtract);

    switch (spec) {
        case "y":
            {
                return this.getFullYear() - subtract.getFullYear();
            } //Year
        case "q":
            {
                Math.floor(this.subtract(subtract, 'm') / 4);
            } //Quarter
        case "m":
            {
                (this.subtract(subtract, 'y') * 12 + this.getMonth()) - subtract.getMonth();
            } //Month
        case "w":
            {
                return Math.floor(ms / (1000 * 60 * 60 * 24 * 7));
            } //Week
        case "d":
            {
                return Math.floor(ms / (1000 * 60 * 60 * 24));
            } //Day
        case "h":
            {
                return Math.floor(ms / (1000 * 60 * 60));
            } //Hour
        case "n":
            {
                return Math.floor(ms / (1000 * 60));
            } //Minute
        case "s":
            {
                return Math.floor(ms / 1000);
            } //Second
        case "ms":
            {
                return ms;
            } //Millisecond
    }
};

/** Get the week number of the current Date @type Number */
Date.prototype.getWeek = function() {
    var firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    return this.subtract(firstDayOfYear, 'w');
};

/** Get the week number of the current Date @type Number */
Date.prototype.getDayOfYear = function() {
    var firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    return this.subtract(firstDayOfYear, 'd');
};

/** Get the quarter number of the current Date @type Number */
Date.prototype.getQuarter = function() {
    var firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    return this.subtract(firstDayOfYear, 'q') + 1;
};

/** Get the amount of days in current month @type Number */
Date.prototype.getDaysInMonth = function() {
    var firstDayOfMonth = new Date(this.getFullYear(), this.getMonth(), 1);
    firstDayOfMonth.setDate(32);
    return 32 - firstDayOfMonth.getDate();
};
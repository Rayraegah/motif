Motif.Page.include("Motif.Ui.Controls.Window.js");

/**
 * Manager utility supplies activation modes for windows
 * @singleton
 * @requires Motif.Ui.Controls.Window
 * @author Rayraegah
 */
Motif.Ui.Controls.WindowManager = {
    /** Current active window on the document @type Motif.Ui.Controls.Window */
    activeWindow: null,
    /** Activate the supplied window */
    activate: function(win) {
        if (win === Motif.Ui.Controls.WindowManager.activeWindow) {
            return;
        }
        Motif.Page.log.write("Motif.Ui.Controls.WindowManager.activate: New active window, ptr:" + win.ptr.toString());

        if (Motif.Ui.Controls.WindowManager.activeWindow != null)
            Motif.Ui.Controls.WindowManager.activeWindow._deactivate();

        Motif.Ui.Controls.WindowManager.activeWindow = win;
    }
};
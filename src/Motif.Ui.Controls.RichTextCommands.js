/**
 * RichTextBox commands list enlist a range of possible commands which can be executed on a RichTextBox.
 * The commands are defined as objects by name with an indication whether the command requires a parameter.
 * @singleton
 * @author Rayraegah
 */
Motif.Ui.Controls.RichTextCommands = {
    BackColor: {
        name: "BackColor",
        parameter: false
    },
    Bold: {
        name: "Bold",
        parameter: false
    },
    Copy: {
        name: "Copy",
        parameter: false
    },
    CreateBookmark: {
        name: "CreateBookmark",
        parameter: true
    },
    CreateLink: {
        name: "CreateLink",
        parameter: true
    },
    Cut: {
        name: "Cut",
        parameter: false
    },
    Delete: {
        name: "Delete",
        parameter: false
    },
    FontName: {
        name: "FontName",
        parameter: true
    },
    FontSize: {
        name: "FontSize",
        parameter: true
    },
    ForeColor: {
        name: "FontColor",
        parameter: true
    },
    Find: {
        name: "Find",
        parameter: true
    },
    Indent: {
        name: "Indent",
        parameter: false
    },
    InsertFieldset: {
        name: "InsertFieldset",
        parameter: false
    },
    InsertButton: {
        name: "InsertButton",
        parameter: false
    },
    InsertHorizontalRule: {
        name: "InsertHorizontalRule",
        parameter: false
    },
    InsertImage: {
        name: "InsertImage",
        parameter: true
    },
    InsertInputButton: {
        name: "InsertInputButton",
        parameter: false
    },
    InsertInputCheckbox: {
        name: "InsertInputCheckbox",
        parameter: false
    },
    InsertInputFileUpload: {
        name: "InsertInputFileUpload",
        parameter: false
    },
    InsertInputHidden: {
        name: "InsertInputHidden",
        parameter: false
    },
    InsertInputImage: {
        name: "InsertInputImage",
        parameter: false
    },
    InsertInputPassword: {
        name: "InsertInputPassword",
        parameter: false
    },
    InsertInputRadio: {
        name: "InsertInputRadio",
        parameter: false
    },
    InsertInputReset: {
        name: "InsertInputReset",
        parameter: false
    },
    InsertInputSubmit: {
        name: "InsertInputSubmit",
        parameter: false
    },
    InsertInputText: {
        name: "InsertInputText",
        parameter: false
    },
    InsertMarquee: {
        name: "InsertMarquee",
        parameter: false
    },
    InsertOrderedList: {
        name: "InsertOrderedList",
        parameter: false
    },
    InsertParagraph: {
        name: "InsertParagraph",
        parameter: false
    },
    InsertSelectDropdown: {
        name: "InsertSelectDropdown",
        parameter: false
    },
    InsertSelectListbox: {
        name: "InsertSelectListbox",
        parameter: false
    },
    InsertTextArea: {
        name: "InsertTextArea",
        parameter: false
    },
    InsertUnorderedList: {
        name: "InsertUnorderedList",
        parameter: false
    },
    Italic: {
        name: "Italic",
        parameter: false
    },
    JustifyCenter: {
        name: "JustifyCenter",
        parameter: false
    },
    JustifyLeft: {
        name: "JustifyLeft",
        parameter: false
    },
    JustifyRight: {
        name: "JustifyRight",
        parameter: false
    },
    Outdent: {
        name: "Outdent",
        parameter: false
    },
    Paste: {
        name: "Paste",
        parameter: false
    },
    Print: {
        name: "Print",
        parameter: false
    },
    Refresh: {
        name: "Refresh",
        parameter: false
    },
    RemoveFormat: {
        name: "RemoveFormat",
        parameter: false
    },
    SaveAs: {
        name: "SaveAs",
        parameter: false
    },
    SelectAll: {
        name: "SelectAll",
        parameter: false
    },
    Subscript: {
        name: "Subscript",
        parameter: false
    },
    Superscript: {
        name: "Superscript",
        parameter: false
    },
    ToggleSource: {
        name: "ToggleSource",
        parameter: false
    },
    UnBookmark: {
        name: "UnBookmark",
        parameter: false
    },
    Underline: {
        name: "Underline",
        parameter: false
    },
    Undo: {
        name: "Undo",
        parameter: false
    },
    Unlink: {
        name: "Unlink",
        parameter: false
    },
    UnSelect: {
        name: "UnSelect",
        parameter: false
    }
};
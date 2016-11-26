window.EditorR = ace.edit("right-editor");
window.EditorL = ace.edit("left-editor");
EditorR.setTheme("ace/theme/monokai");
EditorL.setTheme("ace/theme/monokai");
EditorR.getSession().setMode("ace/mode/javascript");
EditorL.getSession().setMode("ace/mode/javascript");
EditorL.setShowPrintMargin(false);
EditorR.setShowPrintMargin(false);
EditorL.renderer.setShowGutter(false);
EditorR.renderer.setShowGutter(false);
EditorL.setHighlightActiveLine(false);
EditorR.setHighlightActiveLine(false);
EditorR.$blockScrolling = Infinity
EditorL.$blockScrolling = Infinity

// This code was adapted from
// https://github.com/markdown-it/markdown-it-footnote

function _footnote_tag(tokens, idx) {
  return '<span data-type="footnote">'+tokens[idx].meta.label+'</span>';
}

module.exports = function sub_plugin(md) {
  var parseLinkLabel = md.helpers.parseLinkLabel,
      isSpace = md.utils.isSpace;

  md.renderer.rules.footnote_ref          = _footnote_tag;

  // Process inline footnotes (^[...])
  function footnote_inline(state, silent) {

    var max = state.posMax;
    var start = state.pos;

    if (start + 2 >= max) { return false; }
    if (state.src.charCodeAt(start) !== 0x5E/* ^ */) { return false; }
    if (state.src.charCodeAt(start + 1) !== 0x5B/* [ */) { return false; }

    var labelStart = start + 2;
    var labelEnd = parseLinkLabel(state, start + 1);

    // parser failed to find ']', so it's not a valid note
    if (labelEnd < 0) { return false; }

    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    if (!silent) {
      var label = md.renderInline(state.src.slice(labelStart, labelEnd));
      var token = state.push('footnote_ref', '', 0);
      token.meta = { label: label };
    }

    state.pos = labelEnd + 1;
    state.posMax = max;
    return true;
  }

  md.inline.ruler.after('image', 'footnote_inline', footnote_inline);
};

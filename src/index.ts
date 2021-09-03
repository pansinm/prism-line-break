import { ResizeObserver } from "resize-observer";

const layout = (code: HTMLElement) => {
  // line number
  const numbers = code.querySelectorAll(".line-numbers-rows > span") || [];
  if (!numbers?.length) {
    return;
  }
  const lineHeight = numbers[0].getBoundingClientRect().height;
  let lineNumber = 1;
  const range = document.createRange();
  range.selectNode(code);
  let prevTop = range.getBoundingClientRect().top;
  code.childNodes.forEach((node) => {
    // text node
    if (node.nodeType == 3) {
      const text = node.textContent || "";
      let index = text.indexOf("\n");
      while (index > -1) {
        range.setStart(node, index);
        range.setEnd(node, index + 1);
        const top = range.getBoundingClientRect().bottom;
        const lines = Math.round((top - prevTop) / lineHeight);
        const span = numbers[lineNumber - 1] as HTMLElement;
        if (lines - 1) {
          span.style.marginBottom = (lines - 1) * lineHeight + "px";
        }
        prevTop = top;
        lineNumber++;
        index = text.indexOf("\n", index + 1);
      }
    }
  });
};

const lineBreak = (code: HTMLElement) => {
  let lineBreak = code.style.lineBreak;
  let whiteSpace = code.style.whiteSpace;
  code.style.wordBreak = "break-all";
  code.style.whiteSpace = "pre-wrap";
  const ro = new ResizeObserver(() => {
    layout(code);
  });
  ro.observe(code);
  return () => {
    code.style.lineBreak = lineBreak;
    code.style.whiteSpace = whiteSpace;
    ro.disconnect();
  };
};

export default lineBreak;

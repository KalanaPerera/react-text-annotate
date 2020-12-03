import sortBy from 'lodash.sortby'

export const splitWithOffsets = (text, offsets: {start: number; end: number}[]) => {
  let lastEnd = 0
  const splits = []

  for (let offset of sortBy(offsets, o => o.start)) {
    const {start, end} = offset
    if (lastEnd < start) {
      splits.push({
        start: lastEnd,
        end: start,
        content: text.slice(lastEnd, start),
      })
    }
    splits.push({
      ...offset,
      mark: true,
      content: text.slice(start, end),
    })
    lastEnd = end
  }
  if (lastEnd < text.length) {
    splits.push({
      start: lastEnd,
      end: text.length,
      content: text.slice(lastEnd, text.length),
    })
  }

  return splits
}

export const splitTokensWithOffsets = (text, offsets: {start: number; end: number}[]) => {
  let lastEnd = 0
  const splits = []

  for (let offset of sortBy(offsets, o => o.start)) {
    const {start, end} = offset
    if (lastEnd < start) {
      for (let i = lastEnd; i < start; i++) {
        splits.push({
          i,
          content: text[i],
        })
      }
    }
    splits.push({
      ...offset,
      mark: true,
      content: text.slice(start, end).join(' '),
    })
    lastEnd = end
  }

  for (let i = lastEnd; i < text.length; i++) {
    splits.push({
      i,
      content: text[i],
    })
  }

  return splits
}

export const selectionIsEmpty = (selection: Selection) => {
  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode)

  return position === 0 && selection.focusOffset === selection.anchorOffset
}

export const selectionIsBackwards = (selection: Selection) => {
  if (selectionIsEmpty(selection)) return false

  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode)

  let backward = false
  if (
    (!position && selection.anchorOffset > selection.focusOffset) ||
    position === Node.DOCUMENT_POSITION_PRECEDING
  )
    backward = true

  return backward
}

export const hasLabelsInside = (start, end, labelsArray) => {
  const arrayUnified = getArrayUnified(Math.min(start,end), Math.max(start,end));
  return isBetween(arrayUnified, selectedLabelsToArray(labelsArray));
};

export const selectionHasNoText = () => {
  const str = window.getSelection().toString()
  return (!str || /^\s*$/.test(str));
}

const isBetween = (a1, a2) => {
  return a1.some((val) => a2.indexOf(val) !== -1);
};

const getArrayUnified = (start, end) => {
  if (start == end) {
    return []
  } else {
    return Array(end - start)
    .fill('')
    .map((_, idx) => start + idx)
  }
} 

const mapLabel = x => {
  return getArrayUnified(x.start, x.end);
};

const selectedLabelsToArray = (labels) => {
  return labels.map(mapLabel).flat();
};

export const getCompletedWord = () => {
  const selection = window.getSelection();
  let range = selection.getRangeAt(0);
  let node = selection.focusNode;
  let reg = /^[a-zA-Z\u00C0-\u00FF-z0-9_@/#&+-]*$/;

  const isAllowChar = (char: any) => {
    return reg.test(char);
  };

  const isEOF = () => {
    return node.textContent.length === range.endOffset;
  };

  const adjustLeft = () => {
    return range.startOffset === 0 ? 0 : 1;
  };

  while (range.startOffset > 0 && isAllowChar(range.toString()[0])) {
    range.setStart(node, range.startOffset - 1);
  }
  range.setStart(node, range.startOffset + adjustLeft());

  while (!isEOF() && isAllowChar(range.toString().substr(-1))) {
    range.setEnd(node, range.endOffset + 1);
  }
  range.setEnd(node, range.endOffset - 1);
};

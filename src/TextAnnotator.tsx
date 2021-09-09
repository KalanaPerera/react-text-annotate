import React from 'react'

import Mark from './Mark'
import {
  selectionIsEmpty,
  selectionIsBackwards,
  splitWithOffsets,
  hasLabelsInside,
  selectionHasNoText,
  getCompletedWord,
  } from './utils'
import {Span} from './span'

const Split = props => {
  if (props.mark) return <Mark {...props} />

  return (
    <span
      data-start={props.start}
      data-end={props.end}
      onClick={() => props.onClick({start: props.start, end: props.end, id: props.id})}
    >
      {props.content}
    </span>
  )
}

interface TextSpan extends Span {
  text: string
}

type TextBaseProps<T> = {
  content: string
  editableContent?: boolean
  value: T[]
  onChange: (value: T[], span: Span) => any
  handleClick?: (index: number, selectedSpan: Span) => any
  getSpan?: (span: TextSpan) => T
  markStyle?: React.CSSProperties
  doubleTaggingOff?: boolean
  markClass?: string
  withCompletedWordSelection?: boolean
}

type TextAnnotatorProps<T> = React.HTMLAttributes<HTMLDivElement> & TextBaseProps<T>

const TextAnnotator = <T extends Span>(props: TextAnnotatorProps<T>) => {
  const getSpan = (span: TextSpan): T => {
    // TODO: Better typings here.
    if (props.getSpan) return props.getSpan(span) as T
    return {start: span.start, end: span.end} as T
  }

  const handleMouseUp = () => {
    if (!props.editableContent) return
    const selection = window.getSelection()

    if (selectionIsEmpty(selection) || selectionHasNoText()) return

    if (props.withCompletedWordSelection) {
      getCompletedWord();
    }

    let start =
      parseInt(selection.anchorNode.parentElement.getAttribute('data-start'), 10) +
      selection.anchorOffset
    let end =
      parseInt(selection.focusNode.parentElement.getAttribute('data-start'), 10) +
      selection.focusOffset
    if ( isNaN(start) || isNaN(end)) return
    if (props.doubleTaggingOff && hasLabelsInside(start, end, props.value)) return
    if (selectionIsBackwards(selection)) {
      ;[start, end] = [end, start]
    }

    props.onChange([...props.value, getSpan({start, end, text: content.slice(start, end)})], getSpan({start, end, text: content.slice(start, end)}))

    window.getSelection().empty()
  }

  const handleSplitClick = ({start, end}) => {
    // Default behaviour: Find and remove the matching split.
    const splitIndex = props.value.findIndex(s => s.start === start && s.end === end)
    if (splitIndex >= 0) {
      props.handleClick
        ? props.handleClick(splitIndex, getSpan({start, end, text: content.slice(start, end)}))
        : props.onChange([...props.value.slice(0, splitIndex), ...props.value.slice(splitIndex + 1)], getSpan({start, end, text: content.slice(start, end)}) )
    }
  }

  const {content, value, style, markStyle, markClass} = props
  const splits = splitWithOffsets(content, value)
  return (
    <div style={style} onMouseUp={handleMouseUp}>
      {splits.map((split, index) => (
        <Split class={markClass} key={index} {...split} onClick={handleSplitClick} />
     ))}
    </div>
  )
}

export default TextAnnotator

import React, { useState } from 'react'
import classes from './Mark';

export interface MarkProps {
  key: string
  content: string
  start: number
  end: number
  tag: string
  color?: string
  onClick: (any) => any
  class?: string
}

const Mark: React.FC<MarkProps> = props => {
  const [isMouseOnHover, setMouseOnHover] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setMouseOnHover(true)
  }

  const handleMouseLeave = () => {
    setMouseOnHover(false)
  }
  
  return (
  <mark
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    className={props.class ?? ''}
    style={{position: 'relative', cursor: 'pointer'}}
    data-start={props.start}
    data-end={props.end}
    color={props.color ?? ''}
    onClick={() => props.onClick({start: props.start, end: props.end})}
  >
    <span style={isMouseOnHover 
      ? {
          opacity: '1',
          color: '#fff',
          width: '14px',
          height: '14px',
          fontSize: '0.8em',
          background: '#444',
          textAlign: 'center',
          transition: 'opacity 0.1s ease',
          alignItems: 'center',
          fontFamily: 'sans-serif',
          lineHeight: '1.1',
          borderRadius: '50%',
          justifyContent: 'center',
          position: 'absolute',
          top: '-7px',
          left: '-7px',
      } 
      : { opacity: '0',
          width: '14px',
          height: '14px',
          position: 'absolute',
          top: '-7px',
          left: '-7px',
        }
      }>
    x
    </span>
    {props.content}
    {props.tag && (
        <>
          <span style={{ 
            fontSize: '0.7em',
            fontWeight: 'bold',
            marginRight: '0.5em',
            marginLeft: '1em',
            color: 'black' }}
          >
            {props.tag}
          </span>
        </>
    )}
  </mark>
  )}

export default Mark

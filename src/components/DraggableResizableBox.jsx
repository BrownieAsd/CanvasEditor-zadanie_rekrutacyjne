import React, { useRef, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import { Button } from '@mui/material';
import { Clear } from '@mui/icons-material';
import 'react-resizable/css/styles.css';

const DraggableResizableBox = ({ id, children, onDelete, onColorChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const boxRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    boxRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <ResizableBox
      width={200}
      height={200}
      minConstraints={[100, 100]}
      maxConstraints={[500, 500]}
      onResizeStop={(e, data) => {
        const newSize = {
          width: `${data.size.width}px`,
          height: `${data.size.height}px`,
        };
        boxRef.current.style.width = newSize.width;
        boxRef.current.style.height = newSize.height;

        const fontSize = Math.min(data.size.width, data.size.height) / 3.5;
        boxRef.current.style.fontSize = `${fontSize}px`;
      }}
    >
      <div
        ref={boxRef}
        className={`draggable-resizable-box ${isDragging ? 'is-dragging' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          padding: '10px',
          position: 'absolute',
          border: '1px solid black',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          boxSizing: 'border-box',
          cursor: 'move', 
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {children}
        <Button size="small" onClick={() => onDelete(id)} style={{ position: 'absolute', top: 0, right: 0 }}>
          <Clear />
        </Button>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
          }}
        >
          <ColorIcon color="#ff0000" onClick={() => onColorChange(id, '#ff0000')} />
          <ColorIcon color="#00ff00" onClick={() => onColorChange(id, '#00ff00')} />
          <ColorIcon color="#0000ff" onClick={() => onColorChange(id, '#0000ff')} />
          <ColorIcon color="#ffff00" onClick={() => onColorChange(id, '#ffff00')} />
          <ColorIcon color="#ff00ff" onClick={() => onColorChange(id, '#ff00ff')} />
        </div>
      </div>
    </ResizableBox>
  );
};

const ColorIcon = ({ color, onClick }) => (
  <div
    style={{
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: color,
      cursor: 'pointer',
    }}
    onClick={onClick}
  />
);

export default DraggableResizableBox;

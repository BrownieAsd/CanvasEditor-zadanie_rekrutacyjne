import React, { useRef, useState } from 'react';
import { Button } from '@mui/material';
import { Save, RotateLeft, Add } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import DraggableResizableBox from './DraggableResizableBox';

const ContentEditor = () => {
  const [items, setItems] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const canvasRef = useRef(null);

  const addItem = (type) => {
    if (type === 'text') {
      const newItem = { id: Date.now(), type, content: 'Sample Text' };
      setItems([...items, newItem]);
    } else if (type === 'image') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const newItem = { id: Date.now(), type, content: reader.result };
            setItems([...items, newItem]);
          };
        }
      };
      input.click();
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const resetItems = () => {
    setItems([]);
    setBackgroundImage(null);
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBackgroundImage(reader.result);
      };
    }
  };

  const exportToPNG = () => {
    html2canvas(canvasRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'canvas.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handleColorChange = (id, color) => {
    const newItems = items.map(item => {
      if (item.id === id && item.type === 'text') {
        return { ...item, style: { color } }; 
      }
      return item;
    });
    setItems(newItems);
  };
  
  

  return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
        <div className="col-span-1 md:col-span-3 border border-gray-300 rounded-md shadow-md p-4" style={{ width: '600px',  height: '800px', }}>
          <div
            ref={canvasRef}
            className="w-full h-full"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
              width: '600px',
              height: '800px',
              overflow: 'hidden',
            }}
          >
            {items.map((item) => (
              <DraggableResizableBox
                key={item.id}
                id={item.id}
                onDelete={deleteItem}
                onColorChange={handleColorChange}
                
              >
                {item.type === 'text' ? (
                  <input
                  type="text"
                  value={item.content}
                  onChange={(e) => {
                    const newItems = items.map((i) =>
                      i.id === item.id ? { ...i, content: e.target.value } : i
                    );
                    setItems(newItems);
                  }}
                  style={item.style}
                />
                ) : (
                  <img src={item.content} alt="user content" style={{ width: '100%', height: '100%' }} />
                )}
              </DraggableResizableBox>
            ))}
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Content Editor</h1>
            <Button variant="contained" color="secondary" startIcon={<RotateLeft />} onClick={resetItems}>
              Reset
            </Button>
          </div>
          <div className="border border-gray-300 rounded-md shadow-md p-4 text-center">
            Add Content
          </div>
          <input type="file" accept="image/*" onChange={handleBackgroundImageChange} className="hidden" />
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => addItem('text')}>
            Add Text
          </Button>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => addItem('image')}>
            Add Image
          </Button>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => document.querySelector('input[type="file"]').click()}>
            Background
          </Button>
          <div className="flex justify-between items-center">
            <Button variant="contained" color="primary" startIcon={<Save />} onClick={exportToPNG}>
              Export
            </Button>
          </div>
        </div>
      </div>
  );
};

export default ContentEditor;

import { StrictMode, useCallback, useEffect, useRef, useState } from 'react';
import {Stage, Layer, Rect, Circle} from 'react-konva';
import './App.css';

const clamp = (x,min,max) =>  {return Math.min(Math.max(x,min),max) }

function App() {

  const [shapes,setShapes] = useState([{
    id: "0",
    x: window.innerWidth,
    y: window.innerHeight,
    radius: 150,
    stroke:'black',
    isDragging: false
    // isDragging: true;
  }])

  // const [stageSize,setStageSize] = useState()
  const stage = useRef()

  const dragBound = (s,p) => {
    console.log(stage.current.height())
    const height = stage.current.height()
    const width  = stage.current.width()
    return {
      x: clamp(p.x,s,width-s),
      y: clamp(p.y,s,height-s)
    }
  }
  
  return (
    <div className="App" style={{width:(window.innerWidth*2),height:(window.innerHeight*1.5)}}>
      <Stage ref={stage} className="Stage" width={window.innerWidth*2} height={window.innerHeight*2}>
        <Layer>
          {/* <Circle x={150} y={150} stroke="black" radius={150} /> */}
          {shapes.map((shape)=> (
            //console.log("x",shape.x),
            <Circle
            _useStrictMode
            //onMouseDown={onMouseDown}
            // onDragStart={(e)=> onDragStart(e)}
            // onDragEnd={onDragEnd}
            // onDragMove={onDrageMove}
            draggable 
            dragBoundFunc={(p)=>dragBound(shape.radius,p)}
            key={shape.id} 
            id={shape.id}
            x={shape.x} 
            y={shape.y} 
            stroke={shape.stroke}
            radius={shape.radius} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}


export default App;
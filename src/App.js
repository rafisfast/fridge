import { StrictMode, useCallback, useEffect, useRef, useState } from 'react';
import {Stage, Layer, Rect, Circle} from 'react-konva';
import './App.css';

const clamp = (x,min,max) =>  {return Math.min(Math.max(x,min),max) }

function App() {

  const [sizeX,sizeY]  = [1920*2,1080*2]
  const [size,setsize] = useState({width:sizeX,height:sizeY})
  //const [Size,setSize] = useState({width:document.documentElement.clientWidth*2,height:document.documentElement.clientHeight*2})

  const [shapes,setShapes] = useState([{
    id: "0",
    x: 200,
    y: 200,
    radius: 150,
    stroke:'black',
    isDragging: false
    // isDragging: true;
  }])

  // const [stageSize,setStageSize] = useState()
  const stage = useRef()
  
  useEffect(()=> {
    window.addEventListener('resize', function(event) {
      setsize({width:sizeX,height:sizeY})
    }
    )})
    
  const scale = (window.innerWidth) / size.width
    
  const dragBound = (s,p) => {
    s = s * scale
    console.log(stage,stage.current.width(),p.x)
    const height = stage.current.height()
    const width  = stage.current.width()
    return {
      x: clamp(p.x,s,width-s),
      y: clamp(p.y,s,height-s)
    }
  }

  // const scale = size.width / 800

  return (
    <div className="App" style={{width:(size.width),height:(size.height)}}>
      <Stage ref={stage} className="Stage" width={size.width} height={size.height} scaleX={scale} scaleY={scale}>
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
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
  
  const [MoveData,setMoveData] = useState()
  const [dragging,setDragging] = useState()
  // click; dragging = id
  // mousemove = (x = DeltaX) relative to stage clamped to stage

    // const onMouseMove = (e) => {
    //   console.log("moving")
    //   if (MoveData) {
    //     console.log(shapes)
    //     const id = MoveData.target.id()
    //     const s = shapes
    //     const {x,y} = e
    //     const shape = s[id]
    //     shape.x = x
    //     shape.y = y
    //     setShapes(s)
    //   }
    //   // const id = MoveData.target.id()
    //   // console.log(id,e)
    //   // const s = shapes
    //   // const shape = s[id]
    //   // const [minX,maxX] = [shape.radius,(window.innerWidth*2) - shape.radius]
    //   // const [minY,maxY] = [shape.radius,(window.innerHeight*2)- shape.radius]
    //   // const {x,y} = e.target.getAbsolutePosition()
    //   // shape.x = clamp(x,minX,maxX)
    //   // shape.y = clamp(y,minY,maxY)
    //   // console.log(clamp(e.evt.x,minY,maxY),"clamp")
    //   // // math.clamp(z,x,y) math.min(z,x) or z > x math.max(z,y)
    //   // // math.max(math.min(x,min),max)
    //   // // Math.max(e.x,shape.radius)
    //   // console.log(s[dragging])
    //   // setShapes(s)
    // }

  // useEffect(()=> {
  //   console.log("set")
  //   window.addEventListener('mousemove',onMouseMove);
  //   return () => window.removeEventListener('mousemove',onMouseMove)
  // },[MoveData,shapes])

  // const onMouseDown = (e) => {
  //   console.log("clicked")
  //   const id = e.target.id()
  //   const [mX,mY] = [e.target.x,e.target.y]
  //   // setDragging(id)
  //   const q = "Hehe"
  //   setMoveData(e)
  //   // console.log(MoveData)
  // }

  const dragBound = (s,p) => {
    console.log(p)
    return {
      x: clamp(p.x,s,(window.innerWidth*2)-s),
      y: clamp(p.y,s,(window.innerHeight*2)-s)
    }
  }
  
  return (
    <div className="App" style={{width:(window.innerWidth*2),height:(window.innerHeight*2)}}>
      <Stage className="Stage" width={window.innerWidth*2} height={window.innerHeight*2}>
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
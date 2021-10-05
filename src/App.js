import { useCallback, useEffect, useRef, useState } from 'react';
import {Stage, Layer, Rect, Circle} from 'react-konva';
import './App.css';

function App() {
  const [shapes,setShapes] = useState([{
    id: 1,
    x: window.innerWidth,
    y: window.innerHeight,
    radius: 150,
    stroke:'black'
  }])
  
  const [style,setStyle] = useState({})
  const [dragging,setDragging] = useState(0)

  const onScroll = (event) => {
    console.log('yes',window.screenLeft)
  }

  const onMouseMove = (q) => {
    if (dragging) {
      console.log('moving')
      const s = shapes
      s.map((shape)=> {
        console.log(shape.id,dragging)
        if (s.id === dragging) {
          console.log('changing')
          // shape.x = 50;
          // shape.y = 50;
          // shape.x = Math.min(window.innerWidth + shape.radius,shape.x)
          // shape.y = Math.min(window.innerHeight + shape.radius,shape.y)
        }  
      })
      // if (x < window.innerWidth || x > window.innerWidth || y < window.innerHeight || y > window.innerHeight) {
      // }
      setShapes(s)
    }
    // return () => window.removeEventListener(onMouseMove)
  }
  const onDragStart = (e,element) => {
    const {layerX} = e.evt
    //console.log(e,layerX,'dragging')
    // console.log(e)
    setDragging(e.target.id())
    console.log("started dragging",e.target.id())
    // window.addEventListener('mousemove',onMouseMove)
  }

  const onDragEnd = (e) => {
    console.log("stopped dragging")
    setDragging()
    // window.removeEventListener('mousemove',onMouseMove)
  }

  useEffect(
    () => {
      window.scrollTo(window.innerWidth/2,window.innerHeight/2)
      window.addEventListener('scroll',onScroll);
      window.addEventListener('mousemove',onMouseMove);
      return () => {
        window.removeEventListener('scroll',onScroll)
        window.removeEventListener('mousemove',onMouseMove)
      }
    },[dragging]
  )

  return (
    <div className="App" style={{width:(window.innerWidth*2),height:(window.innerHeight*2)}}>
      <Stage className="Stage" width={window.innerWidth*2} height={window.innerHeight*2} style={style} >
        <Layer>
          {/* <Circle x={150} y={150} stroke="black" radius={150} /> */}
          {shapes.map((shape)=> (
            <Circle 
            onDragStart={(e)=> onDragStart(e)}
            onDragEnd={onDragEnd} 
            draggable 
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
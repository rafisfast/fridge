import React, { StrictMode, useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {Stage, Layer, Rect, Circle, Transformer}  from 'react-konva';
import Konva from 'konva'
import './App.css';
import { stages } from 'konva/lib/Stage';

Konva.pixelRatio = 1

const clamp = (x,min,max) =>  {return Math.min(Math.max(x,min),max) }

function App() {

  const [sizeX,sizeY]  = [3000,3000]
  const [size,setsize] = useState({width:sizeX,height:sizeY})
  const [selected,setselected] = useState("")
  const [dragging,setdragging] = useState()

  const scrollContainer = useRef()
  //const [Size,setSize] = useState({width:document.documentElement.clientWidth*2,height:document.documentElement.clientHeight*2})

  const [shapes,setShapes] = useState([{
    id: "0",
    x: 200,
    y: 200,
    width: 150,
    height: 150,
    stroke:'black',
    scale: 1,
    isDragging: false
    // isDragging: true;
  }])

  const transformerRef = useRef()

  useEffect(()=> {
    if (selected) {
      console.log(transformerRef)
      transformerRef.current.nodes([selected])
      transformerRef.current.getLayer().batchDraw()
    }
  },[selected])

  const select = (e) => {
    console.log(e.target.getAbsolutePosition())
    const id = e.target.id()
    if (id) {
      console.log(e.target)
      setselected(e.target)
    }
    // console.log(e.target.id())
    // setselected(id)
    // setselected(e.target.id())
  }
  // const [stageSize,setStageSize] = useState()
  const stage = useRef()
  const canvas = useRef()

  const onTransformEnd = (e) => {
    const id     = e.target.id()
    shapes[id].x = e.target.x()
    shapes[id].y = e.target.y()
    shapes[id].scale = e.target.scale().x
    setShapes(shapes)
  }

  const zoom = (e) => {
    const scaleBy = 1.02;
    const oldScale = stage.current.scaleX();

    const pointer = stage.current.getPointerPosition();

    // console.log(pointer)

    const mousePointTo = {
      x: (e.clientX - stage.current.x()) / oldScale,
      y: (e.clientY - stage.current.y()) / oldScale,
    };

    const newScale =
      ((e.scale) || (e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy))

    console.log(e.clientX,e.clientY,pointer.x,pointer.y)

    stage.current.scale({ x: newScale, y: newScale });

    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.current.position(newPos);
  }
  
  useEffect(()=> {
    // stage.current.addEventListener('wheel', function(e) {
    //   console.log(e)
    // })
    stage.current.on('wheel',(e)=> {
      
      const {deltaX: dx, deltaY: dy} = e.evt
      const {x,y} = stage.current.getAbsolutePosition()

      console.log(e.evt.ctrlKey)
      if (e.evt.ctrlKey) {
        e.evt.preventDefault();
        zoom(e.evt)

      } else {
        stage.current.x(x + dx)
        stage.current.y(y + dy)
      }

      console.log()

    })

    const c = canvas.current.getCanvas()._canvas
    // console.log(c.)
    
    c.addEventListener('gesturestart',(e)=> {
      // console.log(e,'gesture started')
      e.preventDefault()
    })

  },[])

  useEffect(()=> {
    const c = canvas.current.getCanvas()._canvas
    // console.log(c.)
    c.addEventListener('gesturechange',(e)=> {
      // console.log(e)
      e.preventDefault()
      zoom(e)
    })
  },[canvas])

  const onDragMove = (e) => {
    setdragging(e.target) 
  }

  const onDragEnd = (e) => {
    if (dragging) {
      const id     = e.target.id()
      const x      = e.target.x()
      const y      = e.target.y()
      shapes[id].x = x
      shapes[id].y = y
      setShapes(shapes)
      setdragging()
    }
  }

  // const scale = size.width / 800

  return (
    <div ref={scrollContainer} onWheel={console.log('true')} className="App">
      <Stage draggable ref={stage} className="Stage"  width={size.width} height={size.height} >
        <Layer ref={canvas}>
          {/* <Circle x={150} y={150} stroke="black" radius={150} /> */}
          {shapes.map((shape)=> (
            //console.log("x",shape.x),
            <Circle
            _useStrictMode
            onMouseDown={select}
            onTap={select}
            onDragMove={onDragMove}
            onTransformEnd={onTransformEnd}
            //onMouseDown={onMouseDown}
            // onDragStart={(e)=> onDragStart(e)}
            // onDragEnd={onDragEnd}
            // onDragMove={onDrageMove}
            draggable
            onDragEnd={onDragEnd}
            onTransform={(e)=>console.log(e)}
            // dragBoundFunc={(p)=>dragBound(shape.width,p,shape.height)}
            key={shape.id} 
            id={shape.id}
            x={shape.x} 
            y={shape.y} 
            scale={{x:shape.scale,y:shape.scale}}
            stroke={shape.stroke}
            radius={shape.width} />
          ))}
          {selected !== undefined &&
          <Transformer
            ref={transformerRef}
            rotateEnabled = {false}
            enabledAnchors={['top-right','top-left','bottom-left','bottom-right']}
           // onTransformEnd={onTransformEnd}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              //selected.radius
              if (newBox.width < 30 || newBox.height < 30) {
                return oldBox;
              }
              
              return newBox;
            }}
          />}
        </Layer>
      </Stage>
    </div>
  );
}


export default App;
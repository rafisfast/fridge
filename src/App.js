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
  
  const select = (e) => {
    // console.log(e.target.getAbsolutePosition())
    const id = e.target.id()
    // console.log(e.target, stage)
    if (id) {
      // console.log(e.target)
      // setselected(e.target)
      transformerRef.current.nodes([e.target])
    } else if (e.target === stage.current) {
      transformerRef.current.nodes([])
      setselected()
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

  // const zoom = (e) => {
  //   const scaleBy = 1.01;
  //   const oldScale = stage.current.scaleX();

  //   const pointer = stage.current.getPointerPosition();

  //   // console.log(pointer)

  //   const mousePointTo = {
  //     x: (pointer.x - stage.current.x()) / oldScale,
  //     y: (pointer.y - stage.current.y()) / oldScale,
  //   };

  //   const distance = (e.scale || e.deltaY)

  //   const newScale =
  //     ((distance < 0 ? oldScale * scaleBy : oldScale / scaleBy))

  //   console.log(distance,oldScale)

  //   stage.current.scale({ x: newScale, y: newScale });

  //   if (newScale > 0.25 || newScale < 3) {
  //     var newPos = {
  //       x: pointer.x - mousePointTo.x * newScale,
  //       y: pointer.y - mousePointTo.y * newScale,
  //     };
  //   }

  //   stage.current.position(newPos);
  // }


  const drawgrid = useCallback(()=> {
    const c = canvas.current.getCanvas()._canvas
    // const ctx = canvas.current.getContext('2d')

    // let s = 28
    // let pL = s
    // let pT = s
    // let pR = s
    // let pB = s
    
    // ctx.strokeStyle = 'lightgrey'
    // ctx.beginPath()
    // for (var x = pL; x <= this.width - pR; x += s) {
    //     ctx.moveTo(x, pT)
    //     ctx.lineTo(x, this.height - pB)
    // }
    // for (var y = pT; y <= this.height - pB; y += s) {
    //     ctx.moveTo(pL, y)
    //     ctx.lineTo(this.width - pR, y)
    // }
    // ctx.stroke()

  })

  const zoom = (e) => {
    
    var scaleBy = 1.02;
    var oldScale = stage.current.scaleX();

    var mousePointTo = {
      x: stage.current.getPointerPosition().x / oldScale - stage.current.x() / oldScale,
      y: stage.current.getPointerPosition().y / oldScale - stage.current.y() / oldScale
    };
    
    // const distance = (e.scale > 1 ? e || e.deltaY)
    // console.log(e.scale - oldScale)

    const delta = Math.sign(e.deltaY)

    console.log(e.deltaY)
    
    const newScale = clamp(oldScale -delta/105,0.5,4)
    stage.current.scale({ x: newScale, y: newScale });

    console.log(newScale)
        
    const newPos = {
      x:
        -(mousePointTo.x - stage.current.getPointerPosition().x / newScale) *
        newScale,
      y:
        -(mousePointTo.y - stage.current.getPointerPosition().y / newScale) *
        newScale
    };
    stage.current.position(newPos);
    stage.current.batchDraw();
  }
  
  const onwheel = (e) => {
    const {deltaX: dx, deltaY: dy} = e.evt
    const {x,y} = stage.current.getAbsolutePosition()
    e.evt.preventDefault();
    
    console.log(e.evt.ctrlKey,'holding',e.evt.wheelDelta,e.evt.wheelDeltaY)
    
    if (e.evt.ctrlKey) {
      zoom(e.evt)
      // drawgrid()

    } else {
      stage.current.x(x + dx)
      stage.current.y(y + dy)
      // drawgrid()
    }
  }

  useEffect(()=> {
    stage.current.on('wheel',onwheel)
    stage.current.on('dblclick',(e)=>console.log(e))
    return ()=> stage.current.off('wheel',onwheel)
  },[])
  
  useEffect(()=> {
    // stage.current.addEventListener('wheel', function(e) {
    //   console.log(e)
    // }
    const c = canvas.current.getCanvas()._canvas
    
    c.addEventListener('gesturestart',(e)=> {
      // console.log(e,'gesture started')
      e.preventDefault()
    })

    c.addEventListener('mousewheel',(e)=> {
      e.preventDefault()
      // zoom(e)
    })

    c.addEventListener('touchstart',(e)=> {
      console.log('e',e)
    },{passive:true})

    var scale = 'scale(1)';
    document.body.style.webkitTransform =  scale;    // Chrome, Opera, Safari
    document.body.style.msTransform =   scale;       // IE 9
    document.body.style.transform = scale;     // General

  },[])

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
    <div ref={scrollContainer} className="App">
      <Stage draggable ref={stage} className="Stage" width={size.width} height={size.height} onMouseDown={select} >
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
          {
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
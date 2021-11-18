import React, { createContext, createRef, StrictMode, useCallback, useEffect, useReducer, useRef, useState
} from "react";

import { useSelector, useDispatch } from 'react-redux'

import {
  add,
  remove,
  reset
} from './slices/refs'

import { Stage, Layer, Rect, Line, Circle, Transformer, Text, Group } from "react-konva";
import { onTransform, Transformlock, onSelect, onTextDoublePress, onStageDrag } from "./events";

import Helmet from "react-helmet";
import Konva from "konva";
import "./App.css";

import { clamp } from './lib'

Konva.pixelRatio = 2;

const Note = () => {

  // /*

  //   A note should be an object detailing what kind of shapes are in there and what values they hold
  //   [
  //     dragging = false,
  //     {
  //       Type: Text,
        
  //     }, 
  //     {
  //       Type: Rect,
  //       Width: 0,
  //       Height: 0,
  //       Scale: 0,
  //       Color: 0,
  //       Selectable: True,
  //       Draggable: True,
  //     }
  //   ]

  // */

}

// const Notes = () => {

//   // const [objects,setobjects] = useState({ shapes : [] , refs : [] })
//   // const [notes,setnotes] = useState([])

//   /*

//     for (var i=0;i<10;i++) {
      
//     }

//   */
//   /// 
//   // { 
//   //   
//   // }

//   for (var i=0; i<1; i++) {
//     notes.shapes.push(
//       <Rect 
//       // _u=
//       name={"Rect"}
//       id = {`${s.length}`}
//       key = {`${s.length}`}
//       x = {0}
//       y = {0}
//       width = {200}
//       height = {200}
//       radius = {200}
//       stroke = {"black"}
//       scale = {1}
//       ref={e=>r.push(e)}
//       onTransform={onRectTransform}
//       />
//     )
//   }

//   notes.shapes.push(
//   <Rect 
//     // _u=
//     name={"Rect"}
//     id = {`${s.length}`}
//     key = {`${s.length}`}
//     x = {0}
//     y = {0}
//     width = {200}
//     height = {200}
//     radius = {200}
//     stroke = {"black"}
//     scale = {1}
//     ref={e=>r.push(e)}
//     onTransform={onRectTransform}
//     />
//   )
//   return(

//     notes.map(()=>{
//       return(
//         <Group>

//         </Group>
//       )
//     })

//   )

// }

const Grid = (props) => {

  const [boundsX,boundsY] = [3000, 6000 + window.innerHeight]
  const [width,stroke] = [120, 0.1]

  const g = []
  
  var key = 0

  for (var i= -boundsX / width; i < (boundsX + window.innerHeight) / width; i++) {
    key++
    g.push(
      <Line
        key={key}
        hitStrokeWidth={0}
        points={[0, 0, boundsX * 2 + window.innerWidth, 0]} //x1,y1,x2,y2,x3,y3
        x={-boundsX}
        y={i * width}
        strokeWidth={stroke}
        stroke="black"
        perfectDrawEnabled={true}
        // ref={(e) => refs.current.push(e)}
      />
    )
  }

  for (var i = -boundsY / width; i < boundsY / width; i++) { 
    key++
    g.push(
      <Line
        key={key}
        hitStrokeWidth={0}
        points={[0, 0, 0, boundsY * 2 + window.innerHeight]} //x1,y1,x2,y2,x3,y3
        x={i * width}
        y={-(boundsY + window.innerHeight)}
        strokeWidth={stroke}
        stroke="black"
        // ref={(e) => refs.current.push(e)}
      />
    );
  }

  return (
    g
  )

}

const App = () => {

  const dispatch = useDispatch()

  const anchors   = useSelector(state=>state.selection.anchors)
  const selected  = useSelector(state=>state.selection.selected)
  
  const shape  = useRef()
  const stage  = useRef()
  const canvas = useRef()
  const transformer = useRef()

  useEffect(()=> {

    const c = canvas.current.getCanvas()._canvas;
    
    // PREVENT DEFAULT

    c.addEventListener("gesturestart", (e) => {
      // console.log(e,'gesture started')
      e.preventDefault();
    });

    c.addEventListener("mousewheel", (e) => {
      e.preventDefault();
      // zoom(e)
    });

    // EVENTS

    stage.current.on("wheel", (e)=> {
      const { deltaX: dx, deltaY: dy } = e.evt;
      e.evt.preventDefault();
    
      if (e.evt.ctrlKey) {
        
        zoom(e.evt,stage);

      } else {
        onStageDrag(e,stage)
      // 
      }
    })

    window.addEventListener("resize", () => {
    });

    var scale = "scale(1)";
    document.body.style.webkitTransform = scale; // Chrome, Opera, Safari
    document.body.style.msTransform = scale; // IE 9
    document.body.style.transform = scale; // General

  },[])

  useEffect(()=> {
    if (selected === shape.current.id() && selected !== "stage") {
      transformer.current.nodes([shape.current]) 
    } else {
      transformer.current.nodes([])
    }
  },[selected])

  const zoom = (e) => {

    var oldScale = stage.current.scaleX();

    var mousePointTo = {
      x:
        stage.current.getPointerPosition().x / oldScale -
        stage.current.x() / oldScale,
      y:
        stage.current.getPointerPosition().y / oldScale -
        stage.current.y() / oldScale,
    };

    const delta = Math.sign(e.deltaY);

    const newScale = clamp(oldScale + -e.deltaY / 100, 0.25, 32);
    stage.current.scale({ x: newScale, y: newScale });
    
    const newPos = {
      x:
      -(mousePointTo.x - stage.current.getPointerPosition().x / newScale) *
      newScale,
      y:
      -(mousePointTo.y - stage.current.getPointerPosition().y / newScale) *
      newScale,
    };
    stage.current.position(newPos)
    
  };

  return (
    <div className="App">
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        ></meta>
      </Helmet>
      <Stage
        id={"stage"}
        ref={stage}
        className="Stage"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={(e)=>onSelect(e)}
        dragBoundFunc={(pos)=>{
          return {x: clamp(pos.x,-(3000 - window.innerWidth),3000), y: clamp(pos.y,-(3000 - window.innerHeight),3000)}
        }}
        draggable
        >
      <Layer ref={canvas}>
        <Grid />
        {/* <Notes /> */}
        <Group 
        draggable
        onSelect={(e)=>onSelect(e)}>
        <Rect
          id={"0"}
          name={"Rect"}
          ref={shape}
          x={0}
          y={0}
          width={50}
          height={50}
          stroke = {"black"}
          strokeWidth={0.5}
        />
        </Group>
        <Transformer
          ref={transformer}
          rotateEnabled={false}
          anchorStroke={"black"}
          anchorCornerRadius={100}
          anchorStrokeWidth={.25}
          anchorSize={11}
          borderStroke={"black"}
          borderStrokeWidth={2}
          ignoreStroke
          enabledAnchors={anchors}
          onTransform={Transformlock}
          // onTransformEnd={onTransformEnd}
        />
      </Layer>
      </Stage>
    </div>
  )
}

export default App
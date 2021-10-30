import React, { createContext, createRef, StrictMode, useCallback, useEffect, useReducer, useRef, useState,
} from "react";
import { Stage, Layer, Rect, Line, Circle, Transformer, Text } from "react-konva";
import { onTransform, onTextTransform, onRectTransform, onSelect, onTextDoublePress } from "./Events";
import Helmet from "react-helmet";
import Konva from "konva";
import useImage from "use-image";
import "./App.css";
import { stages } from "konva/lib/Stage";
import { clamp } from './lib'

Konva.pixelRatio = 2;

function App() {

  const [selected, setselected] = useState("")
  const [dragging, setdragging] = useState();
  const [anchors, setanchors] = useState([])
  const [grid, setgrid] = useState({ shapes: [] });
  const [offset, setoffset] = useState({ x: 0, y: 0 });
  const [style, setstyle] = useState({});
  const refs = useRef([]);

  const background = useRef();
  const scrollContainer = useRef();
  //const [Size,setSize] = useState({width:document.documentElement.clientWidth*2,height:document.documentElement.clientHeight*2})

  // {
  //   id: "0",
  //   x: 200,
  //   y: 200,
  //   width: 150,
  //   height: 150,
  //   stroke: "black",
  //   scale: 1,
  //   isDragging: false,
  //   type: Rect,
  //   // isDragging: true;
  // }

  const [shapes, setShapes] = useState({objects : [], refs : []});

  const transformerRef = useRef();
  const texttransformerRef = useRef();

  
  // const [stageSize,setStageSize] = useState()
  const stage = useRef();
  const canvas = useRef();

  const griddraw = (z) => {
    // console.log(refs)

    const g = { shapes: [], ref: [] };

    const boundsX = 3000;
    const boundsY = 6000 + window.innerHeight;

    const width = 120;
    const stroke = 0.1;

    var key = 0;

    // ----
    for (
      var i = -boundsX / width;
      i < (boundsX + window.innerHeight) / width;
      i++
    ) {
      key++;
      g.shapes.push(
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
      );
      // g.ref.push(ref)
      // for (var q=0;q<2;q++) {
      //   key++
      //   const s = q % 2 === 0 ? stroke : 0.05
      //   g.shapes.push(
      //     <Line
      //     key={key}
      //     hitStrokeWidth={0}
      //     points={[0,0,boundsX*2 + window.innerWidth,0]} //x1,y1,x2,y2,x3,y3
      //     x={-boundsX}
      //     y={i*width + (q/2 * width)}
      //     strokeWidth={s}
      //     stroke="black"
      //     ref={(e)=> refs.current.push(e)}
      //     />
      //   )
      // }
    }

    // |||||
    for (var i = -boundsY / width; i < boundsY / width; i++) {
      key++;
      const ref = createRef();
      g.shapes.push(
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
      // g.ref.push(ref)
      // for (var q=0;q<2;q++) {
      //   key++
      //   const s = q % 2 === 0 ? stroke : 0.05
      //   g.shapes.push(
      //     <Line
      //     key={key}
      //     hitStrokeWidth={0}
      //     points={[0,0,0,boundsY*2 + window.innerHeight]} //x1,y1,x2,y2,x3,y3
      //     x={i*width + (q/2 * width)}
      //     y={-(boundsY + window.innerHeight) }
      //     strokeWidth={s}
      //     stroke="black"
      //     ref={(e)=> refs.current.push(e)}
      //     />
      //   )
      // }
    }

    // g.shapes.map((e)=> {
    //   console.log(e)
    // })

    // refs.current.map((e)=> {
    //   console.log("")
    // })

    // console.log(key)
    // for (var y=-boundsY;y<boundsY;y+=width) {
    //   key++
    //   for (var i=-boundsX;i<boundsY;i+=width) {
    //     key++
    //     g.push(
    //       <Line
    //       key={key}
    //       hitStrokeWidth={0}
    //       shadowForStrokeEnabled={false}
    //       points={[i,y,i + width,y,i+width,y+width]} //x1,y1,x2,y2,x3,y3
    //       strokeWidth={stroke}
    //       stroke="black"
    //       />
    //     )
    //   }
    // }

    console.log(key);

    setgrid(g);

    // setstyle({"backgroundPosition":` left ${stage.current.x()}px top ${stage.current.y()}px`,
    // "backgroundSize":`${stage.current.scale().x * 80}px ${stage.current.scale().x * 80}px`})
  };

  useEffect(() => {
    griddraw();
    // unmounting
    return () => {
      const g = { shapes : []}
      setgrid(g)
      const s = { objects : [], refs : []}
      setShapes(s)
    }
  }, []);

  const [oScale, setOScale] = useState(1);
  useEffect(() => {
    // drawgrid()
    // console.log(oScale)

    // on pan
    // move grid relative to the offset and you should have an endless grid
    // zoom just draw lines where they need to be inside the viewport

    // const g = grid

    const boundsX = 3000;
    const boundsY = 6000 + window.innerHeight;

    const width = 160;
    const stroke = 0.1;

    var i = 0;
    // refs.current.map((e, key) => {
    //   // console.log(e.x() > offset.x, e.x() < offset.x + (window.innerWidth*oScale), e.visible())
    //   // console.log(window.innerWidth / oScale, window.innerWidth * oScale);
    //   if (Math.floor(oScale) % 2 === 0) {
    //     // console.log("is zoom");
    //     // ||
    //     if (
    //       e.x() > -offset.x / oScale - width / oScale &&
    //       e.x() <
    //         -offset.x / oScale + window.innerWidth / oScale - width / oScale &&
    //       e.visible()
    //     ) {
    //       for (var i = 1; i < 6; i++) {
    //         // console.log(i,"numberino")
    //         const p = refs.current.filter((q)=> q.x() === e.x() + (i / 6) * width)
    //         if (p.length < 1) {
    //           <Line
    //               key={refs.current.length++}
    //               hitStrokeWidth={0}
    //               points={[0, 0, 0, boundsY * 2 + window.innerHeight]} //x1,y1,x2,y2
    //               x={e.x() + (i / 6) * width}
    //               y={-(boundsY + window.innerHeight)}
    //               strokeWidth={stroke}
    //               stroke="black"
    //               ref={(e)=>refs.current.push(e)}
    //             />
    //         }
    //       }
    //       // i++
    //       // console.log(e.points())
    //       // e.hide()
    //     }
    //     // --
    //     if (
    //       e.y() > -offset.y / oScale - width / oScale &&
    //       e.y() <
    //         -offset.y / oScale + window.innerHeight / oScale - width / oScale &&
    //       e.visible()
    //     ) {
    //       // i++
    //       // e.hide()
    //     }
    //     // setgrid(g)
    //     // drawgrid();
    //   }
    // });

    console.log(i, "MOVING");
  }, [oScale, offset]);

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

  const [backgroundoffset,setbackgroundoffset] = useState(0)

  const drawgrid = useCallback(() => {
    // setgrid(g)
  });

  const zoom = (e,layer) => {
    var scaleBy = 1.02;
    var oldScale = layer.current.scaleX();

    var mousePointTo = {
      x:
        stage.current.getPointerPosition().x / oldScale -
        layer.current.x() / oldScale,
      y:
        stage.current.getPointerPosition().y / oldScale -
        layer.current.y() / oldScale,
    };

    // const distance = (e.scale > 1 ? e || e.deltaY)
    // console.log(e.scale - oldScale)

    const delta = Math.sign(e.deltaY);

    // console.log(e.deltaY * )

    const newScale = clamp(oldScale + -e.deltaY / 100, 0.25, 32);
    layer.current.scale({ x: newScale, y: newScale });
    
    const newPos = {
      x:
      -(mousePointTo.x - stage.current.getPointerPosition().x / newScale) *
      newScale,
      y:
      -(mousePointTo.y - stage.current.getPointerPosition().y / newScale) *
      newScale,
    };
    layer.current.position(newPos)
    // stage.current.batchDraw();

  };
  
  const onwheel = (e) => {
    const { deltaX: dx, deltaY: dy } = e.evt;
    // const { x: sx, y: sy } = stage.current.getAbsolutePosition();
    e.evt.preventDefault();

    // console.log(e.evt.ctrlKey,'holding',e.evt.wheelDelta,e.evt.wheelDeltaY)

    if (e.evt.ctrlKey) {
      zoom(e.evt,stage);

      // const current_scale = background.current.scaleX()
      // const bounds = {lower:0.25,higher:32}
      
      // console.log('s',canvas.current.scaleX())
      // zoom(e.evt,background);

      // if (Math.floor(current_scale) % 3 === 0 && current_scale > 1) {
      //   console.log("increasing",current_scale)
      //   background.current.scale({x:.25,y:.25})
      //   background.current.position({x:0,y:0})
      // // } else if (Math.floor(current_scale) < 1 && Math.floor(canvas.current.scaleX()) > 1) {
      // //   console.log("reducing")
      // //   background.current.position({x:0,y:0})
      // //   background.current.scale({x:2.99,y:2.99})
      // } else if (canvas.current.scaleX() > bounds.lower ) {
      // }
      
      // refs.current.map((e)=> {
      //   e.fillPatternScale(stage.current.scale())
      // })
      // console.log(stage.current.scale().x)
      // refs.current.map((e)=> {
      //   e.scale({x: stage.current.scale().x * 4,y: stage.current.scale().x * 4})
      // })
    } else {
      // console.log(stage.current.position())
      // stage.current.x(x - dx)
      // stage.current.y(y - dy)
      const boundx = 3000 * stage.current.scale().x;
      const boundy = 3000 * stage.current.scale().y;
      
      // const layers = [canvas,background]
      const layers = [stage]

      for (var i=0;i<layers.length;i++) { 
        const layer = layers[i]
        const {x,y} = layer.current.getAbsolutePosition()
        // layer.current.x(x - dx)
        layer.current.x(clamp(x - dx, -(boundx - window.innerWidth), boundx));
        layer.current.y(clamp(y - dy, -(boundy - window.innerHeight), boundy));
      }

      // setoffset({ x: stage.current.x(), y: stage.current.y() });

      // refs.current.map((e) => {
      //   if (
      //     stage.current.x() > e.x() &&
      //     stage.current.y() > e.y() &&
      //     window.innerWidth + stage.current.x() < e.x() &&
      //     window.innerHeight + stage.current.y() < e.y()
      //   ) {
      //     console.log("hiding");
      //     e.hide();
      //   }
      // });

      // setoffset([])
      // drawgrid()
    }

    // zoom in
    // inner grid becomes same stroke as outer grid
    // zoom in more
    // inner grid becomes same stroke as outer grid
    // zoom in more
    // inner grid becomes same stroke as outer grid

    //
    setOScale(stage.current.scale().x);

    const nScale = Math.floor(stage.current.scale().x);
    if (nScale % 1 === 0 && nScale != oScale) {
      // refs.current.map((e, i) => {
      //   if (i % 2 === 0) {
      //     // e.hide()
      //   }
      //   if (nScale >= 3) {
      //     e.strokeWidth(0.05);
      //   }
      // });
      if (nScale % 2 === 0) {
        // griddraw(nScale)
      }
      // setOScale(nScale)
      // const g = grid.slice()
      // console.log(g)
      // g[0].map((item)=> {
      //   item.props.strokeWidth=5
      // })
      // setgrid(g)
      // console.log(refs.current.map((e)=>{
      // // e.hide()
      // }))
      console.log("zoomed", nScale, oScale);
    }
    // griddraw()

    // drawgrid()
  };

  useEffect(() => {
    stage.current.on("wheel", onwheel);
    // drawgrid()
    return () => stage.current.off("wheel", onwheel);
  }, [oScale, grid, refs,backgroundoffset]);

  // <Circle 
  //     id={2}
  //     key={2}
  //     x={0}
  //     y={0}
  //     _useStrictMode
  //     draggable
  //     radius={20}
  //     stroke={"black"}
  //     onMouseDown={select}
  //     onTap={select}
  //     onDragMove={onDragMove}
  //     onTransformEnd={onTransformEnd}
  //   />


  // id:`${shapes.objects.length}`,
  //     key:`${shapes.objects.length}`,
  //     x:0,
  //     y:0,
  //     width: 50,
  //     height: 50,
  //     stroke: "black",
  //     scale: 1,
  //     isDragging: false,
  //     type: Circle
  useEffect(()=> {
    const s = shapes.objects.slice()
    const r = shapes.refs.slice()
    s.push(
      <Rect 
      // _u=
      name={"Rect"}
      id = {`${s.length}`}
      key = {`${s.length}`}
      x = {0}
      y = {0}
      width = {200}
      height = {200}
      radius = {200}
      stroke = {"black"}
      scale = {1}
      ref={e=>r.push(e)}
      draggable
      onMouseDown={(e)=>onSelect(e,[setselected,setanchors,background,transformerRef,texttransformerRef,stage])}
      onTransform={onRectTransform}
      />,
      <Text
      name={"Text"}
      text={"text here"}
      id = {`${s.length+1}`}
      key = {`${s.length+1}`}
      fontSize={20}
      width={200}
      x = {0}
      y = {0}
      ref={e=>r.push(e)}
      draggable
      onMouseDown={(e)=>onSelect(e,[setselected,setanchors,background,transformerRef,texttransformerRef,stage])}
      onTransform={onTextTransform}
      onDblClick={e=>onTextDoublePress(e,[texttransformerRef,setShapes,shapes,stage])}
      onDblTap={e=>onTextDoublePress(e,[texttransformerRef,setShapes,shapes,stage])}
      />
    );
    setShapes({objects:s,refs:r})
    // shapes.objects.push({
    //   id:`${shapes.objects.length}`,
    //   key:`${shapes.objects.length}`,
    //   x:0,
    //   y:0,
    //   width: 50,
    //   height: 50,
    //   stroke: "black",
    //   scale: 1,
    //   isDragging: false,
    //   type: Text
    // })
  },[])

  useEffect(() => {
    // stage.current.addEventListener('wheel', function(e) {
    //   console.log(e)
    // }
    const c = canvas.current.getCanvas()._canvas;

    /// INIT EVENTS

    c.addEventListener("gesturestart", (e) => {
      // console.log(e,'gesture started')
      e.preventDefault();
    });

    c.addEventListener("mousewheel", (e) => {
      e.preventDefault();
      // zoom(e)
    });
    // c.addEventListener("")

    // c.addEventListener(
    //   "touchstart",
    //   (e) => {
    //     console.log("e", e);
    //   },
    //   { passive: true }
    // );

    window.addEventListener("resize", () => {
      drawgrid();
    });

    var scale = "scale(1)";
    document.body.style.webkitTransform = scale; // Chrome, Opera, Safari
    document.body.style.msTransform = scale; // IE 9
    document.body.style.transform = scale; // General

  }, []);

  const onDragMove = (e) => {
    setdragging(e.target);
  };

  const onDragEnd = (e) => {
    if (dragging) {
      const id = e.target.id();
      const x = e.target.x();
      const y = e.target.y();
      shapes[id].x = x;
      shapes[id].y = y;
      setShapes(shapes);
      setdragging();
    }
  };

  // const scale = size.width / 800

  return (
    <div ref={scrollContainer} style={style} className="App">
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        ></meta>
      </Helmet>
      <Stage
        ref={stage}
        className="Stage"
        width={window.innerWidth}
        height={window.innerHeight}
        draggable
        onMouseDown={(e)=>onSelect(e,[setselected,setanchors,background,transformerRef,texttransformerRef,stage])}
      >
        <Layer ref={background}>
          {/* {console.log('rerenering first layer')} */}
          {}
        </Layer>
        <Layer ref={canvas}> 
          {/* {console.log('rerenering second layer')} */}
          {grid.shapes}
          {shapes.objects.map((e)=>{return e})}
          {/* {shapes.map((shape) => (
            //console.log("x",shape.x),
            <shape.type
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
              // dragBoundFunc={(p)=>dragBound(shape.width,p,shape.height)}
              key={shape.id}
              id={shape.id}
              x={shape.x}
              y={shape.y}
              scale={{ x: shape.scale, y: shape.scale }}
              width={shape.width}
              height={shape.height}
              strokeWidth={0.25}
              stroke={shape.stroke}
              // radius={shape.width}
            />
          ))} */}
          {
            <Transformer 
            ref={texttransformerRef}
            rotateEnabled={false}
            anchorStroke={"black"}
            anchorCornerRadius={100}
            anchorStrokeWidth={.25}
            anchorSize={11}
            borderStroke={"black"}
            borderStrokeWidth={2}
            ignoreStroke
            boundBoxFunc = {(oldBox, newBox)=> {
              newBox.width = Math.max(30, newBox.width);
              return newBox;
            }}
            enabledAnchors={anchors}
            />
          }
          {
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              anchorStroke={"black"}
              anchorCornerRadius={100}
              anchorStrokeWidth={.25}
              anchorSize={11}
              borderStroke={"black"}
              borderStrokeWidth={2}
              ignoreStroke
              enabledAnchors={anchors}
              boundBoxFunc={(oldBox, newBox) => {
                // limit resize
                //selected.radius
                if (newBox.width < 30 || newBox.height < 30) {
                  return oldBox;
                }

                console.log(newBox)
                // console.log(selected.id())
                

                return newBox;
              }}
              // onTransformEnd={onTransformEnd}
            />
          }
        </Layer>
      </Stage>
    </div>
  );
}

export default App;

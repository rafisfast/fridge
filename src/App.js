import React, {createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './App.css';

const clamp = (x,min,max) =>  {return Math.min(Math.max(x,min),max) }
const BaggageContext = createContext()

function Tile(props) {
    
    const canvas = useRef()
    const [shape,setShape,scrolloffset,setscrolloffset,scale,setscale] = useContext(BaggageContext)
    const [style,setstyle] = useState({})
    // const [scale,setscale] = useState(1)

    useEffect(()=> {
        draw()
        // const e = ['gesturechange','']
        const context = canvas.current.getContext('2d')
        context.save()
        canvas.current.addEventListener('wheel',(e)=> {
            e.preventDefault()
        })
        canvas.current.addEventListener('gesturestart',(e)=> {
            console.log(e,'started')
        })
    },[])

    const pinchMultiplier = 0.025
    
    const onGesture = (e) => {
        e.preventDefault()
        // pinch and zoom out from where you are pointing
        // console.log(e,'changing',e.scale > 1,scale + (1 - e.scale),clamp((e.scale > 1 ? scale + (e.scale - 1) : scale - (1 - e.scale)),0.15,4))

        // dragging should change scale to e.scale

        setscale(clamp((e.scale > 1 ? scale + (e.scale - 1) * pinchMultiplier : scale - (1 - e.scale) * pinchMultiplier),0.15,4))
        //e.scale > 1 ? e.scale * pinchMultiplier - scale : e.scale * pinchMultiplier + scale
        // canvas.current.style = {}
        // setstyle({transform:`scale(${scale},${scale}) translate(${e.clientX/2}px,${e.clientY/2}px)`})
        // console.log(scale,style)
        // setscrolloffset({x:scrolloffset.x - (scale * e.clientX) * scale,y: scrolloffset.y  - (scale * e.clientX)})
        // setscale(e.scale < scale ? scale - e.scale * 0.01 : scale + e.scale * 0.01)
        // setscale(scale+(e.scale * 0.05))
    }

    useEffect(()=> {
        canvas.current.addEventListener('gesturechange',onGesture)
        return ()=> {
            canvas.current.removeEventListener('gesturechange',onGesture)
        }
    },[scale])

    // console.log(props.id,'he')

    const draw = () => {
        const {x,y,width,height,color} = shape
       // console.log(x,y)
       const context = canvas.current.getContext('2d')
       context.resetTransform()
       context.scale(scale,scale)
       //    console.log(context.current.scale)
       
       // context.clearRect(x,y,)
       // console.log(data)
       // context.putImageData(data[data.length-1],0,0)
       
       const {x: mx,y: my} = scrolloffset
       // console.log(mx,my)
       context.beginPath();
       
       // if i <= 10 = 0 else 10
       
       context.fillStyle = color;
       context.fillRect(x + mx, y  + my, width, height);
       // console.log(x + props.id*1000)
    }
    
    useEffect(()=> {
        draw()
        return () => {
            const context = canvas.current.getContext('2d')
            // const {x: mx,y: my} = scrolloffset
            context.clearRect(0,0,canvas.current.width/scale,canvas.current.height/scale)
            context.scale(scale,scale)
            // context.restore()
        }
    },[window,shape,scrolloffset,scale])
    
    return (
        <canvas style={style} ref={canvas} width ={window.innerWidth} height={window.innerHeight}  className="layers">
        </canvas>
    )
}

function App() {

    // const [sizeX,sizeY]  = [,3000]
    const main = useRef()

    const [dragging, setdragging] = useState()
    const [offset, setoffset] = useState()
    const [scrolloffset,setscrolloffset] = useState({x:0,y:0})
    const [scale,setscale] = useState(1)

    const [shape, setShape] = useState(
        // temp shapes dictionary
        {
            id: "0",
            x: 0,
            y: 0,
            width: 250,
            height: 150,
            color: 'green'
        }
    )

    const onWheel = (e) => {
        // onscroll handler
        e.preventDefault()
        // e.stopImmediatePropagation()
        const {deltaX: dx, deltaY: dy} = e
        const {x: mx, y: my} = scrolloffset
        setscrolloffset({x:mx+dx,y:my+dy})
        // console.log(mouseoffset)
    }

    useEffect(()=> {

        document.addEventListener('wheel',onWheel)

        return () => {
            document.removeEventListener('wheel',onWheel)
        }

    },[scrolloffset])
    
    const onMouseDown = (e) => {
        
        if (dragging) {
            setdragging(false)
            return
        }

        const mouseX = e.clientX / scale
        const mouseY = e.clientY / scale
        const [shapex,shapey] = [shape.x + scrolloffset.x,shape.y + scrolloffset.y]

        // console.log(e.clientX,shape.x+scrolloffset.x,shape.x+scrolloffset.x+shape.width)
        // console.log(e.clientX >= shape.x + scrolloffset.x && e.clientX <= shape.x + scrolloffset.x + shape.width)
        console.log(shapex,shapey,shape.width,shape.height)

        if (mouseX >= shapex && mouseX <= shapex + (shape.width * scale) && mouseY >= shapey && mouseY <= shapey + (shape.height * scale)) {
            setoffset({x:mouseX,y:mouseY})
            // setselected(true)
            setdragging(true)
        }
    }

    const shapeToMouse = useCallback((e)=> {  
        //console.log('moving')
        // console.log(data)
        const {x,y} = offset
        const mouseX = e.clientX / scale
        const mouseY = e.clientY  / scale
        setShape({...shape,
            x: shape.x + mouseX - x, //clamp(shape.x + mouseX - x,0,canvas.current.width - shape.width),
            y: shape.y + mouseY - y//clamp(shape.y + mouseY - y,0,canvas.current.height - shape.height)
        })
        // data.pop()
        // setdata([...data])
    },[offset,scrolloffset])

    useEffect(()=> {
        document.addEventListener('gesturechange',(e)=> {
            // prevent zooming normally
            e.preventDefault()
            // console.log(e)
        })
    },[])

    useEffect(()=> {
        main.current.removeEventListener('mousemove',shapeToMouse)
        if (dragging) {
            main.current.addEventListener('mousemove',shapeToMouse)
        }
    },[offset,dragging])

    const onMouseUp = (e) => {
        //console.log(shape)
        setdragging(false)
    }

    return (
        <div className="App" ref={main} onMouseUp={onMouseUp} onMouseDown={onMouseDown}>
            <BaggageContext.Provider value={[shape, setShape, scrolloffset, setscrolloffset, scale, setscale]}>
                <Tile />
            </BaggageContext.Provider>
        </div>
    );
}

export default App;
import React, {createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './App.css';

const clamp = (x,min,max) =>  {return Math.min(Math.max(x,min),max) }
const ShapesContext = createContext()

function Tile(props) {
    
    const canvas = useRef()
    const [shape,setShape] = useContext(ShapesContext)
    const [style,setstyle] = useState({})
    const [mouseoffset,setmouseoffset] = useState({x:0,y:0})

    useEffect(()=> {
        draw()
    },[])

    const onScroll = (e) => {
        const {deltaX: dx, deltaY: dy} = e
        const {x: mx, y: my} = mouseoffset
        e.preventDefault()
        setmouseoffset({x:mx+dx,y:my+dy})
        // console.log(mouseoffset)
    }

    useEffect(()=> {

        document.addEventListener('wheel',onScroll)

        return () => {
            document.removeEventListener('wheel',onScroll)
        }

    },[mouseoffset])

    // console.log(props.id,'he')

    const draw = () => {
        const {x,y,width,height,color} = shape
       // console.log(x,y)
       const context = canvas.current.getContext('2d')
       
       // context.clearRect(x,y,)
        // console.log(data)
        // context.putImageData(data[data.length-1],0,0)
        
        const {x: mx,y: my} = mouseoffset
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
            context.clearRect(0,0,canvas.current.width,canvas.current.height)
        }
    },[window,shape,mouseoffset])
    
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

    const [shape, setShape] = useState(
        {
            id: "0",
            x: 0,
            y: 0,
            width: 250,
            height: 150,
            color: 'green'
        }
    )

    const onScroll = (e) => {
        const {deltaX: dx, deltaY: dy} = e
        const {x: mx, y: my} = scrolloffset
        e.preventDefault()
        setscrolloffset({x:mx+dx,y:my+dy})
        // console.log(mouseoffset)
    }

    useEffect(()=> {

        document.addEventListener('wheel',onScroll)

        return () => {
            document.removeEventListener('wheel',onScroll)
        }

    },[scrolloffset])
    
    const onMouseDown = (e) => {
        
        const mouseX = e.clientX 
        const mouseY = e.clientY
        const [shapex,shapey] = [shape.x + scrolloffset.x,shape.y + scrolloffset.y]

        console.log(e.clientX,shape.x+scrolloffset.x,shape.x+scrolloffset.x+shape.width)
        console.log(e.clientX >= shape.x + scrolloffset.x && e.clientX <= shape.x + scrolloffset.x + shape.width)

        if (mouseX >= shapex && mouseX <= shapex + shape.width && mouseY >= shapey && mouseY <= shapey + shape.height) {
            setoffset({x:mouseX,y:mouseY})
            // setselected(true)
            setdragging(true)
        }
    }

    const shapeToMouse = useCallback((e)=> {  
        //console.log('moving')
        // console.log(data)
        const {x,y} = offset
        const mouseX = e.clientX 
        const mouseY = e.clientY 
        setShape({...shape,
            x: shape.x + mouseX - x, //clamp(shape.x + mouseX - x,0,canvas.current.width - shape.width),
            y: shape.y + mouseY - y//clamp(shape.y + mouseY - y,0,canvas.current.height - shape.height)
        })
        // data.pop()
        // setdata([...data])
    },[offset,scrolloffset])

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
            <ShapesContext.Provider value={[shape, setShape]}>
                <Tile />
            </ShapesContext.Provider>
        </div>
    );
}

export default App;
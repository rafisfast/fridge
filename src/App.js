import React, {useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

const clamp = (x,min,max) =>  {return Math.min(Math.max(x,min),max) }

function App() {

    const [sizeX,sizeY]  = [3000,3000]
    const [shape,setShape] = useState(
        {
            id:"0",
            x:0,
            y:0,
            width:250,
            height:150,
            color:'green'
        }
    )
    
    const [offset,setoffset] = useState({x:0,y:0})
    const [dragging,setdragging] = useState()

    const draw = () => {
        const {x,y,width,height,color} = shape
        console.log(x,y)
        const context = canvas.current.getContext('2d')
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }

    const canvas = useRef()

    useEffect(()=> {
        if (canvas.current) {
            console.log('new')
            draw()
        }
        return () => {
            if (canvas.current) {
                const context = canvas.current.getContext('2d')
                const {x,y,width,height,color} = shape
                context.clearRect(x,y,width,height)
                console.log('clearing')
            }
        }
    },[shape])

    const shapeToMouse = useCallback((e)=> {  
        console.log('moving')
        const {x,y} = offset
        console.log('moving offset', x,y)
        console.log('moving mouse', e.clientX, e.clientY)
        setShape({...shape,
            x: clamp(shape.x + e.clientX - x,0,sizeX),
            y: clamp(shape.y + e.clientY - y,0,sizeY)
        })
    },[offset])

    useEffect(()=> {
        canvas.current.removeEventListener('mousemove',shapeToMouse)
        if (dragging) {
            canvas.current.addEventListener('mousemove',shapeToMouse)
        }
    },[offset,dragging])

    const DraggingStart = (e) => {
        console.log('offset',e.clientX,e.clientY)
        if (e.clientX <= shape.x + shape.width && e.clientX >= shape.x && e.clientY <= shape.y + shape.height && e.clientY > shape.y) {
            setoffset({x:e.clientX,y:e.clientY})
            setdragging(true)
        }
    }

    const DraggingEnd = (e) => {
        console.log(shape)
        setdragging(false)
    }

    return (
        <div className="App">
            <canvas width ={sizeX} height={sizeY} ref={canvas} className="layers" onMouseDown={DraggingStart} onMouseUp={DraggingEnd}>
            </canvas>
        </div>
    );
}

export default App;
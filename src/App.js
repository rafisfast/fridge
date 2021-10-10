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
        const mouseX = e.clientX + window.scrollX
        const mouseY = e.clientY + window.scrollY
        setShape({...shape,
            x: clamp(shape.x + mouseX - x,0,sizeX),
            y: clamp(shape.y + mouseY - y,0,sizeY)
        })
    },[offset])

    useEffect(()=> {
        canvas.current.addEventListener('mouseout',()=> setdragging(false))
    })

    useEffect(()=> {
        canvas.current.removeEventListener('mousemove',shapeToMouse)
        if (dragging) {
            canvas.current.addEventListener('mousemove',shapeToMouse)
        }
    },[offset,dragging])

    const DraggingStart = (e) => {
        console.log('offset',e.clientX,e.clientY)
        const mouseX = e.clientX + window.scrollX
        const mouseY = e.clientY + window.scrollY
        if (mouseX <= shape.x + shape.width && mouseX >= shape.x && mouseY <= shape.y + shape.height && mouseY > shape.y) {
            setoffset({x:mouseX,y:mouseY})
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
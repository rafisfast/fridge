import React, {useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

const clamp = (x,min,max) =>  {return Math.min(Math.max(x,min),max) }

function App() {

    // const [sizeX,sizeY]  = [,3000]
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
    const [selected,setselected] = useState()
    const [data,setdata] = useState()

    useEffect(()=> {
        console.log('set data')
        window.devicePixelRatio = 1
        const context = canvas.current.getContext('2d')
        setdata(context.getImageData(0,0,canvas.current.width,canvas.current.height))
    },[])
    
    const draw = (removeStroke) => {
        const {x,y,width,height,color} = shape
        console.log(x,y)
        const context = canvas.current.getContext('2d')
        // context.clearRect(x,y,)
        // console.log(data)
        // context.putImageData(data[data.length-1],0,0)
        
        context.beginPath();

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
                if (data) {
                    context.putImageData(data,0,0)

                }
                // context.clearRect(x,y,width,height)
                // context.clearRect(x-2,y,2,height)
                    // data.pop()
                    // setdata([...data,context.getImageData(0,0,canvas.current.width,canvas.current.height)])
                console.log('clearing')
            }
        }
    },[shape])

    const shapeToMouse = useCallback((e)=> {  
        console.log('moving')
        // console.log(data)
        const context = canvas.current.getContext('2d')
        const {x,y} = offset
        const mouseX = e.clientX + window.scrollX
        const mouseY = e.clientY + window.scrollY
        setShape({...shape,
            x: shape.x + mouseX - x, //clamp(shape.x + mouseX - x,0,canvas.current.width - shape.width),
            y: shape.y + mouseY - y//clamp(shape.y + mouseY - y,0,canvas.current.height - shape.height)
        })
        // data.pop()
        // setdata([...data])
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
    
    
    useEffect(()=> {
        console.log(selected)
        if(dragging || selected !== true) {
        }
    },[selected,shape,dragging])

    const onMouseDown = (e) => {
        const mouseX = e.clientX + window.scrollX
        const mouseY = e.clientY + window.scrollY
        if (mouseX <= shape.x + shape.width && mouseX >= shape.x && mouseY <= shape.y + shape.height && mouseY > shape.y) {
            
            setoffset({x:mouseX,y:mouseY})
            // setselected(true)
            setdragging(true)
        } else {
        }
    }

    const onMouseUp = (e) => {
        console.log(shape)
        setdragging(false)
    }

    return (
        <div className="App">
            <canvas style={{/*transformOrigin:'0 0',transform:'scale(0.5)'*/}} width ={window.innerWidth} height={window.innerHeight} ref={canvas} className="layers" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            </canvas>
            <canvas style={{}} width ={window.innerWidth} height={window.innerHeight} className="layers" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            </canvas>
        </div>
    );
}

export default App;
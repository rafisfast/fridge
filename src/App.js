import React, {createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './App.css';

const clamp = (x,min,max) =>  {return Math.min(Math.max(x,min),max) }
const ShapesContext = createContext()

function Tile(props) {
    
    const canvas = useRef()
    
    const [shape,setShape] = useContext(ShapesContext)
    const [data,setdata] = useState()

    useEffect(()=> {
        const context = canvas.current.getContext('2d')
        setdata(context.getImageData(0,0,canvas.current.width,canvas.current.height))
    },[canvas])

    // console.log(props.id,'he')

    const draw = () => {
        const {x,y,width,height,color} = shape
       // console.log(x,y)
       const context = canvas.current.getContext('2d')
       
       // context.clearRect(x,y,)
        // console.log(data)
        // context.putImageData(data[data.length-1],0,0)
        
        context.beginPath();

        context.fillStyle = color;
        context.fillRect(x - (props.id * 1000), y, width, height);
        // console.log(x + props.id*1000)
    }

    useEffect(()=> {
        if (canvas.current) {
            //console.log('new')
            draw()
        }
        return () => {
            if (canvas.current) {
                const context = canvas.current.getContext('2d')
                const {x,y,width,height,color} = shape
                // console.log('trying to fetch data', data)
               
                context.clearRect(0,0,canvas.current.width,canvas.current.height)
                //context.clearRect(x,y,width,height)
                // context.clearRect(x-2,y,2,height)
                    // data.pop()
                // console.log('clearing')
            }
        }
    },[shape])
    
    return (
        <canvas ref={canvas} width ={'1000px'} height={'1000px'}  className="layers">
        </canvas>
    )
}

function Tiles() {
    const tiles = []
    for (var i=0;i<10;i++) {
        tiles.push(<Tile key={i} id={i}/>)
    }
    return tiles
}

function App() {

    // const [sizeX,sizeY]  = [,3000]
    const main = useRef()

    const [dragging, setdragging] = useState()
    const [offset, setoffset] = useState()
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

    const shapeToMouse = useCallback((e)=> {  
        //console.log('moving')
        // console.log(data)
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
        // main.current.addEventListener('mouseout',()=> setdragging(false))
    })

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
                <Tiles />
            </ShapesContext.Provider>
        </div>
    );
}

export default App;
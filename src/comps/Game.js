import React  from "react" 
import { CannonProvider } from "../utils/cannon" 
import Camera from "./Camera"
import Floor from "./Floor" 
import Launcher from "./Launcher"
import Chair from "./Chair"
import Shelf from "./Shelf"
import Shelf2 from "./Shelf2"
import Bowl from "./Bowl"
import { useThree, useFrame } from "react-three-fiber"
    

export default function Game() {
    let{gl} = useThree()

    useFrame(()=> {
        console.log(gl.info.render.calls)
        gl.info.autoReset = false 
        gl.info.reset()
    })

    return (
        <CannonProvider>
            <Camera />
            <Floor y={-2} width={100} height={4} depth={60} z={0} /> 

            <Launcher /> 
            <Shelf x={-8} />
            <Chair z={-7} /> <Bowl z={-5} x={-3} />
            <Shelf2 x={0} />
            
        </CannonProvider>
    )
}
 
 
//  
// <Chair z={-7} /> 
import React  from "react" 
import { CannonProvider } from "../utils/cannon" 
import Camera from "./Camera"
import Floor from "./Floor" 
import Launcher from "./Launcher"
import Chair from "./Chair"
import Shelf from "./Shelf"
import Bowl from "./Bowl"
    

export default function Game() {
    return (
        <CannonProvider>
            <Camera />
            <Floor y={-2} width={35} height={4} depth={30} z={5} />
            <Floor z={-60} y={10} width={35} height={20}   />

            <Launcher /> 
            
            <Chair z={0} />
            <Shelf x={-8} />
            <Bowl z={-5} x={-3} />
        </CannonProvider>
    )
}
 
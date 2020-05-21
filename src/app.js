import "../assets/styles/app.scss"

import React from "react"
import ReactDOM from "react-dom"
import { Canvas } from "react-three-fiber"
import { Vector3 } from "three"
import Game from "./comps/Game"
import { useStore } from "./store"

function Ui() {
    let objects = useStore(i => i.data.objects)
    let state = useStore(i => i.data.state) 

    return (
        <div className="ui">
            <p>objs: {objects}</p>
            <p>state: {state}</p>
        </div>
    )
}

ReactDOM.render(
    <>
        <Ui />
        <Canvas
            noEvents
            sRGB
            orthographic
            pixelRatio={.72}
            camera={{
                zoom: 75,
                fov: 75,
                near: -10,
                far: 50,
            }}
        >
            <ambientLight intensity={.25} />
            <directionalLight
                color={0xffffff}
                intensity={0.7}
                position={[4, 6, 1]}
                onUpdate={(self) => {
                    self.updateMatrixWorld()
                    self.updateWorldMatrix()
                }}
            />
            <Game />
        </Canvas>
    </>,
    document.getElementById("root")
)

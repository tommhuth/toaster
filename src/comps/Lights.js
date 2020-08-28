import React, { useRef } from "react"

export default function Light() {
    let ref = useRef()

    return (
        <>
            <ambientLight intensity={.3} color={0xffffff} />
            <directionalLight
                color={0xffffff}
                intensity={0.6}
                castShadow
                position={[-2, 4, 6]}
                ref={ref}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={20}
                //shadow-bias={.0003} 
                shadow-camera-near={-20}
                shadow-camera-left={-15}
                shadow-camera-right={30}
                shadow-camera-top={25}
                shadow-camera-bottom={-10}
            />
        </>
    )
}
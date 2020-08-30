import React, { useRef } from "react"

export default function Light() {
    let ref = useRef()

    return (
        <>
            <ambientLight intensity={.25} color={0xffffff} />
            <directionalLight
                color={0xffffff}
                intensity={0.375}
                castShadow
                position={[-2, 3, 6]}
                ref={ref}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={20} 
                shadow-camera-near={-20}
                shadow-camera-left={-15}
                shadow-camera-right={30}
                shadow-camera-top={25}
                shadow-camera-bottom={-10}
            />
        </>
    )
}
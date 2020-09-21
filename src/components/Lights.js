import React, { useRef } from "react"

export default function Light() {
    let ref = useRef()

    return (
        <>
            <hemisphereLight
                intensity={.15}
                groundColor={0xdddddd}
                color={0xffffff}
            />
            <pointLight
                position={[0, 15, 0]}
                intensity={1}
                decay={1}
                distance={25}
                color={0xffffff}
            />
            <directionalLight
                color={0xffffff}
                intensity={0.3}
                castShadow
                position={[-2, 4, 6]}
                ref={ref}
                shadow-mapSize-width={768}
                shadow-mapSize-height={768}
                shadow-camera-far={30}
                shadow-camera-near={-20}
                shadow-camera-left={-15}
                shadow-camera-right={30}
                shadow-camera-top={25}
                shadow-camera-bottom={-10}
            />
        </>
    )
}
import React, { useEffect, useRef } from "react"
import { useThree } from "react-three-fiber"
import { CameraHelper } from "three"


export default function Light() {
    let ref = useRef()
    let {scene} = useThree()

    useEffect(()=>{
        /*
        let c = new CameraHelper(ref.current.shadow.camera)
        
        scene.add(c)

        */
        scene.add(ref.current.target)

        ref.current.target.position.set(-18, -4, -6)
    },[])

    return (
        <>
            <hemisphereLight
                intensity={.15}
                groundColor={0xdddddd}
                color={0xffffff}
            />
            <pointLight
                position={[0, 35, 0]}
                intensity={1}
                decay={1}
                distance={45}
                color={0xffffff}
            />
            <directionalLight
                color={0xffffff}
                intensity={0.3}
                castShadow
                position={[-20,0,0]} // -2, 4, 6
                ref={ref}
                shadow-mapSize-width={768}
                shadow-mapSize-height={768}
                shadow-camera-far={40} // right
                shadow-camera-near={-15} // left
                shadow-camera-left={-10} // up
                shadow-camera-right={45} // down
                shadow-camera-top={25} // top
                shadow-camera-bottom={-10} // bottom
            />
        </>
    )
}
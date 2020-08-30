import { useEffect } from "react"
import { useThree } from "react-three-fiber"
import {CameraHelper} from "three"

export default function Camera() {
    let { camera } = useThree()

    useEffect(() => {
        camera.position.set(10,10,10)
        camera.lookAt(0, 0, 0)
 
    }, [])

    return null
}
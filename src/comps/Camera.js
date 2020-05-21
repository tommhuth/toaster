import { useEffect } from "react"
import { useThree } from "react-three-fiber"

export default function Camera() {
    let { camera } = useThree()

    useEffect(() => {
        camera.position.set(5,7,5)
        camera.lookAt(-5, -1, -5)
    }, [])

    return null
}
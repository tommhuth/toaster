import React, { useMemo, useRef } from "react"
import { useCannon } from "../../utils/cannon"
import { Sphere } from "cannon"
import { useDefaultValue } from "../../utils/hooks"
import { useStore } from "../../utils/store"
import { useFrame, useThree } from "react-three-fiber" 

function Ball({ radius = 0.25, id, removeBall, velocity = [0, 0, 0], position = [0, 3, 0] }) {
    let defaultPosition = useDefaultValue(position)
    let actions = useStore(i => i.actions)
    let ended = useRef(false)
    let {viewport, camera} = useThree()
    let { ref, body } = useCannon({
        mass: 6,
        velocity,
        position,
        shape: new Sphere(radius),
        userData: { ball: true },
        linearDamping: 0.2,
        angularDamping: 0.2,
        onCollide(e) {
            if (e.body.userData.untouchable && !ended.current) {
                ended.current = true
                actions.end()
            }
        }
    })

    useFrame(() => {  
        let width = viewport.width/camera.zoom  * 1.5
        let height = viewport.width/camera.zoom  * 1.5

        if (body.position.x < -width || body.position.x > width || body.position.z < -height || body.position.z > height) {
            removeBall(id)
        }
    })

    return (
        <mesh ref={ref} position={defaultPosition} castShadow receiveShadow>
            <sphereBufferGeometry args={[radius, 16, 16]} attach="geometry" />
            <meshPhongMaterial
                emissive="#fcad03"
                color="#fcad03"
                emissiveIntensity={.25}
                attach="material"
            />
        </mesh>
    )
}

export default React.memo(Ball)
import React, { useRef } from "react"
import { useCannon } from "../../utils/cannon"
import { Sphere } from "cannon"
import { useDefaultValue } from "../../utils/hooks"
import { useStore } from "../../utils/store"

function Ball({ radius = 0.25, velocity = [0, 0, 0], position = [0, 3, 0] }) {
    let defaultPosition = useDefaultValue(position)
    let actions = useStore(i => i.actions)
    let ended = useRef(false)
    let { ref } = useCannon({
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

    return (
        <mesh ref={ref} position={defaultPosition} castShadow receiveShadow>
            <sphereBufferGeometry args={[radius, 16, 16]} attach="geometry" />
            <meshPhongMaterial color="orange" attach="material" />
        </mesh>
    )
}

export default React.memo(Ball)
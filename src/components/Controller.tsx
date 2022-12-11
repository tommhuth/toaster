import { invalidate, useFrame, useThree } from "@react-three/fiber"
import { Sphere as SphereShape } from "cannon-es"
import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import { Frustum, Intersection, Matrix4, Mesh, Raycaster, Vector3, Sphere } from "three"
import { ObjectType } from "../data/stages"
import { addBall, removeBall, useStore } from "../data/store"
import { Tuple3 } from "../types"
import { useInstancedBody } from "../utils/cannon"
import { setColorAt } from "../utils/utils"
import InstancedMesh, { useInstance } from "./InstancedMesh"

interface BallProps {
    velocity: Tuple3
    position: Tuple3
    id: string
    radius?: number
}

const _frustum = new Frustum()
const _matrix = new Matrix4()
const _sphere = new Sphere()

function Ball({ radius = .25, velocity = [0, 0, 0], id, position = [0, 0, 0] }: BallProps) {
    let { camera } = useThree()
    let definition = useMemo(() => {
        return new SphereShape(radius)
    }, [radius])
    let [index, instance] = useInstance("ball")
    let [body] = useInstancedBody({
        definition,
        mass: 8,
        position,
        velocity,
        scale: [radius, radius, radius],
        linearDamping: .25,
        index,
        instance,
        userData: { type: "ball" },
    })

    useEffect(() => {
        if (body) {
            body.wakeUp()
            body.velocity.set(...velocity)
        }
    }, [body])

    useLayoutEffect(() => {
        if (instance && index) {
            setColorAt(instance, index, "white")
        }
    }, [instance, index])

    useFrame(() => {
        _matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
        _frustum.setFromProjectionMatrix(_matrix)

        if (!_frustum.intersectsSphere(_sphere.set(body.position as unknown as Vector3, radius))) {
            removeBall(id)
        }
    })

    return null
}

export default function Controller() {
    let { camera, scene } = useThree()
    let ref = useRef<Mesh>(null)
    let balls = useStore(i => i.balls)
    let radius = .25

    useEffect(() => {
        let start: Intersection
        let end: Intersection
        let length = 0
        let down = false
        let raycaster = new Raycaster()
        let reset = () => {
            down = false
            length = 0
            ref.current?.scale.set(0, 0, 0)
            invalidate()
        }
        let mousedown = e => {
            down = true
            raycaster.setFromCamera(
                {
                    x: (e.clientX / window.innerWidth) * 2 - 1,
                    y: -(e.clientY / window.innerHeight) * 2 + 1
                },
                camera
            )

            let [intersection] = raycaster.intersectObjects(scene.children.filter(i => i.userData.type === ObjectType.GROUND), true)

            if (intersection) { 
                start = intersection
            }
        }
        let mousemove = e => {
            if (!down) {
                return
            }

            raycaster.setFromCamera(
                {
                    x: (e.clientX / window.innerWidth) * 2 - 1,
                    y: -(e.clientY / window.innerHeight) * 2 + 1
                },
                camera
            )

            let objects = scene.children.filter(i => i.userData.type === ObjectType.GROUND)
            let [intersection] = raycaster.intersectObjects(objects, true)

            if (intersection) {
                end = intersection

                if (start.object === end.object) {
                    length = end.point.clone().sub(start.point).length()

                    if (ref.current) {
                        ref.current.position.copy(start.point)
                        ref.current.position.y += -.99
                        ref.current.scale.x = length
                        ref.current.scale.z = length
                        ref.current.scale.y = 1
                    }

                    invalidate()
                }
            } else {
                console.log("NO HIT")
            }
        }
        let mouseup = () => {
            if (length > 0) {
                let direction = start.point.clone().sub(end.point).normalize().multiplyScalar(length * 8)

                direction.y = length * 4
                end.point.y += radius / 2

                addBall(end.point.toArray(), direction.toArray())
                invalidate()
            }
            
            reset()
        }

        window.addEventListener("mousedown", mousedown)
        window.addEventListener("mousemove", mousemove)
        window.addEventListener("mouseup", mouseup)
        document.addEventListener("mouseleave", reset)

        return () => {
            window.removeEventListener("mousedown", mousedown)
            window.removeEventListener("mousemove", mousemove)
            window.removeEventListener("mouseup", mouseup)
            document.removeEventListener("mouseleave", reset)
        }
    }, [])

    return (
        <>
            <mesh ref={ref} position={[0, -2, 0]}>
                <cylinderGeometry args={[1, 1, 2, 64, 1]} />
                <meshBasicMaterial color={"white"} transparent opacity={.05} />
            </mesh>

            {balls.map(i => <Ball {...i} radius={radius} key={i.id} />)}

            <InstancedMesh
                name={"ball"}
                count={50}
            >
                <sphereGeometry args={[1, 16, 16]} />
                <meshLambertMaterial emissive={"white"} emissiveIntensity={.3} />
            </InstancedMesh>
        </>
    )
}
import { invalidate, useFrame, useThree } from "@react-three/fiber"
import { Sphere as SphereShape } from "cannon-es"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Frustum, Intersection, Matrix4, Mesh, Raycaster, Vector3, Sphere, Vector2 } from "three"
import { ObjectType } from "../data/stages"
import { addBall, removeBall, store, useStore } from "../data/store"
import { Tuple2, Tuple3 } from "../types"
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

function Ball({
    radius = .25,
    velocity = [0, 0, 0],
    id,
    position = [0, 0, 0]
}: BallProps) {
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
    let { camera } = useThree()
    let targetReticleRef = useRef<Mesh>(null)
    let balls = useStore(i => i.balls)
    let startPosition = useMemo(() => new Vector3(), [])
    let endPosition = useMemo(() => new Vector3(), [])

    useEffect(() => {
        let point = new Vector2()
        let up = new Vector3(0, 1, 0)
        let raycaster = new Raycaster()
        let isTargeting = false
        let distance = 0
        let findIntersection = (e: PointerEvent) => {
            let { ground } = store.getState().instances

            raycaster.setFromCamera(
                point.set(
                    (e.clientX / window.innerWidth) * 2 - 1,
                    -(e.clientY / window.innerHeight) * 2 + 1
                ),
                camera
            )

            let [intersection] = raycaster.intersectObject(ground.mesh, false)

            if (intersection && intersection.normal?.dot(up) === 1) {
                return intersection
            }

            return null
        }

        let pointerdown = (e: PointerEvent) => { 
            if (store.getState().panning) {
                return
            }

            let intersection = findIntersection(e)

            isTargeting = true
            distance = 0

            if (intersection) {
                startPosition.copy(intersection.point)
                targetReticleRef.current?.position.copy(startPosition)
                targetReticleRef.current?.scale.set(0, 1, 0)
            }
        }
        let pointermove = (e: PointerEvent) => {
            if (store.getState().panning || !isTargeting) {
                return
            } 

            let intersection = findIntersection(e)

            if (intersection) {
                distance = startPosition.distanceTo(intersection.point)

                endPosition.copy(intersection.point)

                if (distance > .1) {
                    targetReticleRef.current?.scale.set(distance, 1, distance)
                }
            }
        }
        let pointerup = () => {
            isTargeting = false
            targetReticleRef.current?.scale.set(0, 1, 0)

            if (distance > 0) {
                let direction = startPosition.clone()
                    .sub(endPosition)
                    .normalize()
                    .multiplyScalar(distance * 6)

                direction.y = Math.pow(distance, 1.75)

                addBall(startPosition.toArray(), direction.toArray())
            }
        }
        let touchmove = (e: TouchEvent) => {
            if (isTargeting) {
                e.preventDefault()
            }
        }

        window.addEventListener("pointerdown", pointerdown)
        window.addEventListener("pointermove", pointermove)
        window.addEventListener("pointerup", pointerup)
        window.addEventListener("pointercancel", pointerup)
        window.addEventListener("touchmove", touchmove, { passive: false })

        return () => {
            window.removeEventListener("pointerdown", pointerdown)
            window.removeEventListener("pointermove", pointermove)
            window.removeEventListener("pointerup", pointerup)
            window.removeEventListener("pointercancel", pointerup)
            window.removeEventListener("touchmove", touchmove)
        }
    }, [camera])

    return (
        <>
            <mesh ref={targetReticleRef} position={[0, -2, 0]}>
                <cylinderGeometry args={[1, 1, .1, 32, 1]} />
                <meshBasicMaterial color={"yellow"} transparent opacity={1.5} />
            </mesh>

            <InstancedMesh
                name={"ball"}
                count={50}
            >
                <sphereGeometry args={[1, 12, 12]} />
                <meshLambertMaterial emissive={"white"} emissiveIntensity={.3} />
            </InstancedMesh>

            {balls.map(i => <Ball {...i} key={i.id} />)}
        </>
    )
}
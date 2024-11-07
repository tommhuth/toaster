import { GSSolver, SplitSolver, World, Body as CannonBody, Vec3, SAPBroadphase, Shape, Quaternion as CannonQuaternion, ContactEquation } from "cannon-es"
import React, { useRef, useEffect, useContext, useMemo, useLayoutEffect, ReactNode } from "react"
import { invalidate, useFrame, useThree } from "@react-three/fiber"
import { Mesh, InstancedMesh } from "three"
import { Tuple3, Tuple4 } from "../types"
import { clamp, setMatrixAt } from "./utils"
import createCannonDebugger from "cannon-es-debugger"
import useAnimationFrame from "use-animation-frame"


export type ShapeDefinition = Shape | [Shape, Vec3?, CannonQuaternion?][]

interface BodyParams {
    definition: ShapeDefinition
    mass?: number
    velocity?: Tuple3
    position?: Tuple3
    rotation?: Tuple3
    angularDamping?: number
    linearDamping?: number
    allowSleep?: boolean
    ready?: boolean
    userData?: Record<string, any>
}

const context = React.createContext(null as unknown as World)

export type CollisionEvent = { body: Body, target: Body, contact: ContactEquation }


export class Body extends CannonBody {
    userData: Record<string, any> = {}
}

export function useCannonWorld() {
    return useContext(context)
}

function useCannonBody({
    definition,
    mass = 0,
    position: [positionX, positionY, positionZ] = [0, 0, 0],
    rotation: [rotationX, rotationY, rotationZ] = [0, 0, 0],
    linearDamping = .75,
    angularDamping = .35,
    allowSleep = true,
    userData = {},
    ready,
}: BodyParams) {
    const body = useMemo(() => {
        let b = new Body({
            mass,
            allowSleep,
            sleepSpeedLimit: .25,
            angularDamping,
            linearDamping,
            position: new Vec3(positionX, positionY, positionZ)
        })

        b.userData = userData

        if (Array.isArray(definition)) {
            for (const shapeDefinition of definition) {
                b.addShape(...shapeDefinition)
            }
        } else {
            b.addShape(definition)
        }

        return b
    }, [linearDamping, allowSleep, mass, positionX, positionY, positionZ, definition])
    const world = useCannonWorld()

    useEffect(() => {
        body.userData = userData
    }, [userData, body])

    useLayoutEffect(() => {
        body.quaternion.setFromEuler(rotationX, rotationY, rotationZ)
    }, [body, rotationX, rotationY, rotationZ])

    useEffect(() => {
        if (ready) {
            world.addBody(body)

            return () => {
                world.removeBody(body)
            }
        }
    }, [body, world, ready])

    return [body, world] as const
}



interface CannonProviderProps {
    allowSleep?: boolean
    gravity?: Tuple3
    defaultRestitution?: number
    axisIndex?: SAPBroadphase["axisIndex"]
    iterations?: number
    debug?: boolean
    children: ReactNode
}


export function CannonProvider({
    children,
    allowSleep = true,
    gravity: [gravityX, gravityY, gravityZ] = [0, -20, 0],
    defaultRestitution = .45,
    axisIndex,
    iterations = 10,
    debug = false,
}: CannonProviderProps) {
    const { scene } = useThree()
    const world = useMemo(() => {
        let solver = new SplitSolver(new GSSolver())

        solver.iterations = iterations

        return new World({
            allowSleep,
            solver,
            gravity: new Vec3(gravityX, gravityY, gravityZ),
        })
    }, [allowSleep, iterations, gravityX, gravityY, gravityZ])
    const cannonDebugger = useMemo(() => {
        return debug ? createCannonDebugger(scene, world, { color: "red" }) : null
    }, [world, scene, debug])

    useEffect(() => {
        world.defaultContactMaterial.restitution = defaultRestitution
    }, [world, axisIndex, defaultRestitution])

    // dont use useFrame here since r3f will stop firing those unless invalidate()
    // and we need to constantly watch over any hasActiveBodies
    useAnimationFrame(({ delta }) => { 
        world.step(Math.min(delta, 1 / 30)) 

        if (world.hasActiveBodies) {
            //invalidate()

            if (cannonDebugger) {
                cannonDebugger.update()
            }
        }
    }, [world, cannonDebugger])

    return (
        <context.Provider value={world}>
            {children}
        </context.Provider>
    )
}

export function useBody({
    mass = 1,
    position: [positionX, positionY, positionZ] = [0, 0, 0],
    rotation: [rotationX, rotationY, rotationZ] = [0, 0, 0],
    definition,
    linearDamping = .1,
    allowSleep = true,
}: BodyParams) {
    const ref = useRef<Mesh>(null)
    const [body] = useCannonBody({
        mass,
        definition,
        position: [positionX, positionY, positionZ],
        rotation: [rotationX, rotationY, rotationZ],
        linearDamping,
        allowSleep
    })

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.position.set(...body.position.toArray())
            ref.current.quaternion.set(...body.quaternion.toArray())
        }
    }, [])

    useFrame(() => {
        if (ref.current && mass > 0) {
            ref.current.position.set(...body.position.toArray())
            ref.current.quaternion.set(...body.quaternion.toArray())
        }
    })

    return [ref, body] as const
}

interface UseInstancedBodyParams extends BodyParams {
    instance: InstancedMesh
    index: number | null
    keepAround?: boolean
    fixed?: boolean
    scale?: Tuple3 | Tuple4
}

export function useInstancedBody({
    mass = 0,
    position: [positionX, positionY, positionZ] = [0, 0, 0],
    rotation: [rotationX, rotationY, rotationZ] = [0, 0, 0],
    definition,
    keepAround = false,
    fixed = mass === 0,
    ready = true,
    scale: [scaleX, scaleY, scaleZ] = [1, 1, 1],
    instance,
    index,
    userData,
    linearDamping = .1,
}: UseInstancedBodyParams) {
    let [body] = useCannonBody({
        mass,
        definition,
        position: [positionX, positionY, positionZ],
        rotation: [rotationX, rotationY, rotationZ],
        linearDamping,
        userData,
        ready,
    })

    useEffect(() => {
        if (instance && typeof index === "number" && !keepAround) {
            return () => {
                setMatrixAt({
                    index,
                    instance,
                    position: [-1000000, -1000000, -1000000],
                    scale: [0, 0, 0]
                })
            }
        }
    }, [instance, keepAround, index])

    useLayoutEffect(() => {
        if (instance && typeof index === "number" && ready) {
            setMatrixAt({
                index,
                instance,
                position: [positionX, positionY, positionZ],
                rotation: [rotationX, rotationY, rotationZ],
                scale: [scaleX, scaleY, scaleZ]
            })
        }
    }, [index, ready, instance, scaleX, scaleY, scaleZ])

    useFrame(() => {
        if (instance && typeof index === "number" && !fixed && ready) {
            setMatrixAt({
                index,
                instance,
                position: body.position.toArray(),
                rotation: body.quaternion.toArray(),
                scale: [scaleX, scaleY, scaleZ]
            })
        }
    })

    return [body, index] as const
}
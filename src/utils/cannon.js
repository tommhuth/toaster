import { World, Body, Vec3 } from "cannon"
import React, { useRef, useEffect, useState, useContext, useMemo } from "react"
import { useFrame, useThree } from "react-three-fiber"
//import Debug from "../Debug"

const context = React.createContext()

export function CannonProvider({
    children,
    iterations = 8,
    defaultRestitution = 0.2,
    defaultFriction = 0.025,
    gravity = [0, -10, 0],
}) {
    let { scene } = useThree()
    let [world] = useState(() => {
        return new World()
    })
    //let debug = useMemo(() => new Debug(scene, world), [])

    useEffect(() => {
        //world.broadphase = new SAPBroadphase(world)
        //world.broadphase.axisIndex = 0
        world.allowSleep = true
        world.quatNormalizeFast = true
        world.quatNormalizeSkip = 1
        world.solver.iterations = iterations
        world.defaultContactMaterial.friction = defaultFriction
        world.defaultContactMaterial.restitution = defaultRestitution
        world.defaultContactMaterial.contactEquationStiffness = 1e8
        world.defaultContactMaterial.contactEquationRegularizationTime = 6
        world.gravity.set(...gravity)

    }, [world])

    // Run world stepper every frame
    useFrame(() => {
        world.step(1 / 60)
        //debug.update()
    })

    // Distribute world via context
    return <context.Provider value={world}>{children}</context.Provider>
}

export function useWorld() {
    return useContext(context)
}

// Custom hook to maintain a world physics body
export function useCannon(
    {
        mass = 0,
        shape,
        userData = {},
        position = [0, 0, 0],
        velocity = [0, 0, 0],
        rotation = [0, 0, 0],
        linearFactor = [1, 1, 1],
        angularFactor = [1, 1, 1],
        linearDamping = 0.1,
        angularDamping = 0.1,
        collisionFilterGroup,
        collisionFilterMask,
        createContactMaterial,
        onCollide = () => { },
        onPreStep = () => { },
        onPostStep = () => { },
        material,
    },
    deps = []
) {
    let ref = useRef()
    let world = useContext(context)
    let body = useMemo(() => {
        let body = new Body({
            mass,
            shape,
            position: new Vec3(...position),
            velocity: new Vec3(...velocity),
            linearFactor: new Vec3(...linearFactor),
            angularFactor: new Vec3(...angularFactor),
            linearDamping,
            angularDamping,
            sleepSpeedLimit: 0.05,
            sleepTimeLimit: 2,
            allowSleep: true,
            collisionFilterGroup,
            collisionFilterMask,
            material: material || world.defaultMaterial,
        })

        return body
    }, [])

    useEffect(() => {
        body.userData = userData

        if (createContactMaterial) {
            let cm = createContactMaterial()

            world.addContactMaterial(cm)

            return () => (world.contactmaterials = world.contactmaterials.filter((i) => i !== cm))
        }
    }, [])

    useEffect(() => {
        body.addEventListener("collide", onCollide)

        return () => body.removeEventListener("collide", onCollide)
    }, deps)

    useEffect(() => {
        let pre = () => onPreStep(body)
        let post = () => onPostStep(body)

        world.addEventListener("preStep", pre)
        world.addEventListener("postStep", post)

        return () => {
            world.removeEventListener("preStep", pre)
            world.removeEventListener("postStep", post)
        }
    }, deps)

    useEffect(() => {
        let axis = new Vec3(...rotation.map((i) => (i === 0 ? 0 : 1)))
        let angle = rotation.find((i) => i) || 0

        body.quaternion.setFromAxisAngle(axis, angle)

        ref.current.position.copy(body.position)
        ref.current.quaternion.copy(body.quaternion)
        ref.current.matrixAutoUpdate = mass > 0
        ref.current.updateMatrix() 
    }, [])

    useEffect(() => {
        // Add body to world on mount
        world.addBody(body)

        // Remove body on unmount
        return () => world.removeBody(body)
    }, [body])

    useFrame(() => {
        if (ref.current && mass > 0) { 
            ref.current.position.copy(body.position)
            ref.current.quaternion.copy(body.quaternion)
        }
    })

    return { ref, body }
}
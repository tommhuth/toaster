import "../assets/styles/app.scss"

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react"
import ReactDOM from "react-dom"
import { Canvas, useThree, useFrame } from "react-three-fiber"
import { Vector3 } from "three"
import { CannonProvider, useCannon, useWorld } from "./cannon"
import { Box, Vec3, Sphere, Ray, RaycastResult, Material, ContactMaterial, PointToPointConstraint, Body } from "cannon"
import { v4 } from "uuid"
import animate from "./animate"


const cannonMaterial = {
    ball: new Material("ball"),
    player: new Material("player")
}

function Camera() {
    let { camera } = useThree()

    useEffect(() => {
        camera.lookAt(3, 0, 0)
    }, [])

    return null
}

function intersectBody(from, to, body) {
    let result = new RaycastResult()
    let ray = new Ray(
        new Vec3(...from),
        new Vec3(...to)
    )

    ray.intersectBody(body, result)

    return result
}

function useDefaultValue(value) {
    let first = useRef(true)

    useEffect(() => {
        first.current = false
    }, [])

    return first.current ? value : undefined
}

function Ball({ score, radius = .35, id }) {
    let [rotation] = useState(Math.random() * .75 + .05)
    let [speed] = useState(Math.random() * 6 + 13)
    let [x] = useState(-8)
    let world = useWorld()
    let defaultPosition = useDefaultValue([x, 1, 0])
    let { ref, body } = useCannon({
        mass: .001,
        velocity: [Math.cos(rotation) * speed, Math.sin(rotation) * speed, 0],
        position: [x, 1, 0],
        shape: new Sphere(radius),
        customData: { ball: true },
        active: true,
        material: cannonMaterial.ball
    })

    useEffect(() => {
        let cm = new ContactMaterial(world.defaultMaterial, body.material, {
            restitution: .85,
            friction: 0
        })

        world.addContactMaterial(cm)
    }, [])

    useFrame(() => {
        let xEdge = 15

        if (body.position.x > xEdge || body.position.x < -xEdge || body.position.y < 0) {
            console.log("remove")
            score(id)
        }
    })

    useEffect(() => {
        body.preStep = () => {
            body.velocity.z = 0
        }

        body.addEventListener("collide", e => {
            if (e.body.customData.player) {
                //console.log(e.body, e.contact)

            }
        })
    }, [body])

    return (
        <mesh ref={ref} position={defaultPosition}>
            <sphereBufferGeometry args={[radius, 16, 16]} attach="geometry" />
            <meshBasicMaterial color="yellow" attach="material" />
        </mesh>
    )
}



function Wall({ x }) {
    let { ref } = useCannon({
        position: [x, 5, 0],
        shape: new Box(new Vec3(.5, 5, 2)),
        customData: { wall: true },
        active: true
    })

    return (
        <mesh ref={ref}>
            <boxBufferGeometry args={[1, 10, 4]} attach="geometry" />
            <meshBasicMaterial color="darkgray" attach="material" />
        </mesh>
    )
}

function Goal({ x, depth = 4, height = 7, width = .75 }) {
    let { ref, body } = useCannon({
        position: [x, height / 2, 0],
        customData: { goal: true }
    })


    useEffect(() => {
        body.addShape(new Box(new Vec3(width / 2, height / 2, .35)), new Vec3(0, 0, depth / 2 + .35))
        body.addShape(new Box(new Vec3(width / 2, height / 2, .35)), new Vec3(0, 0, -depth / 2 - .35))

        body.addShape(new Box(new Vec3(width / 2 - .25, height / 2 - 2.5, depth / 2)), new Vec3(0, 2, 0))
    }, [])

    return (
        <mesh ref={ref}>
            <boxBufferGeometry args={[1, 1, 1]} attach="geometry" />
            <meshBasicMaterial color="black" opacity={0} transparent attach="material" />
        </mesh>
    )
}

function Floor({ y }) {
    let { ref } = useCannon({
        position: [0, y - 1, 0],
        shape: new Box(new Vec3(15, 1, 8)),
        customData: { floor: true },
        active: true
    })

    return (
        <mesh ref={ref}>
            <boxBufferGeometry args={[30, 2, 16]} attach="geometry" />
            <meshBasicMaterial color="gray" attach="material" />
        </mesh>
    )
}

function useKeyboard(actions, deps = []) {
    let active = useRef({})

    useFrame(() => {
        let keys = Object.keys(active.current)

        for (let key of keys) {
            let action = actions[key] || actions[key.replace("Key", "").replace("Digit", "")]

            if (action) {
                let { hold } = action

                if (hold) {
                    hold(active.current[key])
                }
            }
        }
    })

    useEffect(() => {
        let onKeyDown = e => {

            if (!active.current[e.code]) {
                let action = actions[e.code] || actions[e.code.replace("Key", "").replace("Digit", "")]

                active.current[e.code] = new Date()

                if (action) {
                    let { down = () => { } } = action

                    down()
                }
            }
        }
        let onKeyUp = e => {
            let action = actions[e.code] || actions[e.code.replace("Key", "").replace("Digit", "")]

            if (action) {
                let { up = () => { } } = action

                up(new Date() - active.current[e.code])
            }

            delete active.current[e.code]
        }

        window.addEventListener("keydown", onKeyDown)
        window.addEventListener("keyup", onKeyUp)

        return () => {
            window.removeEventListener("keydown", onKeyDown)
            window.removeEventListener("keyup", onKeyUp)
        }
    }, deps)
}

function Toast({ x, y, z, width = .2, height = 1.5, depth = 1, player }) {
    let { ref, body } = useCannon({
        mass: 1,
        position: [x, y, z],
        customData: { toast: true },
        material: cannonMaterial.player,
        shape: new Box(new Vec3(width / 2, height / 2, depth / 2))
    })

    useFrame(() => {
        let y = body.position.y < player.position.y + 1.35 / 2 && body.position.y > player.position.y - 1.35 / 2
        let x = body.position.x < player.position.x + 1.35 / 2 && body.position.x > player.position.x - 1.35 / 2
        let z = body.position.z < player.position.z + 1.5 / 2 && body.position.z > player.position.z - 1.5 / 2

        body.customData.loaded = x && y && z
    })

    return (
        <mesh ref={ref}>
            <boxBufferGeometry args={[width, height, depth]} attach="geometry" />
            <meshBasicMaterial color="black" attach="material" />
        </mesh>
    )
}

function Player({ width = 1.35, height = 1.35, depth = 1.5, y, x }) {
    let [canJump, setCanJump] = useState(false) 
    let world = useWorld()
    let tid = useRef()
    let { ref, body } = useCannon({
        mass: 125,
        position: [x, y, 0],
        customData: { player: true },
        active: true,
        material: cannonMaterial.player
    })

    useEffect(() => {
        let w = .15

        body.addShape(new Box(new Vec3(w / 2, height / 2, depth / 2)), new Vec3(-width / 2 + w / 2, 0, 0))
        body.addShape(new Box(new Vec3(w / 2, height / 2, depth / 2)), new Vec3(0, 0, 0))
        body.addShape(new Box(new Vec3(w / 2, height / 2, depth / 2)), new Vec3(width / 2 - w / 2, 0, 0))

        body.addShape(new Box(new Vec3(width / 2, height / 2, w / 2)), new Vec3(0, 0, -depth / 2 + w / 2))
        body.addShape(new Box(new Vec3(width / 2, height / 2, w / 2)), new Vec3(0, 0, depth / 2 - w / 2))

        body.addShape(new Box(new Vec3(width / 2, w / 2, depth / 2)), new Vec3(0, -height / 2 + w / 2, 0))
    }, [body])

    useEffect(() => {
        let cm = new ContactMaterial(cannonMaterial.ball, body.material, {
            restitution: 1.2,
            friction: 0
        })

        world.addContactMaterial(cm)


        body.preStep = () => {
            body.angularVelocity.z *= .9
        }
    }, [])

    useKeyboard({ 
        "Space": {
            down() {
                clearTimeout(tid.current)

                body.wakeUp()

                if (Math.abs(ref.current.rotation.z) > .5) {
                    body.velocity.x = 4 * Math.sign(ref.current.rotation.z)
                } else if (canJump) {
                    body.velocity.y = 7
                    setCanJump(false)
                }
            }
        },
        "S": {
            up(duration) {
                let vel = Math.max(.4, Math.min(duration / 250, 1)) * 8
                let toast = world.bodies.find(i => i.customData.toast && i.customData.loaded)

                if (toast) {
                    toast.wakeUp()
                    toast.velocity.y = vel
                }
            }
        },
        "A": {
            down() {
                if (!canJump || Math.abs(ref.current.rotation.z) > .5) {
                    return
                }

                body.wakeUp()
                body.velocity.y = 1.5
                clearTimeout(tid.current)

                tid.current = setTimeout(() => body.velocity.x = -2, 35)
            }
        },
        "D": {
            down() {
                if (!canJump || Math.abs(ref.current.rotation.z) > .5) {
                    return
                }

                body.wakeUp()
                body.velocity.y = 1.5
                clearTimeout(tid.current)
                tid.current = setTimeout(() => body.velocity.x = 2, 35)
            }
        }
    }, [canJump])


    // jump set on collision
    useEffect(() => {
        let listener = ({ body: target }) => {
            // if collieded body is below player,
            // we hit the "top" of the other body and can jump again
            let intersection = intersectBody(
                body.position.toArray(),
                [body.position.x, body.position.y - 50, body.position.z],
                target
            )

            if (intersection.hasHit && target.customData.floor) {
                setCanJump(true)
            }
        }

        body.addEventListener("collide", listener)

        return () => body.removeEventListener("collide", listener)

    }, [body])

    useEffect(() => {
        body.postStep = () => {
            body.angularVelocity.y = 0
            body.angularVelocity.x = 0
            body.velocity.z = 0
            body.force.setZero()
            body.torque.setZero()
        }
    }, [body])

    return (
        <>
            <Toast x={x + .25} y={y + .25} z={0} player={body} />
            <Toast x={x - .25} y={y + .25} z={0} player={body} />

            <mesh ref={ref}>
                <boxBufferGeometry args={[width, height, depth]} attach="geometry" />
                <meshBasicMaterial color="blue" transparent opacity={.51} attach="material" />
            </mesh>
        </>
    )
}

//  <Toast x={x - .25} y={y + .25} z={0} player={body}  />

function useInterval(cb, interval, leading = false) {
    useEffect(() => {
        let id = setInterval(() => {
            if (!document.hidden) {
                cb()
            }
        }, interval)

        if (leading) {
            cb()
        }

        return () => clearInterval(id)
    })
}

function App() {
    let [balls, setBalls] = useState([])
    let score = useCallback((id) => {
        setBalls(prev => prev.filter(i => i.id !== id))
    }, [])

    useInterval(() => {
        setBalls(prev => [...prev, {
            id: v4()
        }])
    }, 1000)

    return (
        <CannonProvider>

            {balls.map(i => <Ball score={score} key={i.id} {...i} />)}

            <Camera />
            <Player x={5} y={2} />
            <Floor y={0} />

            <Goal x={7.9} />
        </CannonProvider>
    )
}

// {balls.map(i => <Ball score={score} key={i.id} {...i} />)}

ReactDOM.render(
    <>
        <Canvas
            noEvents
            sRGB
            pixelRatio={.85}
            camera={{
                position: new Vector3(3, 4, 10),
                zoom: 1,
                fov: 75
            }}
        >
            <App />
        </Canvas>
    </>,
    document.getElementById("root")
)

/*

<mesh position={[0,0,0]}>
<planeBufferGeometry args={[10, 10]} attach="geometry" />
<meshBasicMaterial attach="material" transparent opacity={.8} color="purple" />
</mesh>

*/
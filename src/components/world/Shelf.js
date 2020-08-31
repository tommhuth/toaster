import React, { useEffect, useState } from "react"
import { useCannon } from "../../utils/cannon"
import { Box, Vec3 } from "cannon"
import { useFrame } from "react-three-fiber"
import { useStore } from "../../utils/store"
import { resource, useAsyncModel } from "../../utils/hooks"

let shelf = resource("shelf1")

function Shelf({
    x = 0,
    z = 0,
    y = 0,
    rotated = false,
    active = [1, 1, 1]
}) {
    let depth = 2
    let height = 7
    let width = 5
    let actions = useStore(state => state.actions)
    let legRadius = 0.15
    let [dead, setDead] = useState(false)
    let { ref, body } = useCannon({
        position: [x, height / 2 + y, z],
        mass: 20,
        rotation: rotated ? [0, Math.PI / 2, 0] : [0, 0, 0],
        userData: { shelf: true },
    })
    let geometry = useAsyncModel(shelf)

    useFrame(() => {
        if (!dead && ref.current.position.y < 3) {
            setDead(true)
            actions.end()
        }
    })

    useEffect(() => {
        body.addShape(
            new Box(new Vec3(legRadius, height / 2, legRadius)),
            new Vec3(width / 2, 0, depth / 2)
        )
        body.addShape(
            new Box(new Vec3(legRadius, height / 2, legRadius)),
            new Vec3(-width / 2, 0, depth / 2)
        )
        body.addShape(
            new Box(new Vec3(legRadius, height / 2, legRadius)),
            new Vec3(-width / 2, 0, -depth / 2)
        )
        body.addShape(
            new Box(new Vec3(legRadius, height / 2, legRadius)),
            new Vec3(width / 2, 0, -depth / 2)
        )

        body.addShape(
            new Box(new Vec3(width / 2 + legRadius, 0.1, depth / 2 + legRadius)),
            new Vec3(0, 0, 0)
        )
        body.addShape(
            new Box(new Vec3(width / 2 + legRadius, 0.1, depth / 2 + legRadius)),
            new Vec3(0, -height / 3, 0)
        )
        body.addShape(
            new Box(new Vec3(width / 2 + legRadius, 0.1, depth / 2 + legRadius)),
            new Vec3(0, height / 3, 0)
        )
    }, [])

    useEffect(() => {
        let y1 = y + height / 3 - 1
        let y2 = y + height * 0.66 - 1
        let y3 = y + height / 3 + height / 2 + 0.2
        let spaces = [
            {
                rotated,
                start: rotated ? [x, y1, z + width / 2 - .5] : [x - width / 2 + .5, y1, z],
                end: rotated ? [x, y1, z - width / 2 + .5] : [x + width / 2 - .5, y1, z],
                height: height / 3 - 0.2,
                size: 2,
            },
            {
                rotated,
                start: rotated ? [x, y2, z + width / 2 - .5] : [x - width / 2 + .5, y2, z],
                end: rotated ? [x, y2, z - width / 2 + .5] : [x + width / 2 - .5, y2, z],
                height: height / 3 - 0.2,
                size: 2,
            },
            {
                rotated,
                start: rotated ? [x, y3, z + width / 2 - .5] : [x - width / 2 + .5, y3, z],
                end: rotated ? [x, y3, z - width / 2 + .5] : [x + width / 2 - .5, y3, z],
                height: height / 2,
                size: 2,
            }
        ]

        actions.createSpaces(...spaces.filter((i, index) => active[index]))
    }, [])

    return (
        <mesh geometry={geometry} ref={ref} castShadow receiveShadow>
            <meshLambertMaterial color={0xffffff} attach="material" />
        </mesh>
    )
}

export default React.memo(Shelf)
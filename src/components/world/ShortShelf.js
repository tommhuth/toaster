import React, { useEffect } from "react"
import { useCannon } from "../../utils/cannon"
import { Box, Vec3 } from "cannon"
import { useStore } from "../../utils/store"
import { resource, useAsyncModel } from "../../utils/hooks"

let shelf = resource("shelf2")

function ShortShelf({
    x = 0,
    z = 0,
    y = 0,
    rotated = false
}) {
    let innerSize = 0.125
    let outerSize = 0.25
    let width = 5
    let height = 3
    let depth = 2.5
    let { ref, body } = useCannon({
        position: [x, y + height / 2 + outerSize / 2, z],
        mass: 20,
        userData: { shelf: true },
        rotation: [0, rotated ? Math.PI / 2 : 0, 0]
    })
    let geometry = useAsyncModel(shelf)
    let actions = useStore(i => i.actions)

    useEffect(() => {
        body.addShape(
            new Box(new Vec3(width / 2, outerSize / 2, depth / 2)),
            new Vec3(0, -height / 2, 0)
        )
        body.addShape(
            new Box(new Vec3(width / 2, outerSize / 2, depth / 2)),
            new Vec3(0, height / 2, 0)
        )

        body.addShape(
            new Box(new Vec3(width / 2, innerSize / 2, depth / 2 - innerSize)),
            new Vec3(0, 0, -innerSize)
        )

        body.addShape(
            new Box(new Vec3(outerSize / 2, height / 2, depth / 2)),
            new Vec3(-width / 2 + outerSize / 2, 0, 0)
        )
        body.addShape(
            new Box(new Vec3(outerSize / 2, height / 2, depth / 2)),
            new Vec3(width / 2 - outerSize / 2, 0, 0)
        )

        let y = height + outerSize / 2 + .1

        actions.createSpaces({
            rotated,
            start: rotated ? [x, y, z + width / 2 - .5] : [x - width / 2 + .5, y, z],
            end: rotated ? [x, y, z - width / 2 + .5] : [x + width / 2 - .5, y, z],
            height: 3,
            size: 2,
        })
    }, [])

    return (
        <mesh geometry={geometry} castShadow receiveShadow ref={ref}>
            <meshLambertMaterial
                color="#fff"
                attach="material"
                emissive={0xaaaaff}
                emissiveIntensity={.6}
            />
        </mesh>
    )
}

export default React.memo(ShortShelf)
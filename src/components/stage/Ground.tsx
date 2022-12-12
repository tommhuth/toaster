import { Box, Vec3 } from "cannon-es"
import { useMemo } from "react"
import { ObjectType } from "../../data/stages"
import { useStore } from "../../data/store"
import { Tuple3 } from "../../types"
import { useInstancedBody } from "../../utils/cannon"
import { useInstance } from "../InstancedMesh"

interface GroundProps {
    size?: Tuple3;
    position?: Tuple3;
}

function GroundElement({ size = [1, 1, 1], position = [0, 0, 0] }: GroundProps) {
    const definition = useMemo(() => {
        return new Box(new Vec3(size[0] / 2, size[1] / 2, size[2] / 2))
    }, [])
    const [index, instance] = useInstance(ObjectType.GROUND)

    useInstancedBody({
        definition,
        mass: 0,
        position: [position[0], position[1], position[2]],
        scale: size,
        index,
        instance,
        userData: { type: ObjectType.GROUND }
    }) 

    return null
}

export default function Ground() {
    let ground = useStore(i => i.stage.ground) 

    return (
        <>
            {ground.map((i, index) => {
                return <GroundElement key={i.id} {...i} index={index} />
            })}
        </>
    )
}
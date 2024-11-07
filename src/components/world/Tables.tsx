import { useLoader } from "@react-three/fiber"
import { Mesh } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { ObjectType } from "../../data/stages"
import { white } from "../../utils/materials"
import InstancedMesh from "../InstancedMesh"

const model = "/models/table.glb"

useLoader.preload(GLTFLoader, model)

export default function Tables() {
    let glb = useLoader(GLTFLoader, model)
    let mesh = glb?.scene.children[0] as Mesh

    return (
        <InstancedMesh count={10} name={ObjectType.TABLE}>
            <primitive attach="geometry" object={mesh?.geometry} />
            <primitive object={white} attach="material" />
        </InstancedMesh>
    )
}
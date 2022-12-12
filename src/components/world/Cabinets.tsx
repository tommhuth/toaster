import { useLoader } from "@react-three/fiber"
import { Mesh } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { ObjectType } from "../../data/stages"
import { white } from "../../utils/materials"
import InstancedMesh from "../InstancedMesh"

export default function Cabinets() {
    let glb = useLoader(GLTFLoader, "/models/shelf2.glb")
    let mesh = glb?.scene.children[0] as Mesh

    return (
        <InstancedMesh
            count={10}
            name={ObjectType.CABINET}
        >
            <primitive object={mesh.geometry} attach="geometry" />
            <primitive object={white} attach="material" />
        </InstancedMesh>
    )
}
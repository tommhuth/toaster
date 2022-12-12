import { ObjectType } from "../data/stages"
import { groundMaterial } from "../utils/materials"
import InstancedMesh from "./InstancedMesh"
import Cabinets from "./world/Cabinets"
import Chairs from "./world/Chairs"
import Plants from "./world/Plants"
import Shelves from "./world/Shelves"
import Tables from "./world/Tables"
import TableChairs from "./world/TablesChairs"

export default function World() {
    return (
        <>
            <InstancedMesh name={ObjectType.BOX} count={100}>
                <boxGeometry args={[1, 1, 1, 1, 1, 1]} />
                <meshLambertMaterial emissive={"red"} color="yellow" emissiveIntensity={.35} />
            </InstancedMesh>

            <InstancedMesh
                name={ObjectType.GROUND}
                count={100}
            >
                <boxGeometry args={[1, 1, 1, 1, 1, 1]} />
                <primitive object={groundMaterial} attach="material" />
            </InstancedMesh>

            <Cabinets />
            <Chairs />
            <Plants />
            <Shelves />
            <TableChairs />
            <Tables />
        </>
    )
}
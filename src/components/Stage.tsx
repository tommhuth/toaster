import Boxes from "./stage/Boxes"
import Cabinets from "./stage/Cabinets"
import Chairs from "./stage/Chairs"
import Plants from "./stage/Plants"
import Shelves from "./stage/Shelves"
import TableChairs from "./stage/TableChairs"
import Tables from "./stage/Tables"
import Ground from "./stage/Ground" 

export default function Stage() { 
    return (
        <>
            <Boxes />
            <Ground />
            <Tables />
            <TableChairs />
            <Shelves />
            <Chairs />
            <Cabinets />
            <Plants />
        </>
    )
}
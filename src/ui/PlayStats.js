import React  from "react" 
import { useStore } from "../utils/store"  
 

export function ArrowLeft() {
    return (
        <svg viewBox="0 0 24 22">
            <path d="M19 11H7.39l4-3.95a1 1 0 00-1.46-1.41l-5.66 5.65a1 1 0 000 1.42l5.66 5.65A1 1 0 1011.34 17l-3.95-4H19a1 1 0 000-2z"></path>
        </svg>
    )
} 

export default function PlayStats() {
    let map = useStore(i => i.data.map)
    let score = useStore(i => i.data.score)
    let objects = useStore(i => i.data.objects)
    let balls = useStore(i => i.data.balls)
    let reset = useStore(i => i.actions.reset)

    return (
        <div className="uir">
            <button onClick={reset} className="uir__back">
                <ArrowLeft />
            </button> 
            <p className="h2c">{map?.name} <strong>Level 1</strong></p>
            <div className="uir__stats">
                <p className="h2c"><strong>{balls} balls</strong></p>
                <p className="h2c"><strong>{objects - score} remaining</strong></p>
            </div>
        </div>
    )
}
  
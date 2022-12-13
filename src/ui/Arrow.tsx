export default function Arrow({ direction = "right", strokeWidth = 6 }) {
    return (
        <svg viewBox="0 0 100 50" style={{ overflow: "visible", width: ".85em", display: "block" }}>
            <line
                x1={0}
                x2={100}
                y1={25}
                y2={25}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />

            <line
                x1={direction == "right" ? 75 : 25}
                x2={direction == "right" ? 100 : 0}
                y1={50 * .1}
                y2={25}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            <line
                x1={direction == "right" ? 75 : 25}
                x2={direction == "right" ? 100 : 0}
                y1={50 * .9}
                y2={25}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
        </svg>
    )
}
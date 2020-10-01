
import React, { useRef, useEffect, useState } from "react"
import { useStore, api } from "../utils/store"
import State from "../utils/const/State"
import { ArrowLeft } from "./PlayStats"

function Icon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 95 36"
        >
            <g  >
                <path
                    fillRule="nonzero"
                    d="M21.23 4.02L17.66 0.45 0.12 18 17.66 35.55 21.23 31.98 9.77 20.52 94.32 20.52 94.32 15.48 9.77 15.48z"
                ></path>
            </g>
        </svg>
    )
}

export default function Cursor() {
    let pointer = useRef()
    let line = useRef()
    let cursorSize = 14
    let state = useStore(i => i.data.state)
    let [[width, height], setSize] = useState([window.innerWidth, window.innerHeight])
    let [icon, setIcon] = useState()
    let [hover, setHover] = useState(false)

    useEffect(() => {
        return api.subscribe(launcher => {
            if (launcher.active) {
                line.current.style.display = "block"
                line.current.setAttribute("x1", launcher.start[0])
                line.current.setAttribute("y1", launcher.start[1])
                line.current.setAttribute("x2", launcher.end[0])
                line.current.setAttribute("y2", launcher.end[1])
            } else {
                line.current.style.display = "none"
            }
        }, state => state.data.launcher)
    }, [])

    useEffect(() => {
        let onResize = () => {
            setSize([window.innerWidth, window.innerHeight])
        }

        window.addEventListener("resize", onResize)

        return () => {
            window.removeEventListener("resize", onResize)
        }
    }, [])

    useEffect(() => {
        if (state === State.PLAYING) {
            let onMouseDown = () => {
                pointer.current.style.backgroundColor = "#FFF"
            }
            let onMouseUp = () => {
                pointer.current.style.backgroundColor = ""
            }

            window.addEventListener("mousedown", onMouseDown)
            window.addEventListener("mouseup", onMouseUp)

            return () => {
                window.removeEventListener("mousedown", onMouseDown)
                window.removeEventListener("mouseup", onMouseUp)
            }
        }
    }, [state])

    useEffect(() => {
        let onMouseMove = e => {
            pointer.current.style.display = "block"
            pointer.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
        }
        let onMouseEnter = () => {
            pointer.current.style.display = "block"
        }
        let onMouseLeave = () => {
            pointer.current.style.display = "none"
        }
        let onMouseEnterCapture = e => {
            if (activators.includes(e.target.tagName) || e.target.classList.contains("actionable")) {
                let icon = e.target.dataset.cursorIcon

                if (!icon) {
                    setHover(true)
                }

                setIcon(e.target.dataset.cursorIcon)
            }
        }
        let onMouseLeaveCapture = e => {
            if (activators.includes(e.target.tagName) || e.target.classList.contains("actionable")) {
                setHover(false) 
                setIcon("")
            }
        }
        let onClick = () => {
            setHover(false)
            setIcon("")
        }
        let activators = ["BUTTON", "A"]

        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("click", onClick)
        document.body.addEventListener("mouseleave", onMouseLeave)
        document.body.addEventListener("mouseenter", onMouseEnter)
        document.body.addEventListener("mouseenter", onMouseEnterCapture, { capture: true })
        document.body.addEventListener("mouseleave", onMouseLeaveCapture, { capture: true })

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("click", onClick)
            document.body.removeEventListener("mouseenter", onMouseEnter)
            document.body.removeEventListener("mouseleave", onMouseLeave)
            document.body.removeEventListener("mouseenter", onMouseEnterCapture)
            document.body.removeEventListener("mouseleave", onMouseLeaveCapture)
        }
    }, [icon])

    return (
        <>
            <div
                ref={pointer}
                className="pointer"
                style={{
                    position: "fixed",
                    display: "none",
                    transition: "width .3s, height .3s",
                    zIndex: 10000000,
                    pointerEvents: "none",
                    border: icon ? "" : "2px solid #FFF",
                    top: 0,
                    left: 0,
                    backgroundColor: hover ? "white" : "transparent",
                    borderRadius: icon ? "" : "50%",
                    width: icon ? "auto" : hover ? cursorSize * 2.5 : "14px",
                    height: icon ? "auto" : hover ? cursorSize * 2.5 : "14px",
                    color: "#FFF"
                }}
            >
                {icon ? <Icon /> : null}
            </div>
            <svg className="cursor-overlay" viewBox={`0 0 ${width} ${height}`}>
                <line
                    strokeWidth="3"
                    stroke="white"
                    strokeDasharray="4 4"
                    ref={line}
                />
            </svg>
        </>
    )
}

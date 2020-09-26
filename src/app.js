import "../assets/styles/app.scss"

import React, { useRef, useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { Canvas, useThree } from "react-three-fiber"
import { useStore, api } from "./utils/store"
import { useAnimationFrame } from "./utils/hooks"
import { Suspense } from "react"
import Lights from "./components/Lights"
import Post from "./components/Post"
import { CannonProvider } from "./utils/cannon"
import Camera from "./components/Camera"
import Stage from "./components/Stage"
import Only from "./components/Only"
import WorldBlock from "./components/world/WorldBlock"
import State from "./utils/const/State"
import maps, { initialMap } from "./utils/maps"
import FontLoader from "./components/FontLoader"
import { convert } from "number-words"

function ArrowLeft() {
    return (
        <svg viewBox="0 0 24 22">
            <path d="M19 11H7.39l4-3.95a1 1 0 00-1.46-1.41l-5.66 5.65a1 1 0 000 1.42l5.66 5.65A1 1 0 1011.34 17l-3.95-4H19a1 1 0 000-2z"></path>
        </svg>
    )
}

function MapSelect() {
    let scroller = useRef()
    let y = useRef(0)
    let targetY = useRef(0)
    let [active, setActive] = useState(0)
    let scrolling = useRef(true)
    let actions = useStore(i => i.actions)
    let map = useStore(i => i.data.map)
    let { camera } = useThree()

    useAnimationFrame(() => {
        scroller.current.style.transform = `translateY(${y.current}px)`
        scrolling.current = Math.abs(targetY.current - y.current) > 10

        if (Math.abs(targetY.current - y.current) < 1) {
            y.current = targetY.current
        } else {
            y.current += (targetY.current - y.current) * .04
        }
    })

    useEffect(() => {
        if (active - 1 >= 0 && map !== maps[active - 1]) {
            //camera.position.set(20,10,5)
            actions.loadMap(maps[active - 1])
        } else {
            actions.loadMap(initialMap)
        }
    }, [active, camera])

    useEffect(() => {
        targetY.current = -active * window.innerHeight
    }, [active])

    useEffect(() => {
        let id
        let started = false
        let onWheel = e => {
            if (scrolling.current) {
                return
            }

            if (!started) {
                started = true

                setActive(prev => {
                    let next = prev

                    if (e.deltaY > 0) {
                        next += next < maps.length ? 1 : 0
                    } else {
                        next -= next > 0 ? 1 : 0
                    }

                    return next
                })
            }

            clearTimeout(id)
            id = setTimeout(() => started = false, 50)
        }

        window.addEventListener("wheel", onWheel, { passive: false })

        return () => window.removeEventListener("wheel", onWheel)
    }, [])

    return (
        <>
            <div
                ref={scroller}
                className="page"
                id="page"
            >
                <div className="block start">
                    <h1 className="h2b">
                        <span className="f">Ball</span>
                        <span className="f">versus</span>
                        <span className="f">furniture</span>
                    </h1>
                </div>
                {maps.map((i, index) => {
                    return (
                        <div
                            key={index}
                            className="block"
                            onClick={() => actions.play()}
                        >
                            <p className="h3">Level {index + 1}</p>
                            <h2 className="h2">{i.name}</h2>
                        </div>
                    )
                })}
            </div>
            <ul className={"dots " + (active >= 1 ? "a" : "")}>
                {new Array(maps.length).fill().map((i, index) => (
                    <li
                        onClick={(e) => {
                            e.stopPropagation()
                            setActive(index + 1)
                        }}
                        style={{
                            "--dotdelay": (index * .2 + 1.5) + "s"
                        }}
                        className={index === active - 1 ? "a" : ""}
                        key={index}
                    />
                ))}
            </ul>
        </>
    )
}

function Cursor() {
    let pointer = useRef()
    let line = useRef()
    let cursorSize = 14
    let state = useStore(i => i.data.state)

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
            if (activators.includes(e.target.tagName) || e.target.classList.contains(".actionable")) {
                pointer.current.style.width = cursorSize * 2.5 + "px"
                pointer.current.style.height = cursorSize * 2.5 + "px"
                pointer.current.style.backgroundColor = "white"

            }
        }
        let onMouseLeaveCapture = e => {
            if (activators.includes(e.target.tagName) || e.target.classList.contains(".actionable")) {
                pointer.current.style.width = ""
                pointer.current.style.height = ""
                pointer.current.style.backgroundColor = ""
            }
        }
        let onClick = () => {
            pointer.current.style.width = ""
            pointer.current.style.height = ""
            pointer.current.style.backgroundColor = ""
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
    }, [])

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
                    backgroundColor: "transparent",
                    border: "2px solid #FFF", 
                    top: 0,
                    left: 0,
                    borderRadius: "50%"
                }}
            />
            <svg className="cursor-overlay" viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
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

function PlayStats() {
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
            <div className="uir__text">
                <p className="uir__text__inner">
                    {generateMapText(map, objects)}
                </p>
            </div>
            <p className="h2c">{map?.name} <strong>Level 1</strong></p>
            <div className="uir__stats">
                <p className="h2c"><strong>{balls} balls</strong></p>
                <p className="h2c"><strong>{objects - score} remaining</strong></p>
            </div>
        </div>
    )
}

function generateMapText(map, objects) {
    let text = `Knock down all ${convert(objects)} objects`
    let illegals = map?.elements.filter(i => i.untouchable).map(i => i.type)
    let itext = `and avoid the illegal ${illegals?.join(", ")}.`

    return (
        <>
            {text}{illegals?.length ? <>,<br />{itext}</> : "."}
        </>
    )
}

function Ui() {
    let state = useStore(i => i.data.state)

    return (
        <>
            <Only if={[State.INTRO, State.READY, State.PREPARING].includes(state)}>
                <MapSelect />
            </Only>
            <Only if={state === State.GAME_OVER}>
                <h1 className="h1">
                    Game 
                    <span>over</span>
                </h1>
            </Only>
            <Only if={state === State.PLAYING}>
                <PlayStats />
            </Only>

            <Cursor />
        </>
    )
}

function Game() {
    let map = useStore(i => i.data.map)
    let attempts = useStore(i => i.data.attempts)

    return (
        <FontLoader>
            <Ui />
            <Canvas
                noEvents
                colorManagement
                shadowMap
                orthographic
                pixelRatio={1.5}
                gl={{
                    stencil: false,
                    depth: false,
                    alpha: true,
                    antialias: false,

                }}
                camera={{
                    zoom: 45,
                    fov: 60,
                    near: -20,
                    far: 50,
                }}
            >
                <Lights />
                <Camera />

                <Suspense fallback={null}>
                    <Post />
                </Suspense>

                <CannonProvider>
                    {map ? <Stage {...map} key={attempts} /> : null}

                    <WorldBlock isFloor y={-2} width={200} height={4} depth={200} z={0} />
                </CannonProvider>
            </Canvas>
        </FontLoader>
    )
}

ReactDOM.render(<Game />, document.getElementById("root"))
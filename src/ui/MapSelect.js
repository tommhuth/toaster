 

import React, { useRef, useEffect, useState } from "react" 
import { Canvas, useThree } from "react-three-fiber"
import { useStore, api } from "../utils/store"
import { useAnimationFrame } from "../utils/hooks" 
import maps, { initialMap } from "../utils/maps" 
  

export  default function MapSelect() {
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
                            className="block actionable"
                            data-cursor-icon="arrow"
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
 
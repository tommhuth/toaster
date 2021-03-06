import React, { useEffect, useMemo, useState, useCallback } from "react"
import FontFaceObserver from "fontfaceobserver"

export default function FontLoader({
    children
}) {
    let fonts = useMemo(() => {
        return Promise.all([ 
            new FontFaceObserver("Oswald", { weight: 500 }).load(),
            new FontFaceObserver("Cormorant Garamond", { weight: 300, style: "italic" }).load()
        ])
    }, [])
    let [loading, setLoading] = useState(true)
    let load = useCallback(async () => {
        try {
            await fonts 
        } catch (e) {
            // do nothing
        } finally {
            // kill basic spinner 
            document.getElementById("spinner").remove()
            setLoading(false)
        }
    })

    useEffect(() => {
        load()
    }, [])

    return !loading ? <>{children}</> : null
}
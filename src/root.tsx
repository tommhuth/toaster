import "../assets/styles/app.scss"

import { createRoot } from "react-dom/client"
import { lazy } from "react"
import UI from "./ui/UI"
import { Workbox } from "workbox-window"
import Config from "./Config"

const App = lazy(() => import("./App")) 
const root = createRoot(document.getElementById("canvas"))

root.render(
    <>
        <UI />
        <App />
    </>
)

if (Config.REGISTER_SERVICEWORKER) {
    let worker = new Workbox("/serviceworker.js")

    worker.addEventListener("installed", e => {
        console.info(`Service worker ${e.isUpdate ? "updated" : "installed"}`)
    })
    worker.register()
}
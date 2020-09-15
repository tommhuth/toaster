// based off easings.net and https://gist.github.com/gre/1650294
const easingFunction = {
    // no easing, no acceleration
    linear: t => t,
    // accelerating from zero velocity
    easeInQuad: t => t * t,
    // decelerating to zero velocity
    easeOutQuad: t => t * (2 - t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    // accelerating from zero velocity 
    easeInCubic: t => t * t * t,
    // decelerating to zero velocity 
    easeOutCubic: t => (--t) * t * t + 1,
    // acceleration until halfway, then deceleration 
    easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    // accelerating from zero velocity 
    easeInQuart: t => t * t * t * t,
    // decelerating to zero velocity 
    easeOutQuart: t => 1 - (--t) * t * t * t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    // accelerating from zero velocity
    easeInQuint: t => t * t * t * t * t,
    // decelerating to zero velocity
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    // acceleration until halfway, then deceleration 
    easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
    easeInSin: (t) => 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2),
    easeOutSin: (t) => Math.sin(Math.PI / 2 * t),
    easeInOutSin: (t) => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2,
    easeOutCirc: (x) => Math.sqrt(1 - Math.pow(x - 1, 2)),
    easeInCirc: (x) => 1 - Math.sqrt(1 - Math.pow(x, 2)),
    easeInOutCirc: (x) => {
        return x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
    }
}

// https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
function lerpColor(a, b, amount) {
    let ah = +a.replace("#", "0x"),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = +b.replace("#", "0x"),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab)

    return "#" + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1)
}

function parse(from, to, t) {
    if (typeof from === "number") {
        return from + (to - from) * t
    } else if (typeof from === "string" && from.includes("#")) {
        return lerpColor(from, to, t)
    } else {
        throw new Error("Unknown type: " + from)
    }
}

// https://medium.com/allenhwkim/animate-with-javascript-eef772f1f3f3
export default function animate({
    from,
    to,
    duration = 1000,
    delay = 0,
    render = () => { },
    start = () => { },
    end = () => { },
    cancel = () => { },
    easing = "linear"
}) {
    let timingFunction = typeof easing === "function" ? easing : easingFunction[easing]
    let now = performance.now()
    let hasStarted = false
    let id
    let params = Object.keys(from)
    let tick = (time) => {
        if (time - now > delay) {
            let timeFraction = Math.max(Math.min((time - delay - now) / duration, 1), 0)

            if (!hasStarted) {
                hasStarted = true
                timeFraction = 0
                start()
            }

            let t = timingFunction(timeFraction)
            let interpolated = {}

            if (typeof from === "object") {
                for (let key of params) {
                    interpolated[key] = parse(from[key], to[key], t)
                }
            } else {
                interpolated = parse(from, to, t)
            }

            render(interpolated)

            if (timeFraction < 1) {
                id = requestAnimationFrame(tick)
            } else if (timeFraction === 1) {
                end()
            }
        } else {
            id = requestAnimationFrame(tick)
        }
    }

    id = requestAnimationFrame(tick)

    return () => {
        window.cancelAnimationFrame(id)
        cancel()
    }
}
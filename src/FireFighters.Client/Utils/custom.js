/* eslint-disable import/prefer-default-export */

// eslint-disable-next-line no-unused-vars
import * as alt from 'alt-client'

export function translateTimeLeft(date = new Date()) {
    const timestamp = +date - +new Date()

    const totalSeconds = Math.floor(timestamp / 1000)
    const totalMinutes = Math.floor(totalSeconds / 60)
    const totalHours = Math.floor(totalMinutes / 60)
    const d = Math.floor(totalHours / 24)
    const s = totalSeconds % 60
    const m = totalMinutes % 60
    const h = totalHours % 24

    return `${d > 0 ? `${d} Tag${d !== 1 ? 'e' : ''}${h > 0 ? ', ' : ''}` : ''}${
        h > 0 ? `${h} Stunde${h !== 1 ? 'n' : ''}${m > 0 ? ', ' : ''}` : ''
    }${m > 0 ? `${m} Minute${m !== 1 ? 'n' : ''}${s > 0 ? ', ' : ''}` : ''}${
        s > 0 ? `${s} Sekunde${s !== 1 ? 'n' : ''}` : ''
    }`
}

// eslint-disable-next-line no-unused-vars
import * as alt from 'alt-client'
import * as natives from 'natives'

/**
 *
 * @param {alt.Vector3} vector1
 * @param {alt.Vector3} vector2
 */
export function distance(vector1, vector2) {
    if (!vector1 || !vector2) {
        throw new Error('AddVector => vector1 or vector2 is undefined')
    }

    return Math.sqrt((vector1.x - vector2.x) ** 2 + (vector1.y - vector2.y) ** 2 + (vector1.z - vector2.z) ** 2)
}

/**
 *
 * @param {number} degrees
 */
export function degToRad(degrees) {
    return (degrees * Math.PI) / 180
}

/**
 *
 * @param {number} radians
 */
export function radToDeg(radians) {
    return (radians * 180) / Math.PI
}

/**
 *
 * @param {alt.Vector3} vector
 */
function normalizeVector(vector) {
    const mag = natives.vmag(vector.x, vector.y, vector.z)

    return { x: vector.x / mag, y: vector.y / mag, z: vector.z / mag }
}

/**
 *
 * @param {alt.Vector3} rotation
 */
export function rotAnglesToVector(rotation) {
    const z = degToRad(rotation.z)
    const x = degToRad(rotation.x)
    const num = Math.abs(Math.cos(x))

    return { x: -(Math.sin(z) * num), y: Math.cos(z) * num, z: Math.sin(x) }
}

/**
 *
 * @param {alt.Vector3} vector
 */
export function vectorToRotAngles(vector) {
    const normalizedVector = normalizeVector(vector)
    const ax = radToDeg(Math.asinh(normalizedVector.z))
    const az = radToDeg(Math.atan2(normalizedVector.x, normalizedVector.y))

    return { x: ax, y: 0, z: -az }
}

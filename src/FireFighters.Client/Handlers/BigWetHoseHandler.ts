import * as alt from 'alt-client'
import * as natives from 'natives'
import * as AsyncHelper from '../Utils/AsyncHelper'
import * as Vectors from '../Utils/Vectors'

const ptfxAsset = 'core'
const waterJetPtfx = 'water_cannon_jet'
const waterSprayPtfx = 'water_cannon_spray'

alt.on('connectionComplete', async () => {
    await AsyncHelper.RequestNamedPtfxAsset(waterJetPtfx)
    await AsyncHelper.RequestNamedPtfxAsset(waterSprayPtfx)
})

let fireHoseInterval: number = null
let jetEffect: number = null
let sprayEffect: number = null

alt.on('keyup', (key: number) => {
    if (key === 107) { // Num+
        if (!fireHoseInterval) {
            natives.useParticleFxAsset(ptfxAsset)

            jetEffect = natives.startParticleFxLoopedOnEntity(waterJetPtfx, alt.Player.local.scriptID, 10, 0, 0, 0.1, 0, 0, 1, false, false, false)
            sprayEffect = natives.startParticleFxLoopedOnEntity(waterSprayPtfx, alt.Player.local.scriptID, 10, 0, 0, 0.1, 0, 0, 1, false, false, false)
            
            fireHoseInterval = alt.everyTick(fireHoseTickHandler)
        } else {
            alt.clearEveryTick(fireHoseInterval)
            fireHoseInterval = null

            natives.stopParticleFxLooped(jetEffect, false)
            natives.stopParticleFxLooped(sprayEffect, false)

            jetEffect = null
            sprayEffect = null
        }
    }
})

const fireHoseTickHandler = () => {
    natives.setParticleFxLoopedOffsets(jetEffect, 0, 0, 0, natives.getGameplayCamRelativePitch(), 0, 0)
    natives.setParticleFxLoopedOffsets(sprayEffect, 0, 8, 0, 0, 0, 0)
    /*
    const pPos = alt.Player.local.pos

    const forwardVector = natives.getEntityForwardVector(alt.Player.local.scriptID)
    const forwardVectorMultiplied = Vectors.multiply(forwardVector, 5)
    const target = Vectors.add(alt.Player.local.pos, forwardVectorMultiplied)

    natives.drawLine(pPos.x, pPos.y, pPos.z, target.x, target.y, target.z, 255, 0, 0, 255)

    // weapon_fireextinguisher: 0x60EC506
    // vehicle_weapon_water_cannon: 0x67D18297
    // weapon_hit_by_water_cannon: 0xCC34325E
    // damage type 14: water

    natives.shootSingleBulletBetweenCoords(pPos.x, pPos.y, pPos.z, target.x, target.y, target.z, 1, false, 0xCC34325E, alt.Player.local.scriptID, true, false, 100)

    //natives.shootSingleBulletBetweenCoordsIgnoreEntity(pPos.x, pPos.y, pPos.z, target.x, target.y, target.z, 14, false, 0x67D18297, alt.Player.local.scriptID, true, false, 100, alt.Player.local.scriptID, undefined)
    */
}
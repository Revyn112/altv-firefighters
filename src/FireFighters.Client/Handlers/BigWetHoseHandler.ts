import * as alt from 'alt-client'
import * as natives from 'natives'
import * as AsyncHelper from '../Utils/AsyncHelper'

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
            jetEffect = natives.startNetworkedParticleFxLoopedOnEntity(waterJetPtfx, alt.Player.local.scriptID, 10, 0, 0, 0.1, 0, 0, 1, false, false, false, undefined, undefined, undefined, undefined)
            sprayEffect = natives.startNetworkedParticleFxLoopedOnEntity(waterSprayPtfx, alt.Player.local.scriptID, 10, 0, 0, 0.1, 0, 0, 1, false, false, false, undefined, undefined, undefined, undefined)

            fireHoseInterval = alt.everyTick(fireHoseTickHandler)
        } else {
            alt.clearEveryTick(fireHoseInterval)

            natives.stopParticleFxLooped(jetEffect, false)
            natives.stopParticleFxLooped(sprayEffect, false)

            fireHoseInterval = null
            jetEffect = null
            sprayEffect = null
        }
    }
})

const fireHoseTickHandler = () => {
    natives.setParticleFxLoopedOffsets(jetEffect, 0, 0, 0, natives.getGameplayCamRelativePitch(), 0, 0)
    natives.setParticleFxLoopedOffsets(sprayEffect, 0, 8, 0, 0, 0, 0)
}
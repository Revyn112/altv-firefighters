import * as alt from 'alt-client'
import * as natives from 'natives'
import * as AsyncHelper from '../Utils/AsyncHelper'
import * as Vectors from '../Utils/Vectors'

class ClientFire {
    public EmbersSmokeHandle: number
    public FireSmokeHandle: number

    public IsGasFire: boolean
    public FlamesSpawned: boolean

    public Position: alt.Vector3
}

var fires: ClientFire[] = []
const EntityTypeFire = 3
const EntitySyncFireRange = 500
const FireSmokeSize = 8

alt.onServer("entitySync:create", async (entityId: number, entityType: number, position: alt.Vector3, newEntityData: any) => {
    if (entityType !== EntityTypeFire)
        return;

    alt.log('entitySync:create (fire)')
    alt.log(entityId)
    alt.log(entityType)
    alt.log(position)
    alt.log(newEntityData)

    if (newEntityData) {
        let fire = new ClientFire()
        fire.Position = position
        fire.IsGasFire = newEntityData.isGasFire

        fires[entityId] = fire;

        await startFireAtClient(fire)
    } else {
        let restoredFire = fires[entityId]

        await startFireAtClient(restoredFire)
    }
})

alt.onServer("entitySync:remove", (entityId, entityType) => {
    if (entityType !== EntityTypeFire)
        return;

    if (fires.hasOwnProperty(entityId)) {
        stopFireAtClient(fires[entityId])
    }
})

alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
    if (entityType !== EntityTypeFire)
        return;

    if (fires.hasOwnProperty(entityId)) {
        fires[entityId].Position = position;
    }
})

alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
    if (entityType !== EntityTypeFire)
        return;

    if (newEntityData.hasOwnProperty("isGasFire") && fires.hasOwnProperty(entityId))
        fires[entityId].IsGasFire = newEntityData.isGasFire;
})

alt.onServer("entitySync:clearCache", (entityId, entityType) => {
    if (entityType !== EntityTypeFire)
        return;

    if (fires.hasOwnProperty(entityId)) {
        stopFireAtClient(fires[entityId])
        
        delete fires[entityId];
    }
})

alt.onServer("entitySync:netOwner", (entityId, entityType, isNetOwner) => {
    //...
})


alt.onServer('FireFighters:Fire:NewStarted', async (position: alt.Vector3, explosion: boolean) => {
    if (explosion && Vectors.distance(alt.Player.local.pos, position) <= EntitySyncFireRange) {
        natives.shakeGameplayCam("MEDIUM_EXPLOSION_SHAKE", 1)
        await AsyncHelper.RequestNamedPtfxAsset("scr_trevor3")
        natives.startParticleFxNonLoopedAtCoord("scr_trev3_trailer_expolsion", position.x, position.y, position.z + 1, 0, 0, 0, 1, false, false, false)
        natives.playSoundFromCoord(-1, "MAIN_EXPLOSION_CHEAP", position.x, position.y, position.z, '', false, EntitySyncFireRange, false)
    }
})

alt.onServer('FireFighters:Fire:FlamesSpawning', (entityId: number) => {
    if (!fires.hasOwnProperty(entityId))
        return

    fires[entityId].FlamesSpawned = true

    if (fires[entityId].EmbersSmokeHandle != null) {
        fires[entityId].FireSmokeHandle = natives.startParticleFxLoopedAtCoord("scr_env_agency3b_smoke", fires[entityId].Position.x, fires[entityId].Position.y, fires[entityId].Position.z, 0, 0, 0, FireSmokeSize, false, false, false, false)
    }

})

const startFireAtClient = async (fire: ClientFire) => {
    if (!fire || !fire.Position) return


    await AsyncHelper.RequestNamedPtfxAsset("scr_agencyheistb")
    natives.useParticleFxAsset("scr_agencyheistb")

    fire.EmbersSmokeHandle = natives.startParticleFxLoopedAtCoord("scr_env_agency3b_smoke", fire.Position.x, fire.Position.y, fire.Position.z, 0, 0, 0, 0.3, false, false, false, false)

    if (fire.FlamesSpawned) {
        fire.FireSmokeHandle = natives.startParticleFxLoopedAtCoord("scr_env_agency3b_smoke", fire.Position.x, fire.Position.y, fire.Position.z, 0, 0, 0, FireSmokeSize, false, false, false, false)
    }
}

const stopFireAtClient = (fire: ClientFire) => {
    if (!fire) return

    if (fire.EmbersSmokeHandle) {
        natives.stopParticleFxLooped(fire.EmbersSmokeHandle, false)
        fire.EmbersSmokeHandle = null;
    }

    if (fire.FireSmokeHandle != null) {
        natives.stopParticleFxLooped(fire.FireSmokeHandle, false)
        fire.FireSmokeHandle = null;
    }
}
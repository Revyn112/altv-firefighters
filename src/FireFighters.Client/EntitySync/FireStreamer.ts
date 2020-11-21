import * as alt from 'alt-client'
import * as natives from 'natives'
import * as AsyncHelper from '../Utils/AsyncHelper'
import * as Vectors from '../Utils/Vectors'

class ClientFire {
    public EmbersSmokeHandle: number
    public FireSmokeHandle: number

    public IsGasFire: boolean
    public FlamesSpawned: boolean
    public Explosion: boolean

    public Position: alt.Vector3
}

var entities: ClientFire[] = []
const EntityType = 3
const EntitySyncRange = 500
const FireSmokeSize = 8

alt.onServer("entitySync:create", async (entityId: number, entityType: number, position: alt.Vector3, newEntityData: any) => {
    if (entityType !== EntityType)
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
        fire.Explosion = newEntityData.explosionOnStart

        entities[entityId] = fire;

        await spawnEntityAtClient(fire)
    } else {
        let restoredFire = entities[entityId]

        await spawnEntityAtClient(restoredFire)
    }
})

alt.onServer("entitySync:remove", (entityId, entityType) => {
    if (entityType !== EntityType)
        return;

    if (entities.hasOwnProperty(entityId)) {
        removeEntityAtClient(entities[entityId])
    }
})

alt.onServer("entitySync:updatePosition", async (entityId, entityType, position) => {
    if (entityType !== EntityType)
        return;

    if (entities.hasOwnProperty(entityId) && entities[entityId].Position != position) {
        entities[entityId].Position = position

        if (Vectors.distance(alt.Player.local.pos, position) <= EntitySyncRange) {
            removeEntityAtClient(entities[entityId])
            await spawnEntityAtClient(entities[entityId])
        }
    }
})

alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
    if (entityType !== EntityType || !entities.hasOwnProperty(entityId))
        return;

    if (newEntityData.hasOwnProperty("isGasFire"))
        entities[entityId].IsGasFire = newEntityData.isGasFire;

    if (newEntityData.hasOwnProperty("explosionOnStart"))
        entities[entityId].Explosion = newEntityData.explosionOnStart;
})

alt.onServer("entitySync:clearCache", (entityId, entityType) => {
    if (entityType !== EntityType)
        return;

    if (entities.hasOwnProperty(entityId)) {
        removeEntityAtClient(entities[entityId])
        
        delete entities[entityId];
    }
})

alt.onServer("entitySync:netOwner", (entityId, entityType, isNetOwner) => {
    //...
})


alt.onServer('FireFighters:Fire:NewStarted', async (entityId: number) => {
    if (!entities.hasOwnProperty(entityId))
        return

    const pos = entities[entityId].Position

    if (entities[entityId] && Vectors.distance(alt.Player.local.pos, pos) <= EntitySyncRange) {
        await AsyncHelper.RequestNamedPtfxAsset("scr_trevor3")

        natives.shakeGameplayCam("MEDIUM_EXPLOSION_SHAKE", 1)
        natives.useParticleFxAsset("scr_trevor3")
        natives.startParticleFxNonLoopedAtCoord("scr_trev3_trailer_expolsion", pos.x, pos.y, pos.z + 1, 0, 0, 0, 1, false, false, false)
        natives.playSoundFromCoord(-1, "MAIN_EXPLOSION_CHEAP", pos.x, pos.y, pos.z, '', false, EntitySyncRange, false)
    }
})

alt.onServer('FireFighters:Fire:FlamesSpawning', async (entityId: number) => {
    if (!entities.hasOwnProperty(entityId))
        return

    entities[entityId].FlamesSpawned = true

    if (entities[entityId].EmbersSmokeHandle != null) {
        await AsyncHelper.RequestNamedPtfxAsset("scr_agencyheistb")

        natives.useParticleFxAsset("scr_agencyheistb")
        entities[entityId].FireSmokeHandle = natives.startParticleFxLoopedAtCoord("scr_env_agency3b_smoke", entities[entityId].Position.x, entities[entityId].Position.y, entities[entityId].Position.z, 0, 0, 0, FireSmokeSize, false, false, false, false)
    }

})

const spawnEntityAtClient = async (fire: ClientFire) => {
    if (!fire) return

    await AsyncHelper.RequestNamedPtfxAsset("scr_agencyheistb")

    natives.useParticleFxAsset("scr_agencyheistb")
    fire.EmbersSmokeHandle = natives.startParticleFxLoopedAtCoord("scr_env_agency3b_smoke", fire.Position.x, fire.Position.y, fire.Position.z, 0, 0, 0, 0.3, false, false, false, false)

    if (fire.FlamesSpawned) {
        natives.useParticleFxAsset("scr_agencyheistb")
        fire.FireSmokeHandle = natives.startParticleFxLoopedAtCoord("scr_env_agency3b_smoke", fire.Position.x, fire.Position.y, fire.Position.z, 0, 0, 0, FireSmokeSize, false, false, false, false)
    }
}

const removeEntityAtClient = (fire: ClientFire) => {
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
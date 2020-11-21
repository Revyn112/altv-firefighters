import * as alt from 'alt-client'
import * as natives from 'natives'
import * as AsyncHelper from '../Utils/AsyncHelper'
import * as Vectors from '../Utils/Vectors'
import * as NativesHelper from '../Utils/NativesHelper'

class ClientFlame {
    public ScriptFireHandle: number
    public FlameHandle: number
    public SmokeHandle: number

    public Position: alt.Vector3
    public IsGasFire: boolean
    public Level: number
    public IsPositionGroundValidated: boolean
    public Extinguished: boolean

    public Id: number
    public Active: boolean
}

var entities: ClientFlame[] = []
const EntityType = 4
const EntitySyncRange = 500

alt.onServer("entitySync:create", async (entityId: number, entityType: number, position: alt.Vector3, newEntityData: any) => {
    if (entityType !== EntityType)
        return;

    alt.log('entitySync:create (flame)')
    alt.log(entityId)
    alt.log(entityType)
    alt.log(position)
    alt.log(newEntityData)

    if (newEntityData) {
        let flame = new ClientFlame()
        flame.Id = entityId
        flame.Position = position
        flame.IsGasFire = newEntityData.isGasFire
        flame.Level = newEntityData.level

        entities[entityId] = flame

        await spawnEntityAtClient(flame)
    } else {
        let restoredFlame = entities[entityId]

        await spawnEntityAtClient(restoredFlame)
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
        entities[entityId].IsPositionGroundValidated = false
    }
})

alt.onServer("entitySync:updateData", async (entityId, entityType, newEntityData) => {
    if (entityType !== EntityType || !entities.hasOwnProperty(entityId))
        return;

    if (newEntityData.hasOwnProperty("isGasFire"))
        entities[entityId].IsGasFire = newEntityData.isGasFire;

    if (newEntityData.hasOwnProperty("extinguished"))
        entities[entityId].Extinguished = newEntityData.extinguished;
    
    if (newEntityData.hasOwnProperty("level")) {
        entities[entityId].Level = newEntityData.level;
        alt.log('Flame Id ' + entityId + ': Level ' + newEntityData.level)
    }

    if (newEntityData.hasOwnProperty("isPositionGroundValidated")) {
        entities[entityId].IsPositionGroundValidated = newEntityData.isPositionGroundValidated;

        if (Vectors.distance(alt.Player.local.pos, entities[entityId].Position) <= EntitySyncRange) {
            removeEntityAtClient(entityId)
            await spawnEntityAtClient(entityId)
        }
    }
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


const spawnEntityAtClient = async (flame: ClientFlame) => {
    if (!flame || !flame.IsPositionGroundValidated) return

    flame.ScriptFireHandle = natives.startScriptFire(flame.Position.x, flame.Position.y, flame.Position.z, 25, flame.IsGasFire)

    await AsyncHelper.RequestNamedPtfxAsset("scr_trevor3")
    natives.useParticleFxAsset("scr_trevor3")
    flame.FlameHandle = natives.startParticleFxLoopedAtCoord("scr_trev3_trailer_plume", flame.Position.x, flame.Position.y, flame.Position.z + 0.4, 0, 0, 0, 0.7, false, false, false, false)

    await AsyncHelper.RequestNamedPtfxAsset("scr_agencyheistb")
    natives.useParticleFxAsset("scr_agencyheistb")
    flame.SmokeHandle = natives.startParticleFxLoopedAtCoord("scr_env_agency3b_smoke", flame.Position.x, flame.Position.y, flame.Position.z, 0, 0, 0, 3, false, false, false, false)

    flame.Active = true
}

const removeEntityAtClient = (flame: ClientFlame) => {
    if (!flame) return

    if (flame.ScriptFireHandle) {
        natives.removeScriptFire(flame.ScriptFireHandle)
        flame.ScriptFireHandle = null
    }

    if (flame.FlameHandle != null) {
        natives.stopParticleFxLooped(flame.FlameHandle, false)
        flame.FlameHandle = null;
    }

    if (flame.SmokeHandle != null) {
        natives.stopParticleFxLooped(flame.SmokeHandle, false)
        flame.SmokeHandle = null;
    }

    flame.Active = false
}

alt.setInterval(() => {
    for (let flame of entities) {
        if (!flame || !flame.Active) continue

        const firesInRange = natives.getNumberOfFiresInRange(flame.Position.x, flame.Position.y, flame.Position.z, 2)
        if (firesInRange < 1) {
            alt.emitServer('FireFighters:Flame:ScriptFireExtinguished', flame.Id)
        }
    }
}, 100)

alt.onServer('FireFighters:Flame:RespawnScriptFire', (entityId: number) => {
    let flame = entities[entityId]

    if (!flame || Vectors.distance(alt.Player.local.pos, flame.Position) <= EntitySyncRange)
        return

    flame.ScriptFireHandle = natives.startScriptFire(flame.Position.x, flame.Position.y, flame.Position.z, 25, flame.IsGasFire)
})

alt.onServer('FireFighters:Flame:DeterminePositionGround', async (entityId: number, position: alt.Vector3) => {
    let ground = await NativesHelper.getGroundZ(position.x, position.y, position.z)

    alt.emitServer('FireFighters:Flame:FoundPositionGround', entityId, ground);
})
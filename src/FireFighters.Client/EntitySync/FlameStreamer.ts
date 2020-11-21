/*import * as alt from 'alt-client'
import * as natives from 'natives'

class ClientFlame {
    public ScriptFireHandle: number;
    public FlameHandle: number;
    public SmokeHandle: number;
}

var blips: any[] = []
const EntityTypeFlame = 4

alt.onServer("entitySync:create", (entityId, entityType, position, newEntityData) => {
    alt.log('entitySync:create')
    alt.log(entityId)
    alt.log(entityType)
    alt.log(position)
    alt.log(newEntityData)

    if (entityType !== EntityTypeFlame)
        return;

    if (newEntityData) {
        let scriptFire = natives.startScriptFire(position.X, position.Y, position.Z, 25, newEntityData.isGasFire)

        let Fire = {
            id: entityId,
            scriptFireHandle: scriptFire,
            isGasFire: newEntityData.isGasFire
        };

        fires[entityId] = Fire;
    } else {
        let restoreFire = fires[entityId];
        restoreFire.handle = new alt.PointBlip(restoreFire.pos.x, restoreFire.pos.y, restoreFire.pos.z);
        restoreFire.handle.sprite = restoreFire.sprite;
        restoreFire.handle.color = restoreFire.color;
        restoreFire.handle.scale = restoreFire.scale;
        restoreFire.handle.name = restoreFire.name;
        restoreFire.handle.shortRange = restoreFire.shortRange;
})

alt.onServer("entitySync:remove", (entityId, entityType) => {
    if (entityType !== EntityTypeBlip)
        return;

    if (blips.hasOwnProperty(entityId)) {
        blips[entityId].handle.destroy();
        blips[entityId].handle = null;
    }
})

alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
    if (entityType !== EntityTypeBlip)
        return;

    if (blips.hasOwnProperty(entityId)) {
        blips[entityId].Blip.pos = position;
    }
})

alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
    if (entityType !== EntityTypeBlip)
        return;

    if (newEntityData.hasOwnProperty("pos") && blips.hasOwnProperty(entityId))
        blips[entityId].pos = newEntityData.pos;

    if (newEntityData.hasOwnProperty("sprite") && blips.hasOwnProperty(entityId))
        blips[entityId].sprite = newEntityData.sprite;

    if (newEntityData.hasOwnProperty("color") && blips.hasOwnProperty(entityId))
        blips[entityId].color = newEntityData.color;

    if (newEntityData.hasOwnProperty("scale") && blips.hasOwnProperty(entityId))
        blips[entityId].scale = newEntityData.scale;

    if (newEntityData.hasOwnProperty("name") && blips.hasOwnProperty(entityId))
        blips[entityId].name = newEntityData.name;

    if (newEntityData.hasOwnProperty("shortRange") && blips.hasOwnProperty(entityId))
        blips[entityId].shortRange = newEntityData.shortRange;
})

alt.onServer("entitySync:clearCache", (entityId, entityType) => {
    if (entityType !== EntityTypeBlip)
        return;

    if (blips.hasOwnProperty(entityId)) {
        blips[entityId].handle.destroy();
        blips[entityId].handle = null;
        
        delete blips[entityId];
    }
})

alt.onServer("entitySync:netOwner", (entityId, entityType, isNetOwner) => {
    //...
})*/
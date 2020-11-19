import * as alt from 'alt-client';
var blips = [];
const EntityTypeBlip = 2;
alt.onServer("entitySync:create", (entityId, entityType, position, newEntityData) => {
    alt.log('entitySync:create');
    alt.log(entityId);
    alt.log(entityType);
    alt.log(position);
    alt.log(newEntityData);
    if (entityType !== EntityTypeBlip)
        return;
    if (newEntityData) {
        let pointer = new alt.PointBlip(position.x, position.y, position.z);
        pointer.sprite = newEntityData.sprite;
        pointer.color = newEntityData.color;
        pointer.scale = newEntityData.scale;
        pointer.name = newEntityData.name;
        pointer.shortRange = newEntityData.shortRange;
        let Blip = {
            pointer: pointer,
            pos: position,
            sprite: newEntityData.sprite,
            color: newEntityData.color,
            scale: newEntityData.scale,
            name: newEntityData.name,
            shortRange: newEntityData.shortRange
        };
        blips[entityId] = Blip;
    }
    else {
        let restoredBlip = blips[entityId];
        restoredBlip.handle = new alt.PointBlip(restoredBlip.pos.x, restoredBlip.pos.y, restoredBlip.pos.z);
        restoredBlip.handle.sprite = restoredBlip.sprite;
        restoredBlip.handle.color = restoredBlip.color;
        restoredBlip.handle.scale = restoredBlip.scale;
        restoredBlip.handle.name = restoredBlip.name;
        restoredBlip.handle.shortRange = restoredBlip.shortRange;
    }
});
alt.onServer("entitySync:remove", (entityId, entityType) => {
    if (entityType !== EntityTypeBlip)
        return;
    if (blips.hasOwnProperty(entityId)) {
        blips[entityId].handle.destroy();
        blips[entityId].handle = null;
    }
});
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
    if (entityType !== EntityTypeBlip)
        return;
    if (blips.hasOwnProperty(entityId)) {
        blips[entityId].Blip.pos = position;
    }
});
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
});
alt.onServer("entitySync:clearCache", (entityId, entityType) => {
    if (entityType !== EntityTypeBlip)
        return;
    if (blips.hasOwnProperty(entityId)) {
        blips[entityId].handle.destroy();
        blips[entityId].handle = null;
        delete blips[entityId];
    }
});
alt.onServer("entitySync:netOwner", (entityId, entityType, isNetOwner) => {
});

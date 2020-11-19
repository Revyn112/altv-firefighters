import * as alt from 'alt-client';
alt.onServer("entitySync:create", (entityId, entityType, position, newEntityData) => {
    alt.log(entityId);
    alt.log(entityType);
    alt.log(position);
    alt.log(newEntityData);
    if (newEntityData) {
        if (!entityData[entityType]) {
            entityData[entityType] = {};
        }
        if (!entityData[entityType][entityId]) {
            entityData[entityType][entityId] = {};
        }
        for (const key in newEntityData) {
            entityData[entityType][entityId][key] = newEntityData[key];
        }
    }
    let currentEntityData;
    if (entityData[entityType] && entityData[entityType][entityId]) {
        currentEntityData = entityData[entityType][entityId];
    }
    else {
        currentEntityData = null;
    }
    alt.log(currentEntityData);
});
alt.onServer("entitySync:remove", (entityId, entityType) => {
    let currentEntityData;
    if (entityData[entityType]) {
        currentEntityData = entityData[entityType][entityId];
    }
    else {
        currentEntityData = null;
    }
    alt.log(entityId);
    alt.log(entityType);
    alt.log(entityData);
});
alt.onServer("entitySync:updatePosition", (entityId, entityType, position) => {
    let currEntityData;
    if (entityData[entityType]) {
        currEntityData = entityData[entityType][entityId];
    }
    else {
        currEntityData = null;
    }
    alt.log(entityId);
    alt.log(entityType);
    alt.log(currEntityData);
});
alt.onServer("entitySync:updateData", (entityId, entityType, newEntityData) => {
    if (!entityData[entityType]) {
        entityData[entityType] = {};
    }
    if (!entityData[entityType][entityId]) {
        entityData[entityType][entityId] = {};
    }
    if (newEntityData) {
        for (const key in newEntityData) {
            entityData[entityType][entityId][key] = newEntityData[key];
        }
    }
    let currentEntityData = entityData[entityType][entityId];
});
alt.onServer("entitySync:clearCache", (entityId, entityType) => {
    if (!entityData[entityType]) {
        return;
    }
    delete entityData[entityType][entityId];
});
alt.onServer("entitySync:netOwner", (entityId, entityType, isNetOwner) => {
});

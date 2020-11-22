import * as alt from 'alt-client'
import * as natives from 'natives'
import Camera from '../Utils/Camera'

let loginCamera: Camera

alt.on("consoleCommand", (command: string, ...args: string[]): void => {
    // alt.log(JSON.stringify(args))

    if (command === 'pos') {
        alt.log(JSON.stringify(natives.getEntityCoords(alt.Player.local.scriptID, true)))
        alt.log(JSON.stringify(natives.getEntityHeading(alt.Player.local.scriptID)))
        return
    }

    if (command === 'car' && args.length > 0) {
        alt.emitServer('FireFighters:Debug:SpawnVehicle', args[0])
        return
    }

    if (command === 'posveh') {
        alt.log(JSON.stringify(natives.getEntityCoords(alt.Player.local.vehicle.scriptID, true)))
        alt.log(JSON.stringify(natives.getEntityHeading(alt.Player.local.vehicle.scriptID)))
        return
    }

    if (command === 'posvehserver') {
        alt.emitServer('FireFighters:Debug:LogCarPosRot')
        return
    }

    if (command === 'spawnmenu') {
        loginCamera = new Camera(new alt.Vector3(-637.12085, 4433.934, 26.870361), new alt.Vector3(0, 0, 271.66), 20)
        loginCamera.render()

        natives.setEntityAlpha(alt.Player.local.scriptID, 0, false)
        natives.setEntityInvincible(alt.Player.local.scriptID, true)
        natives.freezeEntityPosition(alt.Player.local.scriptID, true)
        natives.displayRadar(false)

        alt.emitServer('FireFighters:Debug:SpawnMenu')
        return
    }

    if (command === 'fire') {
        alt.emitServer('FireFighters:Debug:SpawnFire')
        return
    }

    if (command === 'stopfire' && args.length >= 1) {
        alt.log("stopfire")
        alt.emitServer('FireFighters:Debug:StopFire', +args[0])
        return
    }

    if (command === 'flamelvl' && args.length >= 2) {
        alt.emitServer("FireFighters:Debug:SetFlameLevel", +args[0], +args[1])
        return
    }

    if (command === 'flamelvl' && args.length === 1) {
        alt.emitServer("FireFighters:Debug:GetFlameLevel", +args[0])
        return
    }
})

alt.onServer('FireFighters:Debug:Log', (message: string) => alt.log(message))
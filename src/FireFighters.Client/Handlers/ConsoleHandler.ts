import * as alt from 'alt-client'
import * as natives from 'natives'

alt.on("consoleCommand", (command: string, ...args: string[]): void => {
    if (command === 'pos') {
        alt.log(JSON.stringify(natives.getEntityCoords(alt.Player.local.scriptID, true)))
        alt.log(JSON.stringify(natives.getEntityHeading(alt.Player.local.scriptID)))
        return
    }

    if (command === 'car' && args.length > 0) {
        alt.emitServer('Debug:SpawnVehicle', args[0])
        return
    }

    if (command === 'posveh') {
        alt.log(JSON.stringify(natives.getEntityCoords(alt.Player.local.vehicle.scriptID, true)))
        alt.log(JSON.stringify(natives.getEntityHeading(alt.Player.local.vehicle.scriptID)))
        return
    }

    if (command === 'posvehserver') {
        alt.emitServer('Debug:LogCarPosRot')
        return
    }

    if (command === 'spawnmenu') {
        alt.emitServer('Debug:SpawnMenu')
        return
    }
})

alt.onServer('Debug:Log', (message: string) => alt.log(message))
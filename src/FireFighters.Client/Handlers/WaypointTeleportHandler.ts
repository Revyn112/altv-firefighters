import * as alt from 'alt-client'
import * as native from 'natives'
import * as NativesHelper from '../Utils/NativesHelper'

alt.on('teleportToWaypoint', async () => {
    if (!native.isWaypointActive()) return alt.log('Waypoint not defined')

    const { scriptID: player } = alt.Player.local

    const waypoint = native.getFirstBlipInfoId(8)
    const coords = native.getBlipInfoIdCoord(waypoint)
    const z = await NativesHelper.getGroundZ(coords.x, coords.y, coords.z)

    native.freezeEntityPosition(player, true)
    native.requestCollisionAtCoord(coords.x, coords.y, z);
    native.startPlayerTeleport(player, coords.x, coords.y, z, 0, true, true, true)
})

alt.on('keyup', (key: number) => {
    if (key === 114) { // F3
        alt.emit('teleportToWaypoint')
    }
})
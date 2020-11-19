import * as alt from 'alt-client'
import * as native from 'natives'

alt.on('teleportToWaypoint', () => {
    if (!native.isWaypointActive()) return alt.log('Waypoint not defined')

    const z = 1000
    const { scriptID: player } = alt.Player.local

    const waypoint = native.getFirstBlipInfoId(8)
    const coords = native.getBlipInfoIdCoord(waypoint)

    native.freezeEntityPosition(player, true)
    native.requestCollisionAtCoord(coords.x, coords.y, 0);
    native.startPlayerTeleport(player, coords.x, coords.y, z, 0, true, true, true)

    const interval = alt.setInterval(() => {
        if (native.hasPlayerTeleportFinished(player)) {
            const ground = native.getEntityHeightAboveGround(player)

            native.startPlayerTeleport(player, coords.x, coords.y, z - ground, 0, true, true, true)
            native.freezeEntityPosition(player, false)
            alt.clearInterval(interval)
        }
    }, 100)
})

alt.on('keyup', (key: number) => {
    if (key === 114) { // F3
        alt.emit('teleportToWaypoint')
    }
})
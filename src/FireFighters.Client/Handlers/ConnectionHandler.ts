import * as alt from 'alt-client'
import * as natives from 'natives'
import * as NativeUI from "../libs/NativeUI/NativeUi";
import * as AsyncHelper from '../Utils/AsyncHelper'
import Camera from '../Utils/Camera'

const loginPos = new alt.Vector3(-637.12085, 4433.934, 26.870361)

let loginCamera: Camera

alt.on('connectionComplete', async () => {
    await AsyncHelper.RequestModel(alt.hash('s_m_y_fireman_01'))
    
    loginCamera = new Camera(loginPos, new alt.Vector3(0, 0, 271.66), 20)
    loginCamera.render()

    natives.setEntityAlpha(alt.Player.local.scriptID, 0, false)
    natives.setEntityInvincible(alt.Player.local.scriptID, true)
    natives.freezeEntityPosition(alt.Player.local.scriptID, true)
    natives.displayRadar(false)

    //alt.toggleGameControls(false);
})

alt.onServer('FireFighters:SelectSpawn', async (fireStationsString) => {
    const fireStations = JSON.parse(fireStationsString)

    let spawnMenu = new NativeUI.Menu('alt:V Firefighters', 'Spawn Selection', new NativeUI.Point(50, 50))
    spawnMenu.ItemSelect.on(SpawnMenuSelectionHandler)

    for (let i = 0; i < fireStations.length; i++) {
        spawnMenu.AddItem(new NativeUI.UIMenuItem(fireStations[i]))
    }

    alt.setTimeout(() => {
        spawnMenu.Visible = true
    }, 2000)
})

function SpawnMenuSelectionHandler(item: NativeUI.UIMenuItem) {
    if (item instanceof NativeUI.UIMenuItem) {
        alt.emitServer('FireFighters:SpawnAtPoint', item.Text)
        item.Parent.Close()
    }
}

alt.onServer('FireFighters:PlayerSpawned', () => {
    loginCamera.destroy()

    natives.setEntityAlpha(alt.Player.local.scriptID, 255, false)
    natives.setEntityInvincible(alt.Player.local.scriptID, false)
    natives.freezeEntityPosition(alt.Player.local.scriptID, false)
    natives.displayRadar(true)

    //alt.toggleGameControls(true)
})
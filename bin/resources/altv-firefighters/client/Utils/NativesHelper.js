import * as natives from 'natives';
import * as AsyncHelper from './AsyncHelper';
export async function getGroundZ(x, y, z) {
    natives.setFocusPosAndVel(x, y, z, 0, 0, 0);
    await AsyncHelper.Wait(100);
    const [, height] = natives.getGroundZFor3dCoord(x, y, 1000, undefined, undefined, undefined);
    natives.clearFocus();
    return height;
}
export function displayNotification(text) {
    natives.beginTextCommandThefeedPost('STRING');
    natives.addTextComponentSubstringPlayerName(text);
    natives.endTextCommandThefeedPostTicker(false, true);
}
export function displayAdvancedNotification(message, title = 'Title', subtitle = 'subtitle', notifImage = null, iconType = 0, backgroundColor = null, durationMult = 1) {
    natives.beginTextCommandThefeedPost('STRING');
    natives.addTextComponentSubstringPlayerName(message);
    if (backgroundColor != null) {
        natives.thefeedSetNextPostBackgroundColor(backgroundColor);
    }
    if (notifImage != null) {
        natives.endTextCommandThefeedPostMessagetextTu(notifImage, notifImage, false, iconType, title, subtitle, durationMult);
    }
    return natives.endTextCommandThefeedPostTicker(false, true);
}

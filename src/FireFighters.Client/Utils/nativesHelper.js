/* eslint-disable import/prefer-default-export */

import * as natives from 'natives'

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} tries
 */
export function getGroundZ(x, y, z, tries = 0) {
    natives.setFocusPosAndVel(x, y, z, 0, 0, 0)

    const [, height] = natives.getGroundZFor3dCoord(x, y, z + 100, false, false)

    if (!height && tries < 20) {
        return getGroundZ(x, y, z + 100, tries + 1)
    }

    natives.clearFocus()

    if (!height) {
        return 0
    }

    return height
}

/**
 * Display default notification
 * @param {string} text
 */
export function displayNotification(text) {
    natives.beginTextCommandThefeedPost('STRING')
    natives.addTextComponentSubstringPlayerName(text)
    natives.endTextCommandThefeedPostTicker(false, true)
}

/**
 * Display notification with advanced options
 * @param {string} message
 * @param {string} title
 * @param {string} subtitle
 * @param {string} notifImage
 * @param {number} iconType
 * @param {number} backgroundColor
 * @param {number} durationMult
 */
export function displayAdvancedNotification(
    message,
    title = 'Title',
    subtitle = 'subtitle',
    notifImage = null,
    iconType = 0,
    backgroundColor = null,
    durationMult = 1,
) {
    natives.beginTextCommandThefeedPost('STRING')
    natives.addTextComponentSubstringPlayerName(message)

    if (backgroundColor != null) {
        natives.thefeedSetNextPostBackgroundColor(backgroundColor)
    }

    if (notifImage != null) {
        natives.endTextCommandThefeedPostMessagetextTu(
            notifImage,
            notifImage,
            false,
            iconType,
            title,
            subtitle,
            durationMult,
        )
    }

    return natives.endTextCommandThefeedPostTicker(false, true)
}

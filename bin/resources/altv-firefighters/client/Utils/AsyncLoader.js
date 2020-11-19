import * as alt from 'alt-client';
import * as natives from 'natives';
export const loadScaleform = async (scaleform) => {
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
export const loadAnimDict = (dictName) => {
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
export const loadModel = async (model) => {
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

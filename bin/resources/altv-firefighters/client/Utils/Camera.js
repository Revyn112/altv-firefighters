import * as alt from 'alt-client';
import * as natives from 'natives';
export default class Camera {
    constructor(position, rotation, fov) {
        this._position = position;
        this._rotation = rotation;
        this._fov = fov;
        this.scriptID = natives.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', this._position.x, this._position.y, this._position.z, this._rotation.x, this._rotation.y, this._rotation.z, this._fov, true, 0);
        alt.log(`--> Created camera: ${this.scriptID}`);
    }
    get fov() {
        return this._fov;
    }
    set fov(value) {
        this._fov = value;
        natives.setCamFov(this.scriptID, this._fov);
        this.render();
    }
    get position() {
        return this._position;
    }
    set position(position) {
        this._position = position;
        natives.setCamCoord(this.scriptID, this._position.x, this._position.y, this._position.z);
        this.render();
    }
    get rotation() {
        return this._rotation;
    }
    set rotation(rotation) {
        this._rotation = rotation;
        natives.setCamRot(this.scriptID, this._rotation.x, this._rotation.y, this._rotation.z, 0);
        this.render();
    }
    unrender() {
        natives.renderScriptCams(false, false, 0, false, false, 0);
        natives.clearFocus();
        natives.clearHdArea();
    }
    render() {
        natives.setCamActive(this.scriptID, true);
        natives.renderScriptCams(true, false, 0, true, false, 0);
        natives.setFocusPosAndVel(this._position.x, this._position.y, this._position.z, 0, 0, 0);
    }
    destroy() {
        this.unrender();
        natives.destroyCam(this.scriptID, false);
        alt.log(`--> Destroyed camera: ${this.scriptID}`);
    }
    pointAtBone(entity, bone, xOffset, yOffset, zOffset) {
        natives.pointCamAtPedBone(this.scriptID, entity, bone, xOffset, yOffset, zOffset, false);
        this.render();
    }
    pointAtCoord(position) {
        natives.pointCamAtCoord(this.scriptID, position.x, position.y, position.z);
        this.render();
    }
}

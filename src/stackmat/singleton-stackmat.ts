import {Stackmat} from "./stackmat";

export default class SingletonStackmat {
    private static stackmat: Stackmat;
    private static _isRunning: boolean;

    static get = () => {
        if(this.stackmat) {
            return this.stackmat;
        }
        const audioContext = new AudioContext();
        this.stackmat = new Stackmat(audioContext);
        return this.stackmat;
    };

    static start = () => {
        this.get().start();
        this._isRunning = true;
        return this.stackmat;
    };

    static stop = () => {
        this.get().stop();
        this._isRunning = false;
        return this.stackmat;
    };

    static on = (event, callback) => {
        this.get().on(event, callback);
        return this.stackmat;
    };

    static isRunning = () => {
        return this._isRunning;
    };
}
import {Stackmat} from "./stackmat";

export default class SingletonStackmat {
    private static stackmat: Stackmat;
    private static _isRunning: boolean;

    static get = () => {
        if(SingletonStackmat.stackmat) {
            return SingletonStackmat.stackmat;
        }
        const audioContext = new AudioContext();
        SingletonStackmat.stackmat = new Stackmat(audioContext);
        return SingletonStackmat.stackmat;
    };

    static start = () => {
        SingletonStackmat.get().start();
        SingletonStackmat._isRunning = true;
        return SingletonStackmat.stackmat;
    };

    static stop = () => {
        SingletonStackmat.get().stop();
        SingletonStackmat._isRunning = false;
        return SingletonStackmat.stackmat;
    };

    static on = (event, callback) => {
        SingletonStackmat.get().on(event, callback);
        return SingletonStackmat.stackmat;
    };

    static isRunning = () => {
        return SingletonStackmat._isRunning;
    };
}
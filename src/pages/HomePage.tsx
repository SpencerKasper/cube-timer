import React from "react";
import {withRouter} from "react-router";

type FaceValue = 'L' | 'R' | 'B' | 'D' | 'F' | 'U';
type Axis = 'X' | 'Y' | 'Z'
type Direction = '' | '\'' | '2';

const AXISES = ['X', 'Y', 'Z'];
const AXIS_FACE_MAP = {
    X: ['U', 'D'],
    Y: ['L', 'R'],
    Z: ['F', 'B'],
};

const FACE_TO_AXIS_MAP = {
    U: 'X',
    D: 'X',
    L: 'Y',
    R: 'Y',
    F: 'Z',
    B: 'Z',
};

class Face {
    private faceValue: FaceValue;
    private axis: Axis;

    constructor(faceValue: FaceValue) {
        this.faceValue = faceValue;
        this.axis = FACE_TO_AXIS_MAP[faceValue] as Axis;
    }
}

class Turn {
    private face: Face;
    private direction: Direction;

    constructor(previousTurn: Turn) {
        this.face = this.getRandomFace(previousTurn);
        this.direction = this.getRandomDirection();
    }

    getRandomFace = (previousTurn: Turn): Face => {
        const randomAxisAsInt = Math.floor(Math.random() * AXISES.length);
        const randomFaceForAxisAsInt = Math.floor(Math.random() * 2);
        const randomlySelectedFace = AXIS_FACE_MAP[AXISES[randomAxisAsInt]][randomFaceForAxisAsInt];
        if(previousTurn && previousTurn.getFace() === randomlySelectedFace) {
            this.getRandomFace(previousTurn);
        }
        return randomlySelectedFace;
    };

    getRandomDirection = (): Direction => {
        return '';
    };

    getFace = (): Face => {
        return this.face;
    };

    getDirection = (): Direction => {
        return this.direction;
    }
}

class Scramble {
    private scramble: Turn[] = [];
    private readonly scrambleLength: number;

    constructor(length: number) {
        this.scrambleLength = length;
    }

    generate() {
        this.scramble = [];
        for(let index = 0; index < this.scrambleLength; index++) {
            const previousTurn = index === 0 || this.scramble.length === 0 ? null : this.scramble[index - 1];
            this.scramble.push(new Turn(previousTurn));
        }
        return this.toString();
    }

    toString() {
        if(this.scramble.length === 0) {
            console.error('No scramble existed.  Generating new scramble...');
            this.generate();
        }
        return this.scramble.reduce((acc, curr) => {
            return `${acc}${curr.getFace()}${curr.getDirection()} `;
        }, '');
    }
}

const HomePage = () => {
    const SCRAMBLE_LENGTH = 25;
    const CUBE_TYPE = '3x3x3';
    const scramble = new Scramble(SCRAMBLE_LENGTH);
    return (
        <div className={'home-container'}>
            {scramble.toString()}
        </div>
    );
};

export default withRouter(HomePage);
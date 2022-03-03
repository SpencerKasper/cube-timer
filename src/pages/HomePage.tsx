import React from "react";
import {withRouter} from "react-router";

type FaceValue = 'L' | 'R' | 'B' | 'D' | 'F' | 'U';
type Axis = 'X' | 'Y' | 'Z'
type DirectionValue = '' | '\'' | '2';

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
const DIRECTION_VALUES: DirectionValue[] = ['', '\'', '2']

class Direction {
    private directionValue: DirectionValue;

    constructor(directionValue?: DirectionValue) {
        this.directionValue = directionValue ? directionValue : Direction.generateRandomDirectionValue();
    }

    getDirectionValue() {
        return this.directionValue;
    }

    private static generateRandomDirectionValue(): DirectionValue {
        const randomIndexOfDirectionValue = getRandomIntBetweenZeroAndNMinusOne(DIRECTION_VALUES.length);
        return DIRECTION_VALUES[randomIndexOfDirectionValue]
    }
}

class Face {
    private faceValue: FaceValue;
    private axis: Axis;

    constructor({faceValue, previousTurn}: { faceValue?: FaceValue, previousTurn?: Turn }) {
        this.faceValue = faceValue ? faceValue : this.generateRandomFaceValue(previousTurn);
        this.axis = FACE_TO_AXIS_MAP[faceValue] as Axis;
    }

    getFaceValue() {
        return this.faceValue;
    }

    getAxis() {
        return this.axis;
    }

    private generateRandomFaceValue = (previousTurn: Turn): FaceValue => {
        const randomAxisAsInt = getRandomIntBetweenZeroAndNMinusOne(AXISES.length);
        const randomFaceForAxisAsInt = getRandomIntBetweenZeroAndNMinusOne(2)
        const randomlySelectedFace = AXIS_FACE_MAP[AXISES[randomAxisAsInt]][randomFaceForAxisAsInt];
        if (previousTurn && previousTurn.getFace().getFaceValue() === randomlySelectedFace) {
            return this.generateRandomFaceValue(previousTurn);
        }
        return randomlySelectedFace;
    };
}

const getRandomIntBetweenZeroAndNMinusOne = (n: number) => Math.floor(Math.random() * n);

class Turn {
    private face: Face;
    private direction: Direction;

    constructor(previousTurn: Turn) {
        this.face = new Face({previousTurn});
        this.direction = new Direction();
    }

    getFace = (): Face => {
        return this.face;
    };

    getDirection = (): Direction => {
        return this.direction;
    }

    toString() {
        return `${this.getFace().getFaceValue()}${this.getDirection().getDirectionValue()}`
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
        for (let index = 0; index < this.scrambleLength; index++) {
            const previousTurn = index === 0 || this.scramble.length === 0 ? null : this.scramble[index - 1];
            this.scramble.push(new Turn(previousTurn));
        }
        return this.toString();
    }

    toString() {
        if (this.scramble.length === 0) {
            console.error('No scramble existed.  Generating new scramble...');
            this.generate();
        }
        return this.scramble.reduce((acc, curr) => {
            return `${acc}${curr.toString()} `;
        }, '');
    }
}

const HomePage = () => {
    const SCRAMBLE_LENGTH = 20;
    const CUBE_TYPE = '3x3x3';
    const scramble = new Scramble(SCRAMBLE_LENGTH);
    return (
        <div className={'home-container'}>
            {scramble.toString()}
        </div>
    );
};

export default withRouter(HomePage);
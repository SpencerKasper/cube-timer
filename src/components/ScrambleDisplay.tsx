import React, {useEffect} from 'react';
import './ScrambleDisplayRow.css';
import scrambleSelectors from "../redux/selectors/scrambleSelectors";
import {useSelector} from "react-redux";
import reduxStore from "../redux/redux-store";
import Scrambo from 'scrambo';
import settingsSelectors from "../redux/selectors/settingsSelectors";
import {CubeType} from "../redux/reducers/settingsReducer";

export interface GetScrambleResponse {
    responseCode: number;
    body: { scramble: string; };
}

const SCRAMBLE_GENERATOR_OVERRIDE_CUBE_TYPE_MAP: {[key in CubeType]?: CubeType} = {
    '333oh': '333',
};

const ScrambleDisplay = () => {
    const {cubeType, scrambleLengthMap} = useSelector(settingsSelectors.scrambleSettings);
    const getScramble = async () => {
        const scrambleGenerator = new Scrambo();
        scrambleGenerator
            .type(
                SCRAMBLE_GENERATOR_OVERRIDE_CUBE_TYPE_MAP.hasOwnProperty(cubeType) ?
                    SCRAMBLE_GENERATOR_OVERRIDE_CUBE_TYPE_MAP[cubeType] :
                    cubeType,
            );
        if (scrambleLengthMap.hasOwnProperty(cubeType) && scrambleLengthMap[cubeType]) {
            scrambleGenerator.length(scrambleLengthMap[cubeType])
        }
        const scramble = scrambleGenerator.get(1)[0];
        reduxStore.dispatch({type: 'scrambles/set', payload: {scramble}});
    };
    useEffect(() => {
        getScramble();
    }, [cubeType, scrambleLengthMap]);
    const scramble = useSelector(scrambleSelectors.scramble);
    return (
        <div className='scramble-display-container'>
            <h2 className='scramble-title'>{scramble}</h2>
        </div>
    );
};

export default ScrambleDisplay;
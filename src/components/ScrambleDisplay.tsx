import React, {useEffect} from 'react';
import './ScrambleDisplayRow.css';
import scrambleSelectors from "../redux/selectors/scrambleSelectors";
import {useSelector} from "react-redux";
import reduxStore from "../redux/redux-store";
import settingsSelectors from "../redux/selectors/settingsSelectors";
import {ScrambleGenerator} from "../utils/ScrambleGenerator";

export interface GetScrambleResponse {
    responseCode: number;
    body: { scramble: string; };
}

const ScrambleDisplay = () => {
    const {cubeType, scrambleLengthMap} = useSelector(settingsSelectors.scrambleSettings);
    useEffect(() => {
        const scramble = new ScrambleGenerator().generate(cubeType, scrambleLengthMap)[0];
        reduxStore.dispatch({type: 'scrambles/set', payload: {scramble}});
    }, [cubeType, scrambleLengthMap]);
    const scramble = useSelector(scrambleSelectors.scramble);
    return (
        <div className='scramble-display-container'>
            <h2 className='scramble-title'>{scramble}</h2>
        </div>
    );
};

export default ScrambleDisplay;
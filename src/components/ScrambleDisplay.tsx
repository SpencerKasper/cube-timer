import React, {useEffect} from 'react';
import './ScrambleDisplayRow.css';
import scrambleSelectors from "../redux/selectors/scrambleSelectors";
import {useSelector} from "react-redux";
import axios from "axios";
import reduxStore from "../redux/redux-store";
import {UrlHelper} from "../utils/url-helper";
import Scrambo from 'scrambo';
import settingsSelectors from "../redux/selectors/settingsSelectors";

export interface GetScrambleResponse {
    responseCode: number;
    body: { scramble: string; };
}

const ScrambleDisplay = () => {
    const {cubeType, scrambleLength, scrambleLengthMap} = useSelector(settingsSelectors.scrambleSettings);
    const getScramble = async () => {
        const scrambleGenerator = new Scrambo();
        scrambleGenerator
            .type(cubeType);
        if (scrambleLengthMap.hasOwnProperty(cubeType)) {
            scrambleGenerator.length(scrambleLengthMap[cubeType])
        }
        const scramble = scrambleGenerator.get(1)[0];
        reduxStore.dispatch({type: 'scrambles/set', payload: {scramble}});
    };
    useEffect(() => {
        getScramble();
    }, [cubeType, scrambleLength]);
    const scramble = useSelector(scrambleSelectors.scramble);
    return (
        <div className='scramble-display-container'>
            <h2 className='scramble-title'>{scramble}</h2>
        </div>
    );
};

export default ScrambleDisplay;
import React, {useEffect} from 'react';
import './ScrambleDisplayRow.css';
import scrambleSelectors from "../redux/selectors/scrambleSelectors";
import {useSelector} from "react-redux";
import axios from "axios";
import reduxStore from "../redux/redux-store";

export interface GetScrambleResponse {
    responseCode: number;
    body: { scramble: string; };
}

const ScrambleDisplay = () => {
    const CUBE_TYPE = '3x3x3';
    const getScramble = async () => {
        const response = await axios
            .get<GetScrambleResponse>(`https://akyz39h8vj.execute-api.us-east-1.amazonaws.com/prod/cubeType/${CUBE_TYPE}`);
        reduxStore.dispatch({type: 'scrambles/set', payload: {scramble: response.data.body.scramble}});
    };
    useEffect(() => {
        getScramble();
    }, []);
    const scramble = useSelector(scrambleSelectors.scramble);
    return (
        <div className='scramble-display-container'>
            <h2 className='scramble-title'>{scramble}</h2>
        </div>
    );
};

export default ScrambleDisplay;
import {Solve} from "../redux/reducers/solveReducer";
import axios from "axios";
import {UrlHelper} from "../utils/url-helper";
import reduxStore, {ReduxStore} from "../redux/redux-store";
import {TimeFormatter} from "../utils/TimeFormatter";
import {Card, CardContent} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React from "react";
import {useSelector} from "react-redux";

export function SolveCard(props: { solve: Solve }) {
    const user = useSelector((state: ReduxStore) => state.sessionReducer.user);
    const deleteSolve = async () => {
        const email = user.attributes.email;
        const response = await axios.get<{ body: { solves: Solve[] } }>(`${UrlHelper.getScrambleApiDomain()}solves/${props.solve.solveId}/${encodeURIComponent(email)}`);
        reduxStore.dispatch({type: 'solves/set', payload: {solves: response.data.body.solves}});
    }

    const timeFormatter = new TimeFormatter();

    return <Card variant='outlined'>
        <CardContent className='solve-container'>
            <div className='delete-row'>
                <DeleteForeverIcon onClick={() => deleteSolve()}/>
            </div>
            <div className='label-and-time'>
                <p className='label'>
                    Solve:
                </p>
                <p>
                    {props.solve.number}
                </p>

            </div>
            <div className='label-and-time'>
                <p className='label'>
                    Time:
                </p>
                <p>
                    {timeFormatter.getFullTime(props.solve.time)}
                </p>
            </div>
            <div className='label-and-time'>
                <p className='label'>
                    Scramble:
                </p>
                <p>
                    {props.solve.scramble}
                </p>
            </div>
        </CardContent>
    </Card>;
}
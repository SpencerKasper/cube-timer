import {Solve} from "../redux/reducers/solveReducer";
import axios from "axios";
import {UrlHelper} from "../utils/url-helper";
import reduxStore, {ReduxStore} from "../redux/redux-store";
import {TimeFormatter} from "../utils/TimeFormatter";
import {Card, CardContent, CircularProgress} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

export function SolveCard(props: { solve: Solve; solveNumber: number; }) {
    const user = useSelector((state: ReduxStore) => state.sessionReducer.user);
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteSolve = async () => {
        setIsDeleting(true);
        if(user && props.solve.solveId) {
            const email = user.attributes.email;
            const deleteSolveEndpoint = `${UrlHelper.getScrambleApiDomain()}solves/${props.solve.solveId}/${encodeURIComponent(email)}`;
            const response = await axios.get<{ body: { solves: Solve[] } }>(deleteSolveEndpoint);
            reduxStore.dispatch({type: 'solves/set', payload: {solves: response.data.body.solves}});
        } else {
            toast.error('Delete failed for an unknown reason.  Please try again.');
        }
        setIsDeleting(false);
    };

    const timeFormatter = new TimeFormatter();

    return <Card variant='outlined' id={`solve-item-${props.solve.number}`}>
        <CardContent className='solve-container'>
            <div className='delete-row'>
                <div onClick={() => deleteSolve()}>
                    <DeleteForeverIcon/>
                </div>
            </div>
            <div className='label-and-time'>
                <p className='label'>
                    Solve:
                </p>
                <p>
                    {props.solveNumber}
                </p>

            </div>
            {isDeleting && <div className={'loading-spinner'}><CircularProgress /></div>}
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
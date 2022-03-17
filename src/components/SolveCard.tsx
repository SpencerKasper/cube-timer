import {Solve} from "../redux/reducers/solveReducer";
import axios from "axios";
import {UrlHelper} from "../utils/url-helper";
import reduxStore, {ReduxStore} from "../redux/redux-store";
import {TimeFormatter} from "../utils/TimeFormatter";
import {Card, CardContent, CircularProgress, Tooltip} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import RemoveIcon from '@mui/icons-material/Remove';
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

    const plusTwo = async () => {
        setIsDeleting(true);
        const email = user.attributes.email;
        if(user && props.solve.solveId) {
            const plusTwoEndpoint = `${UrlHelper.getScrambleApiDomain()}solves/${props.solve.solveId}/${encodeURIComponent(email)}/plusTwo`;
            const response = await axios.get<{ body: { solves: Solve[] } }>(plusTwoEndpoint);
            reduxStore.dispatch({type: 'solves/set', payload: {solves: response.data.body.solves}});
        } else {
            toast.error('Plus two failed for an unknown reason.  Please try again.');
        }
        setIsDeleting(false);
    }

    const plusOrMinusTwo = async () => {
        if(props.solve.plusTwo) {
            toast.warning('The minus function is the next feature being built. Hang tight and apologies!');
        } else {
            await plusTwo();
        }
    }

    const dnf = () => {
        toast.warning('The DNF feature has not been implemented yet, but is coming in the near future.  Sorry for the inconvenience!')
    }

    const timeFormatter = new TimeFormatter();

    return <Card variant='outlined' id={`solve-item-${props.solve.number}`}>
        <CardContent className='solve-container'>
            <div className='delete-row'>
                <Tooltip title={`This will ${props.solve.plusTwo ? 'remove' : 'add'} 2 seconds ${props.solve.plusTwo ? 'from' : 'to'} the solve.`}>
                    <div className={'plus-2-button'} onClick={plusOrMinusTwo}>
                        {props.solve.plusTwo ? <RemoveIcon /> : <AddIcon/>}
                        <p>2</p>
                    </div>
                </Tooltip>
                <Tooltip title={'This will be added in the near future'}>
                    <div className={'delete-button'} onClick={dnf}>
                        DNF
                    </div>
                </Tooltip>
                <div className={'delete-button'} onClick={() => deleteSolve()}>
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
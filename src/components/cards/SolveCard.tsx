import {Solve} from "../../redux/reducers/solveReducer";
import axios from "axios";
import {UrlHelper} from "../../utils/url-helper";
import reduxStore, {ReduxStore} from "../../redux/redux-store";
import {TimeFormatter} from "../../utils/TimeFormatter";
import {Button, Card, CardContent, CircularProgress, Tooltip} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import solveSelectors from "../../redux/selectors/solveSelectors";
import {CUBE_TYPES} from "../drop-downs/CubeSelectionDropDown";

export function SolveCard(props: { solve: Solve; solveNumber: number; }) {
    const user = useSelector((state: ReduxStore) => state.sessionReducer.user);
    const selectedSession = useSelector(solveSelectors.selectedSession);
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteSolve = async () => {
        setIsDeleting(true);
        if (user && props.solve.solveId) {
            const email = user.attributes.email;
            const deleteSolveEndpoint = `${UrlHelper.getScrambleApiDomain()}solves/${props.solve.solveId}/${encodeURIComponent(email)}?sessionId=${selectedSession.sessionId}`;
            const response = await axios.get<{ body: { solves: Solve[] } }>(deleteSolveEndpoint);
            reduxStore.dispatch({type: 'solves/set', payload: {solves: response.data.body.solves}});
        } else {
            toast.error('Delete failed for an unknown reason.  Please try again.');
        }
        setIsDeleting(false);
    };

    const plusOrMinusTwo = async (minus = false) => {
        setIsDeleting(true);
        const email = user.attributes.email;
        if (user && props.solve.solveId) {
            const plusTwoEndpoint = `${UrlHelper.getScrambleApiDomain()}solves/${props.solve.solveId}/${encodeURIComponent(email)}/plusTwo?sessionId=${selectedSession.sessionId}`;
            const finalEndpoint = minus ? `${plusTwoEndpoint}&plusOrMinusTwo=-` : plusTwoEndpoint;
            const response = await axios.get<{ body: { solves: Solve[] } }>(finalEndpoint);
            reduxStore.dispatch({type: 'solves/set', payload: {solves: response.data.body.solves}});
        } else {
            toast.error('Plus two failed for an unknown reason.  Please try again.');
        }
        setIsDeleting(false);
    };

    const dnf = async () => {
        setIsDeleting(true);
        const email = user.attributes.email;
        if (user && props.solve.solveId) {
            const dnfEndpoint = `${UrlHelper.getScrambleApiDomain()}solves/${props.solve.solveId}/${encodeURIComponent(email)}/dnf?sessionId=${selectedSession.sessionId}`;
            const finalEndpoint = props.solve.dnf ? `${dnfEndpoint}&isDnf=false` : dnfEndpoint;
            const response = await axios.get<{ body: { solves: Solve[] } }>(finalEndpoint);
            reduxStore.dispatch({type: 'solves/set', payload: {solves: response.data.body.solves}});
        } else {
            toast.error('Plus two failed for an unknown reason.  Please try again.');
        }
        setIsDeleting(false);
    }

    const timeFormatter = new TimeFormatter();

    return <Card variant='outlined' id={`solve-item-${props.solve.number}`}>
        <CardContent className='solve-container'>
            <div className='delete-row'>
                <Tooltip
                    title={`This will ${props.solve.plusTwo ? 'remove' : 'add'} 2 seconds ${props.solve.plusTwo ? 'from' : 'to'} the solve.`}>
                    <div className={'plus-2-button'} onClick={() => plusOrMinusTwo(props.solve.plusTwo)}>
                        {props.solve.plusTwo ? <RemoveIcon/> : <AddIcon/>}
                        <p>2</p>
                    </div>
                </Tooltip>
                <Tooltip title={props.solve.dnf ? 'Mark the solve as valid' : 'Mark the solve as a DNF'}>
                    <Button className={'delete-button'} onClick={dnf}>
                        {props.solve.dnf ? 'Undo DNF' : 'DNF'}
                    </Button>
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
            <div className='label-and-time'>
                <p className='label'>
                    Cube Type:
                </p>
                <p>
                    {CUBE_TYPES.hasOwnProperty(props.solve.cubeType) ? CUBE_TYPES[props.solve.cubeType].name : props.solve.cubeType}
                </p>
            </div>
            {isDeleting && <div className={'loading-spinner'}><CircularProgress/></div>}
            <div className='label-and-time'>
                <p className='label'>
                    Time:
                </p>
                <p>
                    {props.solve.dnf ? `DNF (${timeFormatter.getFullTime(props.solve.time)})` : timeFormatter.getFullTime(props.solve.time)}
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
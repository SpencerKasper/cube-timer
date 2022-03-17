import RubiksCubeIcon from "../static/images/cube.png";
import ScrambleDisplayRow from "./ScrambleDisplay";
import React from "react";
import {useSelector} from "react-redux";
import sessionSelectors from "../redux/selectors/sessionSelectors";

export function Header(props) {
    const user = useSelector(sessionSelectors.user);
    return <div className='scramble-display-row'>
        <div className='logo'>
            <h1 className='logo-title'>
                SolveLog
            </h1>
            <div>
                <img src={RubiksCubeIcon} width={48} height={48}/>
            </div>
        </div>
        {user ? <ScrambleDisplayRow/> : <div></div>}
        <div className='log-out-and-user-name'>
            {user ? <><p className='user-name'>{user.attributes.email}</p>
                <p className='log-out' onClick={() => props.logOut()}>Log Out</p></> :
                <p></p>
            }
        </div>
    </div>;
}
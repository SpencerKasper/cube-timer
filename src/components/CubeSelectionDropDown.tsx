import {useSelector} from "react-redux";
import settingsSelectors from "../redux/selectors/settingsSelectors";
import reduxStore from "../redux/redux-store";
import {MenuItem, Select} from "@mui/material";
import React from "react";
import {CubeType} from "../redux/reducers/settingsReducer";

export const CUBE_TYPES: { [key in CubeType]: { name: string; type: CubeType; } } = {
    '222': {name: '2x2x2', type: '222'},
    '333': {name: '3x3x3', type: '333'},
    '444': {name: '4x4x4', type: '444'},
    '555': {name: '5x5x5', type: '555'},
    '666': {name: '6x6x6', type: '666'},
    '777': {name: '7x7x7', type: '777'},
    'sq1': {name: 'Square 1', type: 'sq1'},
    'minx': {name: 'N Minx', type: 'minx'},
    'pyram': {name: 'Pyraminx', type: 'pyram'},
    'clock': {name: 'Clock', type: 'clock'},
    'skewb': {name: 'Skewb', type: 'skewb'},
}

export function CubeSelectionDropDown() {
    const scrambleSettings = useSelector(settingsSelectors.scrambleSettings);

    const onCubeSelectionChange = (event) => {
        reduxStore.dispatch({
            type: 'settings/setScrambleSettings',
            payload: {
                scrambleSettings: {...scrambleSettings, cubeType: event.target.value}
            },
        });
    };

    const allCubeTypes = Object.values(CUBE_TYPES);

    return <Select
        color={"secondary"}
        labelId={"selected-session-label-id"}
        value={scrambleSettings.cubeType}
        label="Cube Type"
        onChange={onCubeSelectionChange}
    >
        {allCubeTypes.map((cubeType, index) =>
            <MenuItem
                key={index}
                value={cubeType.type}>
                {cubeType.name}
            </MenuItem>
        )}
    </Select>;
}
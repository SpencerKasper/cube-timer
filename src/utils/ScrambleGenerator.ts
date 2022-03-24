import {CubeType} from "../redux/reducers/settingsReducer";
import Scrambo from 'scrambo';

const SCRAMBLE_GENERATOR_OVERRIDE_CUBE_TYPE_MAP: {[key in CubeType]?: CubeType} = {
    '333oh': '333',
};

export class ScrambleGenerator {
    public generate(cubeType: CubeType, scrambleLengthMap, numberOfScrambles: number = 1) {
        const scrambleGenerator = new Scrambo();
        const finalCubeTypeForGenerator = SCRAMBLE_GENERATOR_OVERRIDE_CUBE_TYPE_MAP.hasOwnProperty(cubeType) ?
            SCRAMBLE_GENERATOR_OVERRIDE_CUBE_TYPE_MAP[cubeType] :
            cubeType;
        scrambleGenerator
            .type(finalCubeTypeForGenerator);
        if (scrambleLengthMap.hasOwnProperty(cubeType) && scrambleLengthMap[cubeType]) {
            scrambleGenerator.length(scrambleLengthMap[cubeType])
        }
        return scrambleGenerator.get(numberOfScrambles);
    }
}
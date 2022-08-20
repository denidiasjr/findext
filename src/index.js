import {
    HELP_MESSAGE
} from './constants';
import minimist from "minimist";

const main = (args) => {
    const options = minimist(args);

    if (options.help) {
        console.log(HELP_MESSAGE)
    }
}

export default main;
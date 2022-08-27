import { HELP_MESSAGE } from './constants';
import { getExtensions, printFilesCount } from './utils';
import minimist from "minimist";

const main = (args: string[]) => {
    const options = minimist(args);
    
    if (options.help) {
        return console.log(HELP_MESSAGE);
    }

    const extensionsOption = options.ext || options.extensions || options._[2];
    const source = options.src || options.source || process.cwd();

    if (!extensionsOption || typeof extensionsOption !== 'string') {
        return console.error('ERROR: Extensions not listed.');
    }
    
    if (!source || typeof source !== 'string') {
        return console.error('ERROR: Invalid source.');
    }
    
    console.log('Searching...');

    const extensions = extensionsOption.split(',');
    getExtensions(source, extensions);

    console.log('Finished!');
    printFilesCount();
}

export default main;
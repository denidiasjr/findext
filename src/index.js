import {
    PATH_SLASH,
    HELP_MESSAGE
} from './constants';
import minimist from "minimist";
import fs from 'fs';
import nodePath from 'path';

const isSameExtension = (a, b) => a.replace('.', '') === b.replace('.', '');

const getExtensions = (source, extensions) => {
    try {
        const absoluteSource = nodePath.resolve(source);
        const sourceStats = fs.lstatSync(absoluteSource);
        
        if (!sourceStats.isDirectory()) {
            return console.error('ERROR: Source it\'s not a directory.');
        }
        
        const listOfPaths = fs.readdirSync(absoluteSource);
        
        listOfPaths.forEach(path => {
            const currentPath = `${absoluteSource}${PATH_SLASH}${path}`;
            
            if (fs.lstatSync(currentPath).isDirectory()) {
                return getExtensions(currentPath, extensions);
            } 

            extensions.forEach(extension => {
                if (isSameExtension(extension, nodePath.extname(path))) {
                    const fullPath = `${source}${PATH_SLASH}${path}`;
                    console.log(fullPath);
                };
            });
        });

    } catch (err) {
        console.error(err);
        process.exit();
    }
};

const main = (args) => {
    const options = minimist(args);
    
    if (options.help) {
        return console.log(HELP_MESSAGE);
    }

    const extensionsOption = options.ext || options.extensions || options._[2];
    const source = options.src || options.source;

    if (!extensionsOption || typeof extensionsOption !== 'string') {
        return console.error('ERROR: Extensions not listed.');
    }
    
    if (!source || typeof source !== 'string') {
        return console.error('ERROR: Invalid source.');
    }
    
    const extensions = extensionsOption.split(',');
    return getExtensions(source, extensions);
}

export default main;
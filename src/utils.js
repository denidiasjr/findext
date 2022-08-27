import { CONSOLE_RED_COLOR, CONSOLE_RED_CYAN, PATH_SLASH } from './constants';
import Context from './context';
import fs from 'fs';
import nodePath from 'path';

export const isSameExtension = (a, b) => a.replace('.', '').toLowerCase() === b.replace('.', '').toLowerCase();

export const printPathsWithErrors = () => {
    const context = Context.getInstance();
    if (context.pathsWithErrors.length > 0) {
        console.log(CONSOLE_RED_COLOR, '\nERROR: Findext couldn\'t access the following folders:');
        context.pathsWithErrors.forEach(errorPath => console.log(CONSOLE_RED_COLOR, errorPath));
    };
}

export const printFilesCount = () => {
    const context = Context.getInstance();
    if (context.filesCount > 0) {
        console.log(CONSOLE_RED_CYAN, `\nTotal of files listed: ${context.filesCount}`);
    };
}

export const getSizeString = (size) => {
    const sizeLength = String(size).length;

    if (sizeLength <= 3) {
        return `${size} Bytes`;
    } else if (sizeLength >= 4 && sizeLength < 7) {
        return `${(size / 1000).toFixed(2)} KB`;
    } else if (sizeLength >= 7 && sizeLength < 10) {
        return `${(size / 1000000).toFixed(2)} MB`;
    } else if (sizeLength >= 10 && sizeLength < 13) {
        return `${(size / 1000000000).toFixed(2)} GB`;
    } else if (sizeLength >= 13) {
        return `${(size / 1000000000000).toFixed(2)} TB`;
    }
        
    return String(size);
}

export const printFile = (file) => {
    const fileStats = fs.statSync(file);
    console.log(CONSOLE_RED_CYAN, `${file} (${getSizeString(fileStats.size)})`);
}

export const useDirectory = (source) => {
    const absoluteSource = nodePath.isAbsolute(source) ? source : nodePath.resolve(source);
    const context = Context.getInstance();
    const folders = [];
    const files = [];
    let listOfPaths;

    try {
        listOfPaths = fs.readdirSync(absoluteSource);
    } catch (err) {
        context.addPathWithError(absoluteSource);
    }

    if (listOfPaths) {
        listOfPaths.forEach(path => {
            const currentPath = `${absoluteSource}${PATH_SLASH}${path}`;

            if (fs.lstatSync(currentPath).isDirectory()) {
                return folders.push(currentPath);
            }
    
            files.push(currentPath);
        });
    }

    return {
        currentFolder: absoluteSource,
        folders,
        files
    }
};

export const getExtensions = (source, extensions) => {
    const { folders, files } = useDirectory(source);
    const context = Context.getInstance();

    folders.forEach(folder => getExtensions(folder, extensions));
    files.forEach(file => 
        extensions.forEach(
            extension => {
                if (isSameExtension(extension, nodePath.extname(file))) {
                    printFile(file);
                    context.incrementFilesCount();
                }
            }
    ));
};
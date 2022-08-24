import { PATH_SLASH } from './constants';
import fs from 'fs';
import nodePath from 'path';

export const isSameExtension = (a, b) => a.replace('.', '').toLowerCase() === b.replace('.', '').toLowerCase();

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
    console.log(`${file} (${getSizeString(fileStats.size)})`);
}

export const useDirectory = (source) => {
    const absoluteSource = nodePath.isAbsolute(source) ? source : nodePath.resolve(source);
    const folders = [];
    const files = [];
    let listOfPaths;

    try {
        listOfPaths = fs.readdirSync(absoluteSource);
    } catch (err) {
        console.error(`ERROR: Couldn't resolve ${absoluteSource} directory.`);
        process.exit();
    }

    listOfPaths.forEach(path => {
        const currentPath = `${absoluteSource}${PATH_SLASH}${path}`;
        
        if (fs.lstatSync(currentPath).isDirectory()) {
            return folders.push(currentPath);
        }

        files.push(currentPath);
    });

    return {
        currentFolder: absoluteSource,
        folders,
        files
    }
};

export const getExtensions = (source, extensions) => {
    const { folders, files } = useDirectory(source);

    folders.forEach(folder => getExtensions(folder, extensions));
    files.forEach(file => 
        extensions.forEach(
            extension => isSameExtension(extension, nodePath.extname(file)) && printFile(file)
    ));
};
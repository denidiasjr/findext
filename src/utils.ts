import { CONSOLE_RED_COLOR, CONSOLE_RED_CYAN, PATH_SLASH } from './constants';
import Context from './context';
import fs from 'fs';
import nodePath from 'path';

export const isSameExtension = (a: string, b: string) => a.replace('.', '').toLowerCase() === b.replace('.', '').toLowerCase();

export const printPathsWithErrors = () => {
    const context = Context.getInstance();
    const pathsWithErrors = context.getPathsWithErrors();
    if (pathsWithErrors.length > 0) {
        console.log(CONSOLE_RED_COLOR, '\nERROR: Findext couldn\'t access the following folders:');
        pathsWithErrors.forEach(errorPath => console.log(CONSOLE_RED_COLOR, errorPath));
    };
}

export const printFilesCount = () => {
    const context = Context.getInstance();
    const filesCount = context.getFilesCount();
    if (filesCount > 0) {
        console.log(CONSOLE_RED_CYAN, `\nTotal of files listed: ${filesCount}`);
    };
}

export const getSizeString = (size: number) => {
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

export const printFile = (file: string) => {
    const fileStats = fs.statSync(file);
    console.log(CONSOLE_RED_CYAN, `${file} (${getSizeString(fileStats.size)})`);
}

export const useDirectory = (source: string) => {
    const absoluteSource = nodePath.isAbsolute(source) ? source : nodePath.resolve(source);
    const context = Context.getInstance();
    const folders: string[] = [];
    const files: string[] = [];
    let listOfPaths: string[] | null = null;

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

export const getExtensions = (source: string, extensions: string[]) => {
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
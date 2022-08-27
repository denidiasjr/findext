class Context {
    private static instance: Context;
    private readonly pathsWithErrors: string[];
    private filesCount: number;

    constructor() {
        this.filesCount = 0;
        this.pathsWithErrors = [];
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Context();
        }

        return this.instance;
    }

    getFilesCount() {
        return this.filesCount;
    }

    getPathsWithErrors() {
        return this.pathsWithErrors;
    }

    incrementFilesCount() {
        this.filesCount++;
    } 

    addPathWithError(path: string) {
        this.pathsWithErrors.push(path);
    } 
}

export default Context;
class Context {
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

    incrementFilesCount() {
        this.filesCount++;
    } 

    addPathWithError(path) {
        this.pathsWithErrors.push(path);
    } 
}

export default Context;
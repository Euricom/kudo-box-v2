export class ConfigVarNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigVarNotFoundError';
    }
}
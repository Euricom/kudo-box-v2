class NoSocketConnectionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NoSocketConnection'
    }
}

export default NoSocketConnectionError;
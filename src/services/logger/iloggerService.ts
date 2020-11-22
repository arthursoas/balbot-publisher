export interface ILoggerService {
    /**
     * Create an information log
     */
    Info(message: string, exception: Error) : Promise<void>

    /**
     * Create a warning log
     */
    Warning(message: string, exception: Error) : Promise<void>

    /**
     * Create an error log
     */
    Error(message: string, exception: Error) : Promise<void>
}
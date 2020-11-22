import { ILoggerService } from './iloggerService';

export class TextFileLoggerService implements ILoggerService {
    async Info(message: string, exception: Error): Promise<void> {
        console.info(message, exception);
    }

    async Warning(message: string, exception: Error): Promise<void> {
        console.warn(message, exception);
    }

    async Error(message: string, exception: Error): Promise<void> {
        console.error(message, exception);
    }
}
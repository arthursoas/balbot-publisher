import { Chatbot } from '../chatbot/chatbot';
import { IFactory } from '../iFactory';
import { CsvReader } from './csvReader';

export class CsvReaderFactory implements IFactory<CsvReader>
{
    Create(...args: Array<string|IFactory<Chatbot>>) : CsvReader {
        if (args.length < 2) throw new Error(
            'Wrong numbe of params. Pass file path and chatbot factory.');

        const [filePath, chatbotFactory]: Array<string|IFactory<Chatbot>> = args;

        const chatbot = new CsvReader(chatbotFactory as IFactory<Chatbot>);
        chatbot.FilePath = filePath as string;

        return chatbot;
    }
}
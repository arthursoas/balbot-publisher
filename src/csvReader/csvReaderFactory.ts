import ChatbotFactory from '../chatbot/chatbotFactory';
import IFactory from '../iFactory';
import CsvReader from './csvReader';

export default class CsvReaderFactory implements IFactory<CsvReader>
{
    Create(...args: string[]) : CsvReader {
        if (args.length == 0) throw new Error('File path is required');

        const [filePath] : string[] = args;

        const chatbot = new CsvReader(new ChatbotFactory())
        chatbot.FilePath = filePath;

        return chatbot;
    }
}
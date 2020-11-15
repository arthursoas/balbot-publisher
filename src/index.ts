import IFactory from './iFactory';
import CsvReader from './csvReader/csvReader';
import CsvReaderFactory from './csvReader/csvReaderFactory';
import Chatbot from './chatbot/chatbot';

class Program
{
    private _csvReaderFactory : IFactory<CsvReader>;

    constructor(
        csvReaderFactory: IFactory<CsvReader>
    ) {
        this._csvReaderFactory = csvReaderFactory;
    }

    async Execute() {
        const csvReader : CsvReader = this._csvReaderFactory.Create(
            'chatbots.csv'
        )

        const chatbots : Array<Chatbot> = await csvReader.ReadChatbotsFromCsvAsync();
        console.log(chatbots);
    }
}

const program = new Program(
    new CsvReaderFactory()
);

program.Execute();
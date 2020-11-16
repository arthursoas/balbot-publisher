import { IFactory } from './factories/iFactory';
import { CsvReader } from './factories/csvReader/csvReader';
import { CsvReaderFactory } from './factories/csvReader/csvReaderFactory';
import { Chatbot } from './factories/chatbot/chatbot';
import BlipService from './services/blipService';
import { IBlipService } from './services/iBlipService';

class Program
{
    private _csvReaderFactory: IFactory<CsvReader>;
    private _blipService: IBlipService;

    constructor(
        csvReaderFactory: IFactory<CsvReader>,
        blipService: IBlipService
    ) {
        this._csvReaderFactory = csvReaderFactory;
        this._blipService = blipService;
    }

    async Execute() {
        const csvReader : CsvReader = this._csvReaderFactory
            .Create('./chatbots.csv');

        const chatbots: Array<Chatbot> = await csvReader
            .ReadChatbotsFromCsvAsync();

        try {
            await this._blipService
                .UpdateChatbotFlowAsync(chatbots[0], {'teste':'teste'})
        }
        catch (error) {
            console.log('Oh fuck!', error)
        }

        console.log(chatbots);
    }
}

const program = new Program(
    new CsvReaderFactory(),
    new BlipService()
);

program.Execute();
import { IFactory } from './factories/iFactory';
import { CsvReader } from './factories/csvReader/csvReader';
import { CsvReaderFactory } from './factories/csvReader/csvReaderFactory';
import { Chatbot } from './factories/chatbot/chatbot';
import { BlipService } from './services/blip/blipService';
import { IBlipService } from './services/blip/iBlipService';
import { ILoggerService } from './services/logger/iloggerService';
import { TextFileLoggerService } from './services/logger/textFileLoggerService';
import fs from 'fs';

class Program
{
    private _csvReaderFactory: IFactory<CsvReader>;
    private _blipService: IBlipService;
    private _loggerService: ILoggerService;

    constructor(
        csvReaderFactory: IFactory<CsvReader>,
        blipService: IBlipService,
        loggerService: ILoggerService
    ) {
        this._csvReaderFactory = csvReaderFactory;
        this._blipService = blipService;
        this._loggerService = loggerService;
    }

    async Execute() {
        const csvReader : CsvReader = this._csvReaderFactory
            .Create('./chatbots.csv');

        const chatbots: Array<Chatbot> = await csvReader.ReadChatbotsFromCsvAsync();

        const fsPromisses = fs.promises;
        let balbotFlow: JSON = JSON.parse(
            await fsPromisses.readFile('./src/resources/balbot.json', {encoding: 'utf-8'})
        )

        const publishings: Array<Promise<void>> = chatbots.map(async (chatbot) => {
            try {
                await this._blipService.UpdateChatbotFlowAsync(chatbot, balbotFlow)
            }
            catch (exception: any) {
                this._loggerService.Error(
                    'An error ocurred while updating chatbot flow',
                    exception)
            }
        });

        await Promise.all(publishings);
    }
}

const program = new Program(
    new CsvReaderFactory(),
    new BlipService(),
    new TextFileLoggerService()
);

program.Execute();
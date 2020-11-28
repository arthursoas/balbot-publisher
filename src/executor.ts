import { IFactory } from './factories/iFactory';
import { CsvReader } from './factories/csvReader/csvReader';
import { Chatbot } from './factories/chatbot/chatbot';
import { IBlipService } from './services/blip/iBlipService';
import { ILoggerService } from './services/logger/iloggerService';
import fs from 'fs';

export class Executor
{
    private _chatbotFactory: IFactory<Chatbot>;
    private _csvReaderFactory: IFactory<CsvReader>;
    private _blipService: IBlipService;
    private _loggerService: ILoggerService;

    constructor(
        chatbotFactory: IFactory<Chatbot>,
        csvReaderFactory: IFactory<CsvReader>,
        blipService: IBlipService,
        loggerService: ILoggerService
    ) {
        this._chatbotFactory = chatbotFactory;
        this._csvReaderFactory = csvReaderFactory;
        this._blipService = blipService;
        this._loggerService = loggerService;
    }

    async Execute() {
        const csvReader : CsvReader = this._csvReaderFactory
            .Create(
                './chatbots.csv',
                this._chatbotFactory);

        const chatbots: Array<Chatbot> = await csvReader.ReadChatbotsFromCsvAsync();

        const fsPromisses = fs.promises;
        let balbotFlow: JSON = JSON.parse(
            await fsPromisses.readFile(
                './src/resources/balbot.json',
                {encoding: 'utf-8'})
        );

        const publishings: Array<Promise<void>> = chatbots.map(async (chatbot) => {
            try {
                await this._blipService.UpdateChatbotFlowAsync(chatbot, balbotFlow);
                await this._blipService.PublishChatbotFlowAsync(chatbot, balbotFlow);
            }
            catch (exception: any) {
                this._loggerService.Error(
                    'An error ocurred while updating chatbot flow',
                    exception);
            }
        });

        await Promise.all(publishings);
    }
}
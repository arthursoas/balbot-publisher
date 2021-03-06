import fs from 'fs';
import csv from 'csv-parser';
import { IFactory } from '../iFactory';
import { Chatbot } from '../chatbot/chatbot';

export class CsvReader {
    private _chatbotFactory: IFactory<Chatbot>;
    public FilePath!: string;

    constructor(
        chatbotFactory: IFactory<Chatbot>,
    ) {
        this._chatbotFactory = chatbotFactory;
    }

    async ReadChatbotsFromCsvAsync(): Promise<Array<Chatbot>> {
        const results: Array<Chatbot> = [];
        var csvBuffer = fs
            .createReadStream(this.FilePath)
            .pipe(csv())
            .on('data', (data: any) => {
                const chatbot = this._chatbotFactory.Create(
                    data['Id'],
                    data['Key'],
                    data['CommandUrl'])
                results.push(chatbot)
            })

        return new Promise<Array<Chatbot>> (
            function(resolve) {
                csvBuffer.on('end', () => resolve(results))
            }
        );
    }
}
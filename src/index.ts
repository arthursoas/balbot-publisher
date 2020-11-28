require('dotenv-safe').config();

import { ChatbotFactory } from './factories/chatbot/chatbotFactory';
import { CsvReaderFactory } from './factories/csvReader/csvReaderFactory';
import { BlipService } from './services/blip/blipService';
import { TextFileLoggerService } from './services/logger/textFileLoggerService';
import { Executor } from './executor';

const CHATBOT_FACTORY = new ChatbotFactory();
const CSV_READER_FACTORY = new CsvReaderFactory();
const BLIP_SERVICE = new BlipService();
const TEXT_FILE_LOGGER_SERVICE = new TextFileLoggerService();

const executor = new Executor(
    CHATBOT_FACTORY,
    CSV_READER_FACTORY,
    BLIP_SERVICE,
    TEXT_FILE_LOGGER_SERVICE
);

executor.Execute();
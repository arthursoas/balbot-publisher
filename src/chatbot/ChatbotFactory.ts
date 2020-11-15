import IFactory from '../iFactory';
import Chatbot from './chatbot';

export default class ChatbotFactory implements IFactory<Chatbot>
{
    Create(...args: string[]) : Chatbot {
        if (args.length == 0) return new Chatbot();

        const [id, key, clusterUri] : string[] = args;

        const chatbot = new Chatbot()
        chatbot.Id = id;
        chatbot.Key = key;
        chatbot.ClusterUrl = clusterUri

        return chatbot;
    }
}
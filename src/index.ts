import IFactory from './IFactory';
import Chatbot from './chatbot/Chatbot';
import ChatbotFactory from './chatbot/ChatbotFactory';

class Program
{
    private _chatbotFactory : IFactory<Chatbot>;

    constructor(
        chatbotFactory: IFactory<Chatbot>)
    {
        this._chatbotFactory = chatbotFactory;

        this.Init();
    }

    Init() { }

    Execute()
    {
        const chatbot : Chatbot = this._chatbotFactory.Create(1, 2, 3);

        console.log(chatbot);
    }
}

const program = new Program(
    new ChatbotFactory()
);

program.Execute();
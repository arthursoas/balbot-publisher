import { Chatbot } from '../../factories/chatbot/chatbot';

export interface IBlipService {
    /**
     * Update a chatbot conversational flow
     */
    UpdateChatbotFlowAsync(chatbot: Chatbot, flow: any): Promise<void>;

    /**
     * Publish a chatbot conversational flow
     */
    PublishChatbotFlowAsync(chatbot: Chatbot, flow: any): Promise<void>;
}
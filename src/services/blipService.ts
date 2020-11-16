import axios, { AxiosResponse } from 'axios';
import { Chatbot } from '../factories/chatbot/chatbot';
import { IBlipService } from './iBlipService';

export default class BlipService implements IBlipService {
    public async UpdateChatbotFlowAsync(chatbot: Chatbot, flow: any): Promise<void> {
        var result: AxiosResponse<any> = await axios.post(
            chatbot.ClusterUrl,
            {
                id: `${chatbot.Id}-${new Date()}`,
                method: 'set',
                uri: '/buckets/blip_portal:builder_working_flow',
                type: 'application/json',
                resource: {...flow}
            },
            {
                headers: { 'Authorization': `key ${chatbot.Key}`},
                validateStatus: function (): boolean { return true; }
            }
        )

        this.CheckResult(result);
    };

    private CheckResult(result: AxiosResponse<any>) {
        if (result.status % 200 < 100) return;

        var description: string = '';
        if (result.data['reason']) {
            description = result.data['reason']['description']
        };

        throw new Error(`(${result.status}) Blip request failed with the error: ${description}`)
    }
};
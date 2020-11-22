import axios, { AxiosResponse } from 'axios';
import { Chatbot } from '../../factories/chatbot/chatbot';
import { IBlipService } from './iBlipService';

export class BlipService implements IBlipService {
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

        this.CheckBlipResponse(result);
    };

    private CheckBlipResponse(result: AxiosResponse<any>): undefined {
        if ((result.status >= 200 && result.status < 300)
            && result.data['code'] === undefined) return;

        let description: string = '';
        if (result.data['description']) {
            description += `(${result.data['code']}) `;
            description += `${result.data['description']}`;
        };

        throw new Error(`(${result.status}) Blip request failed with the error: ${description}`)
    }
};
import axios, { AxiosResponse } from 'axios';
import { Chatbot } from '../../factories/chatbot/chatbot';
import { IBlipService } from './iBlipService';
import { BlipConverters } from './blipConverters';

export class BlipService implements IBlipService {
    public async UpdateChatbotFlowAsync(chatbot: Chatbot, flow: any): Promise<void> {
        await this.MakeBlipHttpRequestAsync(
            chatbot,
            'set',
            '/buckets/blip_portal:builder_working_flow',
            'application/json',
            flow
        );
    };

    public async PublishChatbotFlowAsync(chatbot: Chatbot, flow: any): Promise<void> {
        const application: any = BlipConverters.ConvertFlowToApplication(chatbot, flow);

        await this.MakeBlipHttpRequestAsync(
            chatbot,
            'set',
            'lime://builder.hosting@msging.net/configuration',
            'application/json',
            {
                Template: 'builder',
                Application: {...application}
            }
        );

        await this.MakeBlipHttpRequestAsync(
            chatbot,
            'set',
            '/buckets/blip_portal:builder_published_flow',
            'application/json',
            flow
        );
    }

    private async MakeBlipHttpRequestAsync(chatbot: Chatbot, method: string, uri: string, type: string, resource: any): Promise<void> {
        const response: AxiosResponse<any> = await axios.post(
            chatbot.CommandUrl,
            {
                id: `${chatbot.Id}-${new Date()}`,
                method: method,
                uri: uri,
                type: type,
                resource: {...resource}
            },
            {
                headers: { 'Authorization': `key ${chatbot.Key}`},
                validateStatus: function (): boolean { return true; }
            }
        );

        this.CheckBlipResponse(response);
    }

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
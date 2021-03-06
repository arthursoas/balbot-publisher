import axios, { AxiosResponse } from 'axios';
import { Chatbot } from '../../factories/chatbot/chatbot';
import { IBlipService } from './iBlipService';
import { BlipOperations } from './blipOperations';

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
        const application: any = BlipOperations.ConvertFlowToApplication(chatbot, flow);
        const configurationRequests: Array<Promise<void>> = [
            // Publish flow effectively
            this.MakeBlipHttpRequestAsync(
                chatbot,
                'set',
                'lime://builder.hosting@msging.net/configuration',
                'application/json',
                {
                    Template: 'builder',
                    Application: {...application}
                }
            ),
            // Save published flow on bucket for restoration purposes
            this.MakeBlipHttpRequestAsync(
                chatbot,
                'set',
                '/buckets/blip_portal:builder_published_flow',
                'application/json',
                flow
            ),
            // Save current configuration on bucket for restoration purposes
            this.MakeBlipHttpRequestAsync(
                chatbot,
                'set',
                '/buckets/blip_portal:builder_working_configuration',
                'application/json',
                application.settings.flow.configuration
            ),
            // Save published configuration on bucket for restoration purposes
            this.MakeBlipHttpRequestAsync(
                chatbot,
                'set',
                '/buckets/blip_portal:builder_published_configuration',
                'application/json',
                application.settings.flow.configuration
            )
        ];
        await Promise.all(configurationRequests);

        // Get flow versions lists
        const publications = await this.MakeBlipHttpRequestAsync(
            chatbot,
            'get',
            '/buckets/blip_portal:builder_latestpublications?$take=100',
            undefined,
            undefined,
            true
        );
        const newPublications = BlipOperations.AddReleaseToPublications(publications)
        const latestPublicationsRequests: Array<Promise<void>> = [
            // Update the latest version flow for restoration purpose
            this.MakeBlipHttpRequestAsync(
                chatbot,
                'set',
                '/buckets/blip_portal:builder_latestpublications',
                'application/json',
                newPublications
            ),
            // Add publishing to versioning list
            this.MakeBlipHttpRequestAsync(
                chatbot,
                'set',
                `/buckets/blip_portal:builder_latestpublications:${newPublications.lastInsertedIndex}`,
                'application/json',
                {
                    configuration: application.settings.flow.configuration,
                    flow: flow
                }
            )
        ];
        await Promise.all(latestPublicationsRequests);
    }

    private async MakeBlipHttpRequestAsync(
        chatbot: Chatbot,
        method: string,
        uri: string,
        type: string | undefined = undefined,
        resource: any = undefined,
        ignoreErrors: boolean = false): Promise<any>
    {
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
        if (!ignoreErrors) this.CheckBlipResponse(response);

        if (response.data.resource) return response.data.resource;
    }

    private CheckBlipResponse(result: AxiosResponse<any>): undefined {
        if ((result.status >= 200 && result.status < 300)
            && result.data['code'] === undefined) return;

        let description: string = '';
        if (result.data['description']) {
            description += `(${result.data['code']}) `;
            description += `${result.data['description']}`;
        };

        throw new Error(`(${result.status}) Blip request failed with the error: ${description}`);
    }
};
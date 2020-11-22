import axios, { AxiosResponse } from 'axios';
import { v4 } from 'uuid';
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
        );

        this.CheckBlipResponse(result);
    };

    public async PublishChatbotFlowAsync(chatbot: Chatbot, flow: any): Promise<void> {
        const application: any = this.ConvertFlowToApplication(chatbot, flow);

        var result: AxiosResponse<any> = await axios.post(
            chatbot.ClusterUrl,
            {
                id: `${chatbot.Id}-${new Date()}`,
                method: 'set',
                uri: 'lime://builder.hosting@msging.net/configuration',
                type: 'application/json',
                resource: {
                    Template: 'builder',
                    Application: {...application}
                }
            },
            {
                headers: { 'Authorization': `key ${chatbot.Key}`},
                validateStatus: function (): boolean { return true; }
            }
        )

        this.CheckBlipResponse(result);
    }

    private ConvertFlowToApplication(chatbot: Chatbot, flow: any): any {
        const application = this.CreateApplicationBase(chatbot);

        application.settings.flow.states = Object.keys(flow).map((key: any) => {
            const flowState: any = flow[key];

            return {
                id: key,
                root: flowState.root || false,
                name: flowState['$title'],
                inputActions: this.CreateInputActions(
                    flowState['$contentActions']),
                input: this.CreateInput(
                    flowState['$contentActions']),
                outputActions: [],
                outputs: this.CreateOutputs(
                    flowState['$conditionOutputs'],
                    flowState['$defaultOutput'])
            };
        });

        return application;
    }

    private CreateApplicationBase(chatbot: Chatbot): any {
        return {
            identifier: chatbot.Id,
            accessKey: chatbot.Key,
            messageReceivers: [{ type: 'MessageReceiver' }],
            notificationReceivers: [{ type: 'DeskNotificationReceiver' }],
            serviceProviderType: 'ServiceProvider',
            settingsType: 'Settings',
            settings: {
                flow: {
                    id: `balbot10-${v4().substring(9)}`,
                    inputActions: [],
                    outputActions: [],
                    configuration: {
                        'builder:minimumIntentScore': '0.5',
                        'builder:stateTrack': 'false'
                    },
                    states: []
                }
            }
        }
    }

    private CreateInputActions(contentActions: any): Array<any> {
        return contentActions
            .filter((action: any) => (Boolean(action.action)) )
            .map((action: any) => (
                {
                    type: action.action.type,
                    settings: {
                        ...action.action.settings,
                        metadata: {
                            '#stateName':'{{state.name}}',
                            '#stateId':'{{state.id}}',
                            '#messageId':'{{input.message@id}}'
                        }
                    }
                }
            ));
    }

    private CreateInput(contentActions: any): any {
        const input: any = contentActions
            .find((action: any) => (Boolean(action.input)))
            .input;

        return { bypass: input.bypass };
    }

    private CreateOutputs(conditionOutputs: any, defaultOutput: any): Array<any> {
        const outputs: Array<any> = conditionOutputs
            .map((output: any) => (
                {
                    stateId: output.stateId,
                    conditions: output.conditions
                }
            ));
        outputs.push({ stateId: defaultOutput.stateId });

        return outputs;
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
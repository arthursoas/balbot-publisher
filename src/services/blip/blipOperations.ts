import { v4 } from 'uuid';
import { Chatbot } from '../../factories/chatbot/chatbot';

export class BlipOperations {
    public static AddReleaseToPublications(latestPublications: any): any {
        let pubs: Array<any> = [];
        if (latestPublications && latestPublications.publications) {
            pubs = [...latestPublications.publications];
        }

        pubs.sort((pub1: any, pub2: any) => (
            (pub1.index > pub2.index) ? 1 : -1
        ))
        if (pubs.length >= 5) pubs.shift();

        const index = (pubs.length > 0) ? (pubs[pubs.length - 1].index + 1) : 0;
        pubs.push({
            name: `Balbot v${process.env.BALBOT_VERSION}`,
            publishedAt: new Date().toISOString(),
            index: index
        })

        return {
            lastInsertedIndex: index,
            publications: pubs
        };
    }

    public static ConvertFlowToApplication(chatbot: Chatbot, flow: any): any {
        const application = this.CreateApplicationBase(chatbot);

        application.settings.flow.states = Object.keys(flow).map((key: any) => {
            const flowState: any = flow[key];

            return {
                id: key,
                root: flowState.root || false,
                name: flowState['$title'],
                inputActions: this.CreateInputActions(
                    flowState['$contentActions'],
                    flowState['$enteringCustomActions']),
                input: this.CreateInput(
                    flowState['$contentActions']),
                outputActions: this.CreateOuputActions(
                    flowState['$leavingCustomActions']),
                outputs: this.CreateOutputs(
                    flowState['$conditionOutputs'],
                    flowState['$defaultOutput'])
            };
        });

        return application;
    }

    private static CreateApplicationBase(chatbot: Chatbot): any {
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
        };
    }

    private static CreateInputActions(contentActions: any, enteringActions: any): Array<any> {
        let inputActions: Array<any> = contentActions
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

        return inputActions.concat(enteringActions.map((action: any) => (
            {
                type: action.type,
                settings: action.settings,
                conditions: action.conditions
            }
        )));
    }

    private static CreateOuputActions(leavingActions: any): Array<any> {
        return leavingActions.map((action: any) => (
            {
                type: action.type,
                settings: action.settings,
                conditions: action.conditions
            }
        ));
    }

    private static CreateInput(contentActions: any): any {
        const input: any = contentActions
            .find((action: any) => (Boolean(action.input)))
            .input;

        return { bypass: input.bypass };
    }

    private static CreateOutputs(conditionOutputs: any, defaultOutput: any): Array<any> {
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
}
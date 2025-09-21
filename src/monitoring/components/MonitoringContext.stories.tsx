import MonitoringConsent from './MonitoringConsent';
import {Meta, StoryFn} from '@storybook/react';
import {Dialog, DialogContent} from '@mui/material';
import {fn} from 'storybook/internal/test';

export default {
    title: 'Monitoring/MonitoringConsent',
    component: MonitoringConsent,
} as Meta<typeof MonitoringConsent>;

const Template: StoryFn<typeof MonitoringConsent> = (args: any) => {
    const onClose = (value: boolean) => {
        args.onComplete(value);
        if (value) {
            alert("The dialog would now close after you refused to share data");
        } else {
            alert("The dialog would now close after you agreed to share data");
        }
    };
    return (
        <Dialog open={true} aria-labelledby="monitoring-consent-dialog">
            <DialogContent>
                <MonitoringConsent onComplete={onClose}/>
            </DialogContent>
        </Dialog>)
}

export const Default = Template.bind({});
Default.args = {
    onComplete: fn()
};
import {useEffect, useState} from "react";

import {Button, Divider, Stack} from "@mui/material";
import {ThumbUp, ThumbDown} from "@mui/icons-material";

export default function MonitoringConsent({onComplete}: { onComplete: (value: boolean) => void }) {
    const [enabled, setEnabled] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        if (enabled !== undefined) {
            document.cookie = `APPLICATION_MONITORING=${enabled ? 'allowed' : 'denied'}; path=/; max-age=${60 * 60 * 24 * 365}`;
            onComplete(enabled);
        }
    }, [enabled])
    return <Stack spacing={4} padding={2}>
        <div>
            <p>
                This application collect anonymous usage data to help us improve, including automatic error reporting.
                You may choose to opt-in or opt-out of this data collection. Acceptance is not required to use the application.
            </p>
            <p>
                Your answer will be stored in a cookie in your browser, so if you clear your cookies you will be asked again.
            </p>
            <p>
                This setting can be changed at any time in the application settings.
            </p>
        </div>
        <Divider/>

        <Button variant="contained" color="primary"
                startIcon={<ThumbUp/>}
                onClick={() => setEnabled(true)}>
            Yes, I agree to share anonymous usage data
        </Button>
        <Button variant="contained" color="error"
                startIcon={<ThumbDown/>}
                onClick={() => setEnabled(false)}>
            No, I do not want to share any usage data
        </Button>

    </Stack>
}
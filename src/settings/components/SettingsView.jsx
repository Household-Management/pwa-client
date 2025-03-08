import {Stack, Button} from "@mui/material";
import {useContext} from "react";
import {ServiceWorkerContext} from "../../service-worker/ServiceWorkerContext";
import {useDispatch} from "react-redux";

export default function () {
    const wb = useContext(ServiceWorkerContext);
    const dispatch = useDispatch();
    function logOut() {
        wb.active.then(async () => {
            const response = await wb.messageSW({
                type: "SIGN_OUT"
            });
            console.log("Received sign out response");
            dispatch(response);
        });
    }
    return <Stack spacing={2}>
        <Button onClick={logOut}>Log Out</Button>
    </Stack>
}
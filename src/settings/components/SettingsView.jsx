import {Stack, Button} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import {useContext} from "react";
import {ServiceWorkerContext} from "../../service-worker/ServiceWorkerContext";
import {useDispatch} from "react-redux";
import {useHeader} from "../../layout/hooks/HeaderContext";

export default function () {
    const wb = useContext(ServiceWorkerContext);
    const dispatch = useDispatch();
    const { setHeaderContent} = useHeader()
    setHeaderContent(null)
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
        <Button variant="contained" color="error" onClick={logOut}>
            <LogoutIcon/>
            Sign Out
        </Button>
    </Stack>
}
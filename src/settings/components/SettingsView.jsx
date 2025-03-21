import {Stack, Button} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import {useContext, useEffect} from "react";
import {ServiceWorkerContext} from "../../service-worker/ServiceWorkerContext";
import {useDispatch} from "react-redux";
import {useHeader} from "../../layout/hooks/HeaderContext";
import {signOut} from "@aws-amplify/auth";
import {useCookies} from "react-cookie";

export default function () {
    const wb = useContext(ServiceWorkerContext);
    const dispatch = useDispatch();
    const { setHeaderContent} = useHeader()
    const [cookies, setCookie] = useCookies();
    useEffect(() => {
        setHeaderContent(null)
    }, []);
    function logOut() {
        wb.active.then(async () => {
            await signOut();
            setCookie('household', null);
            // const response = await wb.messageSW({
            //     type: "SIGN_OUT"
            // });
            // console.log("Received sign out response");
            dispatch({
                type: "UNAUTHENTICATED"
            });
        });
    }
    return <Stack spacing={2}>
        <Button variant="contained" color="error" onClick={logOut}>
            <LogoutIcon/>
            Sign Out
        </Button>
    </Stack>
}
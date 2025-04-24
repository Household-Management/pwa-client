import {Button} from "@mui/material";
import {signOut} from "@aws-amplify/auth";
import {useDispatch} from "react-redux";
import {useCookies} from "react-cookie";
import LogoutIcon from "@mui/icons-material/Logout";

export default function LogOutButton({label}) {
    const dispatch = useDispatch();
    const [cookies, setCookie] = useCookies();

    function logOut() {
        signOut().then(() => {
            setCookie('household', null);
            dispatch({
                type: "UNAUTHENTICATED"
            });
        });
    }
    return <Button variant="contained" color="error" onClick={logOut}>
        <LogoutIcon/>
        { label || "Sign Out" }
    </Button>
}
import {IconButton, InputAdornment, TextField, TextFieldProps} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useState} from "react";

export default function PasswordField(props: TextFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    return <TextField
        {...props}
        type={showPassword ? "text" : "password"}
        slotProps={{
            input: {
                endAdornment: (<InputAdornment position="end">
                    <IconButton
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Visibility/> : <VisibilityOff/>}
                    </IconButton>
                </InputAdornment>)
            }
        }}
    />
}
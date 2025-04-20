import React, {useContext, useEffect, useState} from "react";
import {DataClientContext} from "../../graphql/DataClient";
import {getCurrentUser} from "aws-amplify/auth";
import {Box, Button, LinearProgress, Modal, Stack, TextField, Typography} from "@mui/material";
import PropTypes from "prop-types";

export default function HouseholdJoinModal({open, loading, errorMessage, onCancel, onSubmit}) {
    const [inviteCode, setInviteCode] = useState('');
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        if (inviteCode) {
            if(inviteCode.length !== 8) {
                setValidationError("Invite code must be 8 characters long");
            } else {
                setValidationError(null);
                handleInviteCodeSubmit();
            }
        }
    }, [inviteCode]);

    const handleInviteCodeSubmit = async () => {
        console.log(`Invite code submitted: ${inviteCode}`);
        if (inviteCode.length === 8) {
            onSubmit(inviteCode);
        }
    };

    const handleInviteCodeChange = (e) => {
        setInviteCode(e.target.value);
    };

    return <Modal open={open}>

        <Box sx={{width: 300, bgcolor: 'background.paper', p: 4, margin: 'auto', marginTop: '10%'}}>
            <Typography sx={{textAlign: "center"}}>
                Enter Invite Code
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                label="Invite Code"
                value={inviteCode}
                onChange={handleInviteCodeChange}
            />
            {errorMessage && (
                <Typography color="error" sx={{textAlign: "center"}}>
                    {errorMessage}
                </Typography>
            )}
            {validationError && (
                <Typography color="error" sx={{textAlign: "center"}}>
                    {validationError}
                </Typography>
            )}
            {loading && <LinearProgress/> }
            <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="outlined" color="error" onClick={onCancel}>
                    Cancel
                </Button>
            </Stack>
        </Box>
    </Modal>
}

HouseholdJoinModal.propTypes = {
    open: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    errorMessage: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};
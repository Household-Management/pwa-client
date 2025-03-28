import React, {Fragment, useContext, useEffect, useState} from 'react';
import {
    Box,
    Modal,
    List,
    ListItem,
    ListItemText,
    Typography,
    LinearProgress,
    TextField,
    Button, Stack
} from '@mui/material';
import PropTypes from "prop-types";
import {getCurrentUser} from "aws-amplify/auth";
import {DataClientContext} from "../../graphql/DataClient";
import LogOutButton from "../../authentication/components/LogOutButton";
import {useSelector} from "react-redux";

export default function HouseholdSelector({open, onClose, onClick, households, loading}) {
    const dataClient = useContext(DataClientContext);
    const [inviteCodeModalOpen, setInviteCodeModalOpen] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const user = useSelector(state => state.user.user);

    const createHousehold = () => {
        getCurrentUser().then(async user => {
            const createdHousehold = await dataClient.models.Household.create({
                name: `${user.signInDetails.loginId}'s Household`,
                membersGroup: [user.userId],
                adminGroup: [user.userId]
            });

            const createdHouseholdTasks = await dataClient.models.HouseholdTasks.create({
                householdId: createdHousehold.data.id
            });
            await dataClient.models.TaskList.create({
                householdTasksId: createdHouseholdTasks.data.id
            });
            await dataClient.models.Kitchen.create({
                householdId: createdHousehold.data.id
            });
            await dataClient.models.HouseholdRecipes.create({
                householdId: createdHousehold.data.id
            });
            onClick(createdHousehold.data);
        })
    };

    useEffect(() => {
        if(inviteCode && inviteCode.length === 8) {
            handleInviteCodeSubmit();
        }
    }, [inviteCode]);

    const handleInviteCodeSubmit = async () => {
        const user = await getCurrentUser();
        console.log(`Invite code submitted: ${inviteCode}`);
        const response = await dataClient.mutations.JoinHousehold({
            inviteCode,
            joinerId: user.userId
        });
        if (response.errors) {
            setErrorMessage('Failed to join household. Please check the invite code and try again.');
        } else {
            // TODO: After successfully joining a household, we need to refresh the page to reflect the new household
            setInviteCodeModalOpen(false);
            setErrorMessage('');
        }


    };

    const handleInviteCodeChange = (e) => {
        const code = e.target.value;
        setInviteCode(code);
    };

    return <Fragment>
        <Modal open={open} onClose={onClose}>
            <Box sx={{width: 400, bgcolor: 'background.paper', p: 4, margin: 'auto', marginTop: '10%'}}>
                {loading ? <div style={{flex: 1}}>
                        <Typography sx={{textAlign: "center"}}>
                            Loading your households...
                        </Typography>
                        <LinearProgress/>
                    </div>
                    :
                    <Fragment>
                        <Typography sx={{textAlign: "center"}}>
                            Signed in as {user.signInDetails.loginId}
                        </Typography>
                        <Typography sx={{textAlign: "center"}}>
                            Select a household
                        </Typography>
                        <Stack spacing={4} direction="column">
                            <List>
                                {households && households.map((household) => (
                                    <ListItem button variant="contained" key={household.id}
                                              onClick={() => onClick(household)}>
                                        <ListItemText primary={household.name}/>
                                    </ListItem>
                                ))}
                                <ListItem button>
                                    <ListItemText primary="Join a different household"
                                                  onClick={() => setInviteCodeModalOpen(true)}/>
                                </ListItem>
                                <ListItem variant="contained" button>
                                    <ListItemText primary="Create your own household" onClick={createHousehold}/>
                                </ListItem>
                            </List>
                            <LogOutButton label={"Log into a different account"}/>
                        </Stack>
                    </Fragment>
                }
            </Box>
        </Modal>
        <Modal open={inviteCodeModalOpen} onClose={() => setInviteCodeModalOpen(false)}>
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
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button variant="outlined" color="secondary" onClick={() => setInviteCodeModalOpen(false)}>
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Modal>
    </Fragment>
}

HouseholdSelector.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    households: PropTypes.array.isRequired,
    loading: PropTypes.bool
}
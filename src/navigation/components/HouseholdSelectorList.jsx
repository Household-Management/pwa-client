import React, {Fragment, useContext, useEffect, useState} from 'react';
import {
    Box,
    Modal,
    List,
    ListItem,
    ListItemText,
    Typography,
    LinearProgress,
    Stack
} from '@mui/material';
import PropTypes from "prop-types";

export default function HouseholdSelectorList({user, households, loading, onJoinHousehold, onSelectHousehold, onCreateHousehold}) {
    return <Fragment>
        <Modal open={true}>
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
                                {households.map((household) => (
                                    <ListItem button variant="contained" key={household.id}
                                              onClick={() => onSelectHousehold(household)}>
                                        <ListItemText primary={household.name}/>
                                    </ListItem>
                                ))}
                                <ListItem button>
                                    <ListItemText primary="Join a different household"
                                                  onClick={onJoinHousehold}/>
                                </ListItem>
                                <ListItem variant="contained" button>
                                    <ListItemText primary="Create your own household" onClick={onCreateHousehold}/>
                                </ListItem>
                            </List>
                        </Stack>
                    </Fragment>
                }
            </Box>
        </Modal>
    </Fragment>
}

HouseholdSelectorList.propTypes = {
    households: PropTypes.array.isRequired, // Array of household objects
    loading: PropTypes.bool, // If loading is occurring
    onJoinHousehold: PropTypes.func.isRequired, // Callback function when the button to join a household is clicked
    onSelectHousehold: PropTypes.func.isRequired, // Callback function when a button to open a household is clicked
    onCreateHousehold: PropTypes.func.isRequired
}
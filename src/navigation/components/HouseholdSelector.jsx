import React, {Fragment, useContext, useEffect, useState} from 'react';
import {Box, CircularProgress, Modal, List, ListItem, ListItemText, Typography, LinearProgress} from '@mui/material';
import PropTypes from "prop-types";
import {getCurrentUser} from "aws-amplify/auth";
import {DataClientContext} from "../../graphql/DataClient";

// TODO: Implement creating and joining new Households
export default function HouseholdSelector({open, onClose, onClick, households, loading}) {
    const dataClient = useContext(DataClientContext);
    const createHousehold = () => {
        getCurrentUser().then(async user => {

            const createdHousehold = await dataClient.models.Household.create({
                name: `${user.signInDetails.loginId}'s Household`,
                membersGroup: [user.userId],
                adminGroup: [user.userId]
            });
            // FIXME: Put this creation logic somewhere specific instead of embedded inside a random component.

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
            // FIXME: We're creating and getting back the new item, then we're fetching it.
            onClick(createdHousehold.data);
        })
    };
    return <Modal open={open} onClose={onClose}>
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
                        Select a household
                    </Typography>
                    <List>
                        {households && households.map((household) => (
                            <ListItem button variant="contained" key={household.id} onClick={() => onClick(household)}>
                                <ListItemText primary={household.name}/>
                            </ListItem>
                        ))}
                        <ListItem variant="contained" button>
                            <ListItemText primary="Create your own household" onClick={createHousehold}/>
                        </ListItem>
                    </List>
                </Fragment>
            }
        </Box>
    </Modal>
}

HouseholdSelector.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    households: PropTypes.array.isRequired,
    loading: PropTypes.bool
}
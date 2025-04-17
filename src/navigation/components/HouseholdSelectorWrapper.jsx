import React, {Fragment, useContext, useEffect, useState} from "react";
import HouseholdSelectorList from "./HouseholdSelectorList";
import {getCurrentUser, fetchAuthSession} from "aws-amplify/auth";
import {DataClientContext} from "../../graphql/DataClient";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import LogOutButton from "../../authentication/components/LogOutButton";
import HouseholdJoinModal from "./HouseholdJoinModal";
// TODO: After selecting a household, show a spinner while it loads
/**
 * Functionality wrapper around the household selection components.
 */
export default function HouseholdSelectorWrapper() {
    const [loading, setLoading] = useState(true);
    const [householdsLoaded, setHouseholdsLoaded] = useState(false);
    const [households, setHouseholds] = useState([]);
    const [error, setError] = useState(null);
    const dataClient = useContext(DataClientContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['household']);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const user = useSelector(state => state.user.user);

    const [processingInvite, setProcessingInvite] = useState(false);
    const [inviteError, setInviteError] = useState(null);

    useEffect(() => {
        if (!householdsLoaded) {
            async function fetchHouseholds() {
                try {
                    setHouseholdsLoaded(true);
                    setCookie('household', null);
                    const userSession = await fetchAuthSession({
                        forceRefresh: true
                    });
                    if (hasGroups(userSession)) {
                        const response = await dataClient.models.Household.list({
                            filter: {
                                or : userSession.tokens.accessToken.payload['cognito:groups'].map(group => {
                                    if(group.startsWith("admin-") || group.startsWith("members-")) {
                                        return {id: {eq: group.substring(group.indexOf("-") + 1)}};
                                    }
                                }).filter(_ => _)
                            },
                            selectionSet: [
                                "name",
                                "id",
                                "adminGroup",
                                "membersGroup",
                            ]
                        });
                        if (!response.errors) {
                            setHouseholds(response.data);
                        } else {
                            // TODO: Report errors
                            throw new Error("Error fetching households");
                        }
                    }
                } catch (err) {
                    setError(err);
                } finally {
                    setLoading(false);
                }
            }

            if (cookies.household) {
                selectHousehold({id: cookies.household})
                    .then(() => {
                    }, err => {
                        setHouseholdsLoaded(false);
                        cookies.household = null;
                        fetchHouseholds();
                    });
            } else if (open) {
                fetchHouseholds();
            }
        }
    }, [householdsLoaded]);

    const createHousehold = () => {
        console.log("Creating new household...");
        setLoading(true);
        // TODO: Replace after implementation of Issue #11
        getCurrentUser().then(async user => {
            const createdHousehold = await dataClient.mutations.CreateHousehold({
                name: `${user.signInDetails.loginId}'s Household`,
            });
            setLoading(false);
            if(!createdHousehold.errors) {
                // Force update of accessToken after group changes
                await fetchAuthSession({
                    forceRefresh: true
                });
                await selectHousehold(createdHousehold.data);
            } else {
                setError(new Error("Failed to create household."));
            }
        })
    };

    async function selectHousehold(household) {
        const selected = await dataClient.models.Household.get(household,
            {
                selectionSet: ["id",
                    "name",
                    "membersGroup",
                    "adminGroup",
                    "householdTasks.*",
                    "householdTasks.taskLists.*",
                    "kitchen.*",
                    "recipes.*",
                    "householdTasks.taskLists.taskItems.*"
                ],

            });
        if (selected.errors) {
            console.error("Errors on selecting household", selected.errors);
            setError("Error selecting household");
            setLoading(false);
            throw new Error();
        }
        if (!selected.data) {
            console.error("No data on selecting household");
            setError("Error selecting household");
            setLoading(false);
            throw new Error();
        }
        if (!selected.errors && selected.data) {
            setCookie('household', household.id);
            dispatch({
                type: "LOADED_STATE",
                payload: await selected.data
            });
            navigate("/tasks");
        }
    }

    async function handleInviteCodeSubmit(inviteCode) {
        setProcessingInvite(true);
        const user = await getCurrentUser();

        const response = await dataClient.mutations.JoinHousehold({
            inviteCode,
            joinerId: user.userId
        });

        if (response.errors) {
            setInviteError('Failed to join household. Please check the invite code and try again.');
            setProcessingInvite(false);
        } else {
            // TODO: After successfully joining a household, we need to refresh the page to reflect the new household
            setInviteModalOpen(false);
            setInviteError('');
            setProcessingInvite(false);
        }
    }

    return <Fragment>
        <HouseholdSelectorList
            user={user}
            errorMessage={error?.message}
            loading={loading}
            households={households}
            onClick={selectHousehold}
            onCreateHousehold={createHousehold}
            onSelectHousehold={selectHousehold}
            onJoinHousehold={setInviteModalOpen.bind(null, true)}
        />
        <LogOutButton label={"Log into a different account"}/>
        <HouseholdJoinModal
            open={inviteModalOpen}
            errorMessage={inviteError}
            loading={processingInvite}
            onCancel={() => setInviteModalOpen(false)}
            onSubmit={handleInviteCodeSubmit}
        />
    </Fragment>
}

function hasGroups(authSession) {
    const groups = authSession.tokens.accessToken.payload['cognito:groups'];

    return groups && groups.length > 0;
}
import React, {useContext, useEffect, useState} from "react";
import HouseholdSelector from "./HouseholdSelector";
import {getCurrentUser} from "aws-amplify/auth";
import {DataClientContext} from "../../graphql/DataClient";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";

//TODO: After selecting a household, save that selection and use it automatically next time.
export default function HouseholdSelectorWrapper() {
    const [loading, setLoading] = useState(true);
    const [households, setHouseholds] = useState(null);
    const [error, setError] = useState(null);
    const dataClient = useContext(DataClientContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['household']);

    useEffect(() => {
        if (!households) {
            async function fetchHouseholds() {
                try {
                    setCookie('household', null);
                    const user = await getCurrentUser();
                    // Stub API call
                    const response = await dataClient.models.Household.list({
                        filter: {
                            adminGroup: {
                                contains: user.userId
                            }
                        },
                        selectionSet: [
                            "name",
                            "id"
                        ]
                    });
                    if (!response.errors) {
                        setHouseholds(response.data);
                    } else {
                        // TODO: Report errors
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
                        fetchHouseholds();
                    });
            } else if (open) {
                fetchHouseholds();
            }
        }
    }, [households]);

    async function selectHousehold(household) {
        const selected = await dataClient.models.Household.get(household,
            {
                selectionSet: ["id", "name", "membersGroup", "adminGroup", "householdTasks.*", "householdTasks.taskLists.*", "kitchen.*", "recipes.*"],

            });
        if (selected.errors) {
            console.error("Errors on selecting household", selected.errors);
            throw new Error();
        }
        if (!selected.data) {
            console.error("No data on selecting household");
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

    return <HouseholdSelector
        open={true}
        loading={loading}
        households={households}
        onClick={selectHousehold}
    />;
}

async function resolve(data) {
    return Object.keys(data).reduce(async (object, key) => {
        if (data[key].then) {
            object[key] = await data[key];
        } else {
            object[key] = data[key];
        }
        return object;
    }, {});
}
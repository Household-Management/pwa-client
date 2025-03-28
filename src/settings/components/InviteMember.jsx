import React, {useState, useEffect, useContext, Fragment} from 'react';
import {DataClientContext} from "../../graphql/DataClient";

const InviteMember = ({householdId}) => {
    const [inviteCode, setInviteCode] = useState(null);
    const [error, setError] = useState(null);
    const dataClient = useContext(DataClientContext);

    useEffect(() => {
        if (!inviteCode) {
            const fetchInviteCode = async () => {
                try {
                    const response = await dataClient.mutations.InviteToHousehold({householdId});
                    if (response.errors) {
                        throw new Error(response.errors[0].message);
                    }
                    setInviteCode(response.data);
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchInviteCode();
        }
    }, [inviteCode]);

    return (
        <div>
            {error && <p>Error: {error}</p>}
            {inviteCode ? <Fragment>
                <p>Share this code with the person you wish to invite</p>
                <p>{inviteCode}</p>
            </Fragment> : (
                <p>Generating invite code...</p>
            )}
        </div>
    );
};

export default InviteMember;
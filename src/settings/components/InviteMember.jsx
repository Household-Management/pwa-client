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
                    setInviteCode(JSON.parse(response.data));
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
            {!error ? (inviteCode ? <Fragment>
                <p>Share one of these codes with the person you wish to invite</p>
                <ul>{inviteCode.map(c => {
                    return <li>
                        {c}
                    </li>
                })}</ul>
            </Fragment> : (
                <p>Generating invite code...</p>
            )) : null}
        </div>
    );
};

export default InviteMember;
import {defineBackend} from '@aws-amplify/backend';
import * as iam from "aws-cdk-lib/aws-iam";
import {auth} from './auth/resource';
import {data} from './data/resource';
import {inviteFunction, joinFunction, createHouseholdFunction} from "./functions/resource";
import {cognitoUserPoolsTokenProvider} from 'aws-amplify/auth/cognito';
import {CookieStorage} from 'aws-amplify/utils';


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
    inviteFunction,
    joinFunction,
    createHouseholdFunction,
    auth,
    data,
});
// TODO: A backend function to delete non-repeating completed tasks in the past
//@ts-ignore
inviteFunction.configure(backend);
//@ts-ignore
joinFunction.configure(backend);
//@ts-ignore
createHouseholdFunction.configure(backend);

cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());
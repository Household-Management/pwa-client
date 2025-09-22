import {generateClient} from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";

const amplifyClient = generateClient<Schema>();
export default amplifyClient;
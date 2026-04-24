import { Amplify } from "aws-amplify";

const region = import.meta.env.VITE_AWS_REGION || "eu-north-1";
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID || "eu-north-1_Jpd1eE1wJ";
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID || "48ip13sdqqc03pfr8gfoh769ji";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId
    }
  },
  ssr: false
});

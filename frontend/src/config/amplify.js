import { Amplify } from "aws-amplify";

const awsConfig = {
  Auth: {
    region: "eu-north-1",
    userPoolId: "eu-north-1_Jpd1eE1wJ",
    userPoolWebClientId: "48ip13sdqqc03pfr8gfoh769ji",
    authenticationFlowType: "USER_PASSWORD_AUTH"
  }
};

Amplify.configure(awsConfig);

export default awsConfig;

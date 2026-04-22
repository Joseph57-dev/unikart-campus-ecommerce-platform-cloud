import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-north-1_Jpd1eE1wJ",
      userPoolClientId: "48ip13sdqqc03pfr8gfoh769ji",
      region: "eu-north-1"
    }
  }
});
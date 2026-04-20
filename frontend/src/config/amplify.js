import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    region: import.meta.env.VITE_AWS_REGION || 'eu-north-1',
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'eu-north-1_Jpd1eE1wJ',
    userPoolWebClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '48ip13sdqqc03pfr8gfoh769ji',
    authenticationFlowType: 'USER_SRP_AUTH',
    oauth: {
      domain: import.meta.env.VITE_COGNITO_DOMAIN || 'your-domain.auth.eu-north-1.amazoncognito.com',
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: import.meta.env.VITE_REDIRECT_SIGN_IN || 'http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com/',
      redirectSignOut: import.meta.env.VITE_REDIRECT_SIGN_OUT || 'http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com/',
      responseType: 'code'
    }
  }
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;

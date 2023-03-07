import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
  login: async (req, res) => {
    const authorizationParams = {
      scope: "openid profile email", // or AUTH0_SCOPE
    };

    await handleLogin(req, res, {
      authorizationParams,
      returnTo: "/dashboard",
    });
  },
});

import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Prisma } from "@prisma/client";
import { db } from "services/db";

export default withApiAuthRequired(async (req, res) => {
  if (req.method === "GET") {
    try {
      let users;

      if (req.body) {
        users = await db.user.findMany(req.body);
      } else {
        users = await db.user.findMany();
      }

      res.json(users);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Error unknown" });
      }
    }

    return;
  }

  // switch (method) {
  //   case "POST":
  //     // parse in form body
  //     const userInput = JSON.parse(req.body);

  //     // validate user does not exists
  //     var userExists = await prisma.user.findUnique({
  //       where: {
  //         email: userInput.email,
  //       },
  //     });

  //     if (userExists) {
  //       res.status(422);
  //       var result = "Email exists.";
  //       break;
  //     } else {
  //       var auth0 = new AuthenticationClient({
  //         domain: process.env.AUTH0_DOMAIN,
  //         clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  //         clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  //         audience: process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/",
  //         scope:
  //           "read:users create:users update:users delete:users read:roles create:role_members",
  //       });
  //       var response = await auth0.clientCredentialsGrant({
  //         audience: "https://moldesign.us.auth0.com/api/v2/",
  //         scope:
  //           "read:users create:users update:users delete:users read:roles create:role_members",
  //       });
  //       var management = new ManagementClient({
  //         token: response.access_token,
  //         domain: process.env.AUTH0_DOMAIN,
  //       });
  //       var roles = [];
  //       var clients = [];

  //       userInput.roles.forEach((role) => {
  //         roles.push({ roles: { connect: { id: role } } });
  //       });
  //       userInput.clients.forEach((client) => {
  //         clients.push({ clients: { connect: { id: client } } });
  //       });
  //       var result = await prisma.User.create({
  //         data: {
  //           active: userInput.active,
  //           first_name: userInput.first_name,
  //           last_name: userInput.last_name,
  //           email: userInput.email,
  //           roles: { create: roles },
  //           clients: { create: clients },
  //         },
  //       });
  //       var auth0result = await management.createUser({
  //         connection: "Username-Password-Authentication",
  //         given_name: userInput.first_name,
  //         family_name: userInput.last_name,
  //         password: userInput.password,
  //         email: userInput.email,
  //         app_metadata: { clients: userInput.clients },
  //       });
  //       var user_id = result.id;
  //       var auth0_id = auth0result.user_id;
  //       var update_result = await prisma.User.update({
  //         data: {
  //           auth0_id: auth0_id,
  //         },
  //         where: {
  //           id: user_id,
  //         },
  //       });
  //       var roleslist = await prisma.Roles.findMany({
  //         where: { id: { in: userInput.role } },
  //       });
  //       var auth0roles = [];
  //       roleslist.map((role) => {
  //         auth0roles.push(role.auth0_id);
  //       });
  //       var params = {
  //         id: auth0_id,
  //       };
  //       var data = {
  //         roles: auth0roles,
  //       };
  //       await management.assignRolestoUser(params, data);
  //     }
  //     break;

  //   case "DELETE":
  //     var auth0 = new AuthenticationClient({
  //       domain: process.env.AUTH0_DOMAIN,
  //       clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  //       clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  //       audience: process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/",
  //       scope: "read:users create:users update:users delete:users",
  //     });
  //     var response = await auth0.clientCredentialsGrant({
  //       audience: "https://moldesign.us.auth0.com/api/v2/",
  //       scope: "read:users create:users update:users delete:users",
  //     });
  //     var management = new ManagementClient({
  //       token: response.access_token,
  //       domain: process.env.AUTH0_DOMAIN,
  //     });
  //     try {
  //       const { user_id: d_id } = JSON.parse(req.body);
  //       var user = await prisma.user.findUnique({
  //         where: {
  //           id: d_id,
  //         },
  //       });
  //       let flag = false;
  //       if (user != null && user.auth0_id != null) {
  //         var auth0result = await management.deleteUser({ id: user.auth0_id });
  //         flag = true;
  //       } else if (user != null) {
  //         flag = true;
  //       }
  //       if (flag) {
  //         var result = await prisma.user.delete({
  //           where: {
  //             id: d_id,
  //           },
  //         });
  //       }
  //     } catch {
  //       res.status(500).end("unable to delete.");
  //     }
  //     break;

  //   case "PATCH":
  //     var auth0 = new AuthenticationClient({
  //       domain: process.env.AUTH0_DOMAIN,
  //       clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  //       clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  //       audience: process.env.AUTH0_ISSUER_BASE_URL + "/api/v2/",
  //       scope:
  //         "read:users create:users update:users delete:users read:roles create:role_members",
  //     });
  //     var response = await auth0.clientCredentialsGrant({
  //       audience: "https://moldesign.us.auth0.com/api/v2/",
  //       scope:
  //         "read:users create:users update:users delete:users read:roles create:role_members",
  //     });
  //     var management = new ManagementClient({
  //       token: response.access_token,
  //       domain: process.env.AUTH0_DOMAIN,
  //     });
  //     var roles = [];
  //     var clients = [];
  //     const userUpdate = JSON.parse(req.body);
  //     userUpdate.roles.forEach((role) => {
  //       roles.push({ roles: { connect: { id: role } } });
  //     });
  //     userUpdate.clients.forEach((client) => {
  //       clients.push({ clients: { connect: { id: client } } });
  //     });
  //     var roleslist = await prisma.Roles.findMany({
  //       where: { id: { in: userUpdate.roles } },
  //     });
  //     var auth0roles = [];
  //     roleslist.map((role) => {
  //       auth0roles.push(role.auth0_id);
  //     });
  //     var user = await prisma.user.findUnique({
  //       where: {
  //         id: userUpdate.id,
  //       },
  //     });
  //     var params = {
  //       id: user.auth0_id,
  //     };
  //     var data = {
  //       roles: auth0roles,
  //     };
  //     if (user.auth0_id) {
  //       await management.assignRolestoUser(params, data);
  //     }
  //     var result = await prisma.roleToUser.deleteMany({
  //       where: {
  //         user_id: userUpdate.id,
  //       },
  //     });
  //     var result = await prisma.clientToUser.deleteMany({
  //       where: {
  //         user_id: userUpdate.id,
  //       },
  //     });

  //     let authType = false;
  //     if (user.auth0_id) {
  //       authType = user.auth0_id.split("|");
  //     }
  //     if (user.auth0_id && authType[0] == "google-oauth2") {
  //       var data = {
  //         active: userUpdate.active,
  //         roles: { create: roles },
  //         clients: { create: clients },
  //       };
  //     } else {
  //       var data = {
  //         active: userUpdate.active,
  //         first_name: userUpdate.first_name,
  //         last_name: userUpdate.last_name,
  //         roles: { create: roles },
  //         clients: { create: clients },
  //       };
  //     }
  //     var result = await prisma.user.update({
  //       where: {
  //         id: userUpdate.id,
  //       },
  //       data: data,
  //     });
  //     if (user.auth0_id && authType[0] == "google-oauth2") {
  //       var updateData = {
  //         app_metadata: { clients: userUpdate.clients },
  //       };
  //     } else {
  //       var updateData = {
  //         given_name: userUpdate.first_name,
  //         family_name: userUpdate.last_name,
  //         app_metadata: { clients: userUpdate.clients },
  //       };
  //     }
  //     if (user.auth0_id) {
  //       management.updateUser(params, updateData);
  //     }
  //     break;

  //   default:
  //     res.status(405).end(`Method ${method} not allowed`);
  //     break;
  // }
});

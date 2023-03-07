import {
  withApiAuthRequired,
  getSession,
  updateSession,
} from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const session = await getSession(req, res);
    const { user } = session;
    const { client_id } = req.body;

    const updatedUser = { ...user, client_id: client_id ? client_id.id : null };
    await updateSession(req, res, { user: updatedUser });
    res.status(200).json({ message: "Session updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

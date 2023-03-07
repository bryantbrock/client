import { db } from "services/db";

export default async function record(
  action = {
    module,
    component,
    action,
    details: null,
    user_id: null,
    client_id: null,
  }
) {
  try {
    await db.Action.create({
      data: {
        module: action.module,
        component: action.component,
        action: action.action,
        details: action.details ? action.details : null,
        user_id: action.user_id ? action.user_id : null,
        client_id: action.client_id ? action.client_id : null,
        object_id: action.object_id || null,
      },
    });
  } catch (error) {}
}

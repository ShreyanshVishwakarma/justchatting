import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix"
import { WebhookEvent } from "@clerk/nextjs/webhooks";
import { internal } from "./_generated/api"

const http = httpRouter();

const ValidatePayload = async (req: Request): Promise<WebhookEvent | undefined> => {
  const paylaod = await req.text()
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  }

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    const event = webhook.verify(paylaod, svixHeaders) as WebhookEvent
    return event
  }
  catch (error) {
    console.log("error validating the clerk payload,", error);
    return;
  }
}

const handleWebhookRequest = httpAction(async (ctx, req) => {
  const event = await ValidatePayload(req);
  if (!event) {
    return new Response("could not validate clerk payload", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created": {
      const user = await ctx.runQuery(internal.user.getByUserId, { tokenIdentifier: event.data.id });
      if (user) {
        console.log(`Updating user ${event.data.id} with : ${event.data}`);
      }
    }
    case "user.updated": {
      await ctx.runMutation(internal.user.create, {
        username: `${event.data.first_name} ${event.data.last_name}`,
        tokenIdentifier: event.data.id,
        email: event.data.email_addresses[0]?.email_address || "",
        imageURL: event.data.image_url || "",
      });
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
      break;
  }

  return new Response("Webhook processed", { status: 200 });
});

http.route({
  path: "/clerk-user-webhook",
  method: "POST",
  handler: handleWebhookRequest
})


export default http;

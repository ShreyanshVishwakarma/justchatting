/*
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix"

const http = httpRouter();

const ValidatePayload = async (req: Request) => {
  const paylaod = await req.text()
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signatrue")!,
  }

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
}

const handleWebhookRequest = httpAction(async (ctx, req) => {
  const event = await ValidatePayload(req);
})

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleWebhookRequest
})


export default http;
*/

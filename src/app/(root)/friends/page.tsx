"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MessageSquare, UserPlus, Users } from "lucide-react";

export default function FriendsPage() {
  const friends = useQuery(api.friends.get);
  const requests = useQuery(api.requests.getRequestWithSenderDetails);
  const createRequest = useMutation(api.request.createRequest);
  const acceptRequest = useMutation(api.request.acceptRequest);
  const rejectRequest = useMutation(api.request.rejectRequest);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [requestActionId, setRequestActionId] = useState<string | null>(null);

  const isLoading = friends === undefined || requests === undefined;

  const handleAddFriend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setIsSending(true);
    try {
      await createRequest({ email: normalizedEmail });
      toast.success("Friend request sent");
      setEmail("");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Could not send friend request");
    } finally {
      setIsSending(false);
    }
  };

  const handleRequest = async (
    requestId: any,
    action: "accept" | "reject",
  ) => {
    setRequestActionId(requestId);
    try {
      if (action === "accept") {
        await acceptRequest({ requestId });
        toast.success("Friend request accepted");
      } else {
        await rejectRequest({ requestId });
        toast.success("Friend request declined");
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not update friend request");
    } finally {
      setRequestActionId(null);
    }
  };

  return (
    <main className="min-h-full w-full bg-background p-4 md:p-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg border-2 border-border bg-card p-5 shadow-[4px_4px_0_0_#2d2d2d] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-kalam)] text-3xl font-bold">
              Friends
            </h1>
            <p className="mt-1 text-muted-foreground">
              Add friends, respond to requests, and start a chat.
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="size-5" />
            Add friend
          </Button>
        </header>

        {requests && requests.length > 0 && (
          <section className="rounded-lg border-2 border-border bg-card p-5 shadow-[4px_4px_0_0_#2d2d2d]">
            <h2 className="mb-4 font-[family-name:var(--font-kalam)] text-2xl font-bold">
              Friend requests
            </h2>
            <div className="space-y-3">
              {requests.map((request) => {
                const isUpdating = requestActionId === request.requestId;
                return (
                  <div
                    key={request.requestId}
                    className="flex flex-col gap-3 rounded-md border-2 border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-11 border-2 border-border">
                        <AvatarImage src={request.sender.imageURL} />
                        <AvatarFallback>
                          {request.sender.username?.charAt(0)?.toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {request.sender.username}
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          {request.sender.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRequest(request.requestId, "accept")}
                        disabled={isUpdating}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequest(request.requestId, "reject")}
                        disabled={isUpdating}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="rounded-lg border-2 border-border bg-card p-5 shadow-[4px_4px_0_0_#2d2d2d]">
          <div className="mb-4 flex items-center gap-2">
            <Users className="size-5" />
            <h2 className="font-[family-name:var(--font-kalam)] text-2xl font-bold">
              Your friends
            </h2>
          </div>

          {isLoading ? (
            <p className="text-muted-foreground">Loading friends…</p>
          ) : friends.length === 0 ? (
            <div className="rounded-md border-2 border-dashed border-border p-8 text-center">
              <Users className="mx-auto mb-3 size-10 text-muted-foreground" />
              <p className="font-[family-name:var(--font-kalam)] text-2xl font-bold">
                No friends yet
              </p>
              <p className="mt-1 text-muted-foreground">
                Send a friend request to start chatting.
              </p>
              <Button
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <UserPlus className="size-5" />
                Add your first friend
              </Button>
            </div>
          ) : (
            <div className="divide-y-2 divide-border rounded-md border-2 border-border">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex flex-col gap-3 bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-12 border-2 border-border">
                      <AvatarImage src={friend.imageURL} />
                      <AvatarFallback>
                        {friend.username?.charAt(0)?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{friend.username}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {friend.email}
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/conversations/${friend.conversationId}`}>
                      <MessageSquare className="size-4" />
                      Open chat
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md border-2 border-border bg-card">
          <DialogHeader>
            <DialogTitle>Add a friend</DialogTitle>
            <DialogDescription>
              Enter the email address associated with their JustChatting account.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddFriend}>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="friend@example.com"
              autoComplete="email"
              required
            />
            <Button className="w-full" type="submit" disabled={isSending}>
              {isSending ? "Sending…" : "Send request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

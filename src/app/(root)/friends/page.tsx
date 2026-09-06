"use client";

import { FormEvent, useMemo, useState } from "react";
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
import {
  Check,
  HeartHandshake,
  MailPlus,
  MessageCircle,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { DoodleTag, JustchatMark } from "@/components/brand";

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
  const [search, setSearch] = useState("");

  const isLoading = friends === undefined || requests === undefined;

  const visibleFriends = useMemo(() => {
    if (!friends) return [];
    const q = search.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      (f) =>
        f.username?.toLowerCase().includes(q) ||
        f.email?.toLowerCase().includes(q)
    );
  }, [friends, search]);

  const handleAddFriend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    setIsSending(true);
    try {
      await createRequest({ email: normalizedEmail });
      toast.success("pal request sent ✉️");
      setEmail("");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("couldn't send that request — check the email?");
    } finally {
      setIsSending(false);
    }
  };

  const handleRequest = async (requestId: any, action: "accept" | "reject") => {
    setRequestActionId(requestId);
    try {
      if (action === "accept") {
        await acceptRequest({ requestId });
        toast.success("new pal added! 🎉");
      } else {
        await rejectRequest({ requestId });
        toast.success("request politely declined");
      }
    } catch (error) {
      console.error(error);
      toast.error("couldn't update that request");
    } finally {
      setRequestActionId(null);
    }
  };

  return (
    <main className="min-h-full w-full">
      <div className="mx-auto w-full max-w-4xl space-y-5 p-4 md:p-6">
        {/* ——— header doodle sheet ——— */}
        <header className="relative -rotate-[0.4deg] border-[3px] border-border bg-white p-5 shadow-[6px_6px_0px_0px_#2d2d2d] sm:p-6" style={{ borderRadius: "255px 16px 225px 16px / 16px 225px 16px 255px" }}>
          <span aria-hidden="true" className="absolute left-1/2 top-0 h-5 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] border-x-2 border-dashed border-[#2d2d2d]/20 bg-[#2d2d2d]/10" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <JustchatMark size={44} />
              <div>
                <DoodleTag>💌 pals</DoodleTag>
                <h1 className="mt-1.5 font-[family-name:var(--font-kalam)] text-4xl font-bold leading-none">
                  your pals
                </h1>
                <p className="mt-1.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/65">
                  collect pals by email — every accept opens a private justchat.
                </p>
              </div>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="shrink-0 rotate-1">
              <UserPlus className="size-5" strokeWidth={2.5} /> add a pal
            </Button>
          </div>

          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search pals by name or email…"
              aria-label="search pals"
              className="h-11 bg-[#fdfbf7] pl-10 font-[family-name:var(--font-patrick-hand)] text-lg"
            />
          </div>
        </header>

        {/* ——— requests ——— */}
        {requests && requests.length > 0 && (
          <section aria-label="pal requests" className="rotate-[0.4deg] border-[3px] border-border bg-[#fdf8c1] p-5 shadow-[6px_6px_0px_0px_#2d2d2d] sm:p-6" style={{ borderRadius: "20px 255px 16px 225px / 255px 16px 225px 16px" }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-[family-name:var(--font-kalam)] text-2xl font-bold">
                <MailPlus className="size-6" strokeWidth={2.5} /> knocks on your door
                <span className="border-2 border-border bg-[#ff4d4d] px-2 py-0.5 font-[family-name:var(--font-kalam)] text-base font-bold text-white" style={{ borderRadius: "60% 40% 55% 45%" }}>
                  {requests.length}
                </span>
              </h2>
            </div>
            <ul className="space-y-2.5">
              {requests.map((request, i) => {
                const busy = requestActionId === request.requestId;
                return (
                  <li key={request.requestId} className={`flex flex-col gap-3 border-[2.5px] border-border bg-white p-3 shadow-[3px_3px_0_0_#2d2d2d] sm:flex-row sm:items-center sm:justify-between ${i % 2 ? "rotate-[0.4deg]" : "-rotate-[0.4deg]"}`} style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                    <span className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-12 shrink-0 border-[2.5px] border-border" style={{ borderRadius: "55% 45% 60% 40% / 45% 55% 40% 60%" }}>
                        <AvatarImage src={request.sender.imageURL} alt={request.sender.username ?? "pal"} />
                        <AvatarFallback className="bg-[#e5e0d8] font-[family-name:var(--font-kalam)] text-xl font-bold">
                          {request.sender.username?.charAt(0)?.toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0">
                        <span className="block truncate font-[family-name:var(--font-kalam)] text-xl font-bold leading-tight">{request.sender.username}</span>
                        <span className="block truncate font-[family-name:var(--font-patrick-hand)] text-base text-foreground/60">{request.sender.email}</span>
                        <span className="mt-0.5 inline-block -rotate-1 border border-dashed border-border/50 bg-[#fdfbf7] px-2 font-[family-name:var(--font-patrick-hand)] text-sm text-foreground/60" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                          wants to justchat ✎
                        </span>
                      </span>
                    </span>
                    <span className="flex shrink-0 gap-2">
                      <Button size="sm" onClick={() => handleRequest(request.requestId, "accept")} disabled={busy} className="!bg-[#ffeb3b] !text-foreground hover:!bg-[#ff4d4d] hover:!text-white">
                        <Check className="size-4" strokeWidth={3} /> {busy ? "…" : "accept"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRequest(request.requestId, "reject")} disabled={busy}>
                        <X className="size-4" strokeWidth={3} /> decline
                      </Button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* ——— friends ——— */}
        <section aria-label="pal list" className="border-[3px] border-border bg-white p-5 shadow-[6px_6px_0px_0px_#2d2d2d] sm:p-6 -rotate-[0.3deg]" style={{ borderRadius: "255px 16px 225px 16px / 16px 225px 16px 255px" }}>
          <h2 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-kalam)] text-2xl font-bold">
            <span className="flex size-9 -rotate-3 items-center justify-center border-[2.5px] border-border bg-[#fdf8c1] shadow-[2px_2px_0_0_#2d2d2d]" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
              <Users className="size-5" strokeWidth={2.5} />
            </span>
            the gang
            {!isLoading && friends && friends.length > 0 && (
              <span className="border-2 border-border bg-[#e5e0d8]/70 px-2 py-0.5 font-[family-name:var(--font-patrick-hand)] text-base font-bold" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                {friends.length}
              </span>
            )}
          </h2>

          {isLoading ? (
            <ul className="space-y-2.5" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center gap-3 border-2 border-dashed border-border/30 bg-[#fdfbf7] p-3" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                  <span className="size-12 animate-pulse rounded-full bg-[#e5e0d8]" />
                  <span className="flex-1 space-y-1.5">
                    <span className="block h-3.5 w-1/3 animate-pulse bg-[#e5e0d8]" />
                    <span className="block h-3 w-1/2 animate-pulse bg-[#e5e0d8]/70" />
                  </span>
                </li>
              ))}
            </ul>
          ) : friends!.length === 0 ? (
            <div className="border-[2.5px] border-dashed border-border/60 bg-[#fdfbf7] p-8 text-center" style={{ borderRadius: "20px 255px 16px 225px / 255px 16px 225px 16px" }}>
              <span className="mx-auto flex size-16 -rotate-3 items-center justify-center border-[3px] border-border bg-[#fdf8c1] shadow-[3px_3px_0_0_#2d2d2d]" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
                <HeartHandshake className="size-8" strokeWidth={1.75} />
              </span>
              <p className="mt-3 font-[family-name:var(--font-kalam)] text-3xl font-bold">lonely page, huh?</p>
              <p className="mx-auto mt-1 max-w-sm font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/60">
                every great chat starts with one brave email. send a pal request
                and watch this page come alive.
              </p>
              <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <UserPlus className="size-5" strokeWidth={2.5} /> add your first pal
              </Button>
            </div>
          ) : visibleFriends.length === 0 ? (
            <div className="border-[2.5px] border-dashed border-border/60 bg-[#fdfbf7] p-8 text-center" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
              <p className="font-[family-name:var(--font-kalam)] text-2xl font-bold">no pals match “{search}”</p>
              <p className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/60">try another scribble…</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {visibleFriends.map((friend, i) => (
                <li key={friend._id} className={`flex flex-col gap-3 border-[2.5px] border-border bg-[#fdfbf7] p-3 hover:bg-white sm:flex-row sm:items-center sm:justify-between ${i % 2 ? "rotate-[0.3deg]" : "-rotate-[0.3deg]"}`} style={{ borderRadius: i % 2 ? "20px 255px 15px 225px / 255px 15px 225px 15px" : "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-12 shrink-0 border-[2.5px] border-border" style={{ borderRadius: "55% 45% 60% 40% / 45% 55% 40% 60%" }}>
                      <AvatarImage src={friend.imageURL} alt={friend.username ?? "pal"} />
                      <AvatarFallback className="bg-[#e5e0d8] font-[family-name:var(--font-kalam)] text-xl font-bold">
                        {friend.username?.charAt(0)?.toUpperCase() ?? "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0">
                      <span className="block truncate font-[family-name:var(--font-kalam)] text-xl font-bold leading-tight">{friend.username}</span>
                      <span className="block truncate font-[family-name:var(--font-patrick-hand)] text-base text-foreground/60">{friend.email}</span>
                    </span>
                  </span>
                  <Button asChild size="sm" className="shrink-0">
                    <Link href={`/conversations/${friend.conversationId}`}>
                      <MessageCircle className="size-4" strokeWidth={2.5} /> open chat
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="pb-4 text-center font-[family-name:var(--font-patrick-hand)] text-base text-foreground/50">
          ✎ tip: pals join with the email on their justchat account — double-check the spelling!
        </p>
      </div>

      {/* ——— add-pal dialog ——— */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="relative max-w-md border-[3px] border-border bg-white shadow-[8px_8px_0px_0px_#2d2d2d]" style={{ borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px" }}>
          <span aria-hidden="true" className="absolute left-1/2 top-0 h-5 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] border-x-2 border-dashed border-[#2d2d2d]/20 bg-[#ff4d4d]/20" />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-[family-name:var(--font-kalam)] text-3xl font-bold">
              <span className="flex size-10 -rotate-3 items-center justify-center border-[2.5px] border-border bg-[#ffeb3b] shadow-[2px_2px_0_0_#2d2d2d]" style={{ borderRadius: "60% 40% 55% 45%" }}>
                <UserPlus className="size-5" strokeWidth={2.5} />
              </span>
              add a pal
            </DialogTitle>
            <DialogDescription className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/65">
              type the email they used for justchat. they&apos;ll get a
              doodle-stamped request.
            </DialogDescription>
          </DialogHeader>
          <form className="mt-2 space-y-3" onSubmit={handleAddFriend}>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="pal@example.com"
              autoComplete="email"
              required
              className="h-12 bg-[#fdfbf7] font-[family-name:var(--font-patrick-hand)] text-lg"
            />
            <Button className="w-full" type="submit" disabled={isSending}>
              {isSending ? "licking the stamp…" : "send pal request ✉️"}
            </Button>
            <p className="text-center font-[family-name:var(--font-patrick-hand)] text-base text-foreground/50">
              no spam, no weirdness — just one polite knock.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

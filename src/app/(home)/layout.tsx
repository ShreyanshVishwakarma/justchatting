import AuthHeader from "@/components/AuthHeader";


export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthHeader />
      <main className="min-h-screen">{children}</main>
    </>
  );
}

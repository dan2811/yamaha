import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { SessionProvider } from "../../_components/SessionProvider";
import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import AdminNav from "~/app/_components/admin/AdminNav";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Derby Yamaha Music School",
  description:
    "Derby Yamaha Music School - Music lessons for all ages and abilities.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-purple-100/80`}>
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <Toaster position={"top-center"} />
            <AdminNav />
            <div className="p-6">{children}</div>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

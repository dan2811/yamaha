import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { SessionProvider } from "../_components/SessionProvider";
import { TRPCReactProvider } from "~/trpc/react";
import { getServerAuthSession } from "~/server/auth";
import ClientNav from "../_components/client/ClientNav";
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
      <body className={`font-sans ${inter.variable}`}>
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <Toaster position={"top-center"} />
            <ClientNav />
            <div>{children}</div>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

// import "../globals.css";
import { Inter as FontSans } from "next/font/google";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="  md:min-h-screen flex flex-col items-center justify-center my-5">
        <div className=" w-4/5 md:w-full sm:rounded-2xl sm:border py-5 px-6 md:py-10 xs:px-8 md:p-12 lg:px-16 max-w-[650px] mx-auto bg-white shadow sm:shadow">
          {children}
        </div>
      </main>
      <Toaster />
    </>
  );
}

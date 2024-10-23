import localFont from "next/font/local";
import "./globals.css";
import Script from 'next/script';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'QR Code Generator',
  description: 'Generate QR codes for WiFi and URLs',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="squid-analytics"
          strategy="afterInteractive"
        >
          {`
            (function(squid){
              (window.$quid) || (window.$quid = {});
              document.head.appendChild((function(s){ s.src='https://app.asksquid.ai/tfs/'+squid+'/sdk';s.async=1; return s; })(document.createElement('script')));
            })('6719103019d43af7a47a0bbb');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
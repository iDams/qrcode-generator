import { ScrollViewStyleReset } from 'expo-router/html';
import React from 'react';

const SITE_URL = 'https://qrcode.imarcodev.com';
const TITLE = 'IMarcoDev | Skia QR Code Generator';
const DESCRIPTION = 'Generate beautiful, customizable QR codes with React Native Skia. Create unique gradients, custom shapes, eye patterns, and embedded logos in less than 30 seconds.';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>{TITLE}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* SEO */}
        <meta name="description" content={DESCRIPTION} />
        <meta name="author" content="Marco" />
        <meta name="keywords" content="QR code, free generator, react native, skia, custom, gradient, svg, png, imarcodev" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Preview of the Skia QR Code Generator by Marco" />
        <meta property="og:site_name" content="IMarcoDev" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={SITE_URL} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:image:alt" content="Preview of the Skia QR Code Generator by Marco" />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers on first paint. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
:root {
  color-scheme: dark;
}
html, body {
  background-color: #000000;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#root {
  background-color: #000000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}
/* Fallback background that covers entire canvas */
html::before {
  content: '';
  position: fixed;
  top: -9999px;
  left: -9999px;
  right: -9999px;
  bottom: -9999px;
  background-color: #000000;
  z-index: -1;
}
`;

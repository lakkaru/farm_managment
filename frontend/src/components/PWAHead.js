import React from 'react';
import { Helmet } from 'react-helmet';

const PWAHead = () => (
  <Helmet>
    {/* PWA Meta Tags */}
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Farm Management" />
    
    {/* Microsoft specific */}
    <meta name="msapplication-TileColor" content="#2E7D32" />
    <meta name="msapplication-config" content="/browserconfig.xml" />
    
    {/* Theme color - Important for PWA */}
    <meta name="theme-color" content="#2E7D32" />
    
    {/* Apple touch icons */}
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="/icons/icon-128x128.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/icons/icon-128x128.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="/icons/icon-72x72.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
    <link rel="apple-touch-icon" sizes="60x60" href="/icons/icon-72x72.png" />
    <link rel="apple-touch-icon" sizes="57x57" href="/icons/icon-72x72.png" />
    
    {/* Favicon */}
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-72x72.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
    
    {/* Ensure manifest is linked */}
    <link rel="manifest" href="/manifest.webmanifest" />
  </Helmet>
);

export default PWAHead;
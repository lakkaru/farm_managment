import React from 'react';
import { CacheProvider } from '@emotion/react';
import { renderToString } from 'react-dom/server';
import { extractCritical } from '@emotion/server';
import createEmotionCache from './src/utils/createEmotionCache';

export { wrapRootElement } from './gatsby-browser';

// Create a shared cache instance
const cache = createEmotionCache();

export const wrapPageElement = ({ element }) => {
  return (
    <CacheProvider value={cache}>
      {element}
    </CacheProvider>
  );
};

export const replaceRenderer = ({ bodyComponent, replaceBodyHTMLString, setHeadComponents }) => {
  // Extract critical CSS from the rendered component
  const { html, css, ids } = extractCritical(renderToString(bodyComponent));
  
  // Replace the body HTML with the extracted HTML
  replaceBodyHTMLString(html);
  
  // Add the critical CSS to the head
  if (css) {
    setHeadComponents([
      <style
        key="emotion-ssr"
        data-emotion={`css ${ids.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: css }}
      />,
    ]);
  }
};

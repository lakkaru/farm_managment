/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Farm Management System`,
    description: `A comprehensive farm management system to track crops, livestock, inventory, and farm operations.`,
    author: `@lakkaru`,
    siteUrl: `https://farm.lakkaru.com`, // Update this to your actual deployment URL
  },
  pathPrefix: `/`,
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Farm Management System`,
        short_name: `FarmMS`,
        description: `A comprehensive farm management system for Sri Lankan farmers`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#2E7D32`,
        display: `standalone`,
        orientation: `portrait-primary`,
        scope: `/`,
        lang: `en`,
        categories: [`productivity`, `agriculture`, `business`],
        icon: `src/images/icon.png`,
        icon_options: {
          purpose: `any`,
        },
        cache_busting_mode: `none`,
        include_favicon: true,
        legacy: true,
        theme_color_in_head: true,
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/dashboard/`, `/farms/`, `/login/`, `/`],
        appendScript: `src/sw-append.js`,
        workboxConfig: {
          globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,woff,woff2}'],
          skipWaiting: true,
          clientsClaim: true,
        },
      },
    },
    // Add other plugins as needed
  ],
}

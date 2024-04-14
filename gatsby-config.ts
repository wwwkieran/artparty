import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `artparty.nyc`,
    siteUrl: `map.kieran.lol`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: ["gatsby-plugin-sass", 'gatsby-plugin-postcss', {
    resolve: 'gatsby-plugin-manifest',
    options: {
      name: "artparty.nyc",
      shortname: "artparty",
      display: "standalone",
      "icon": "src/images/icon.png",
      theme_color: "#FFF5EE",
      background_color: "#FFF5EE",
      permissions: [
          "geolocation"
      ]
    }
  }]
};

export default config;

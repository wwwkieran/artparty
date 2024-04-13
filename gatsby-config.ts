import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Thirsty Gallerina Maps`,
    siteUrl: `https://wwwkieran.github.io/thirsty-gallerina-maps/`
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  assetPrefix: "https://wwwkieran.github.io/thirsty-gallerina-maps/",
  plugins: ["gatsby-plugin-sass", 'gatsby-plugin-postcss', {
    resolve: 'gatsby-plugin-manifest',
    options: {
      "icon": "src/images/icon.png"
    }
  }]
};

export default config;

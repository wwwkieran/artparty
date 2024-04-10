import * as React from "react"
import {graphql, HeadFC, PageProps, useStaticQuery} from "gatsby"
import GalleryMap from "../components/galleryMap";

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 420,
}
const paragraphStyles = {
  marginBottom: 48,
}
const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
}

const doclistStyles = {
  paddingLeft: 0,
}
const listItemStyles = {
  fontWeight: 300,
  fontSize: 24,
  maxWidth: 560,
  marginBottom: 30,
}

const linkStyle = {
  color: "#8954A8",
  fontWeight: "bold",
  fontSize: 16,
  verticalAlign: "5%",
}

const docLinkStyle = {
  ...linkStyle,
  listStyleType: "none",
  display: `inline-block`,
  marginBottom: 24,
  marginRight: 12,
}


const docLinks = [
  {
    text: "TypeScript Documentation",
    url: "https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/",
    color: "#8954A8",
  },
  {
    text: "GraphQL Typegen Documentation",
    url: "https://www.gatsbyjs.com/docs/how-to/local-development/graphql-typegen/",
    color: "#8954A8",
  }
]

const IndexPage: React.FC<PageProps> = () => {
  const data = useStaticQuery(graphql`query MyQuery {
  allOpening {
      nodes {
        id
        name
        address
        description
        date
        lat
        long
      }
    }
  }`)
  
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>
        Thirsty Gallerina Maps
      </h1>
      <p style={paragraphStyles}>
        Thanks to <code style={codeStyles}>@thirstygallerina</code> for the raw data. 😎
      </p>
      <GalleryMap openings={data.allOpening.nodes}/>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>

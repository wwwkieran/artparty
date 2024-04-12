import * as React from "react"
import {graphql, HeadFC, PageProps, useStaticQuery} from "gatsby"
import GalleryMap from "../components/galleryMap";
import {useState} from "react";

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
    group(field: {date: SELECT}) {
      fieldValue
      totalCount
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
  }
}`)
  const dateMap = new Map();
  let startDate = parseInt(data.allOpening.group[0].fieldValue)
  var today = new Date();
  for (const group of data.allOpening.group) {
    const currTimestamp = parseInt(group.fieldValue)
    dateMap.set(currTimestamp, group.nodes)
    if ((new Date(startDate)).toDateString() !== today.toDateString()) {
      if (((new Date(currTimestamp)).toDateString() === today.toDateString()) ||
          (currTimestamp - today.getMilliseconds() > 0 && (startDate - today.getMilliseconds() < 0 || currTimestamp - startDate < 0))) {
        startDate = currTimestamp
      }
    }
  }

  const [selectedDate, setSelectedDate] = useState<number>(startDate)
  const date = new Date(selectedDate)
  
  return (
    <main style={pageStyles}>
      <h1 style={headingStyles}>
        {date.toDateString()}
      </h1>
      <p style={paragraphStyles}>
        Thanks to <code style={codeStyles}>@thirstygallerina</code> for the raw data. 😎
      </p>
      <GalleryMap openings={dateMap.get(selectedDate)}/>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>

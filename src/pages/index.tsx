import * as React from "react"
import {graphql, HeadFC, PageProps, useStaticQuery} from "gatsby"
import GalleryMap from "../components/galleryMap";
import {useState} from "react";
import { dateHeading, datesContainer, selectableDate} from './index.module.scss'
import Layout from "../components/layout";
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

// copy pasta from https://www.freecodecamp.org/news/format-dates-with-ordinal-number-suffixes-javascript/
const formatDate = (date: number) => {
  const dateObj = new Date(date);
  const weekday = dateObj.toLocaleString("default", { weekday: "long" });
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "long" });
  const year = dateObj.getFullYear();

  const nthNumber = (number: number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${weekday}, ${month} ${day}${nthNumber(day)}`;
}

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
  const futureDates: number[] = [];
  const pastDates: number[] = [];
  var today = new Date();
  for (const group of data.allOpening.group) {
    const currTimestamp = parseInt(group.fieldValue)
    dateMap.set(currTimestamp, group.nodes)

    // Try to set startDate to today or closest day in the future
    if ((new Date(startDate)).toDateString() !== today.toDateString()) {
      if (((new Date(currTimestamp)).toDateString() === today.toDateString()) ||
          (currTimestamp - today.valueOf() > 0 && (startDate - today.valueOf() < 0 || currTimestamp - startDate < 0))) {
        startDate = currTimestamp
      }
    }

    if ((new Date(currTimestamp)).toDateString() !== today.toDateString()) {
      if (currTimestamp < today.valueOf()) {
        pastDates.push(currTimestamp)
      } else {
        futureDates.push(currTimestamp)
      }
    }
  }

  const [selectedDate, setSelectedDate] = useState<number>(startDate)
  const onClickDate = (date: number) => {return (e: any) => {setSelectedDate(date)}}
  const dateRow = (date: number) => {return (<h5 className={selectableDate} onClick={onClickDate(date)}>{formatDate(date)}</h5>)}

  return (
      <Layout>
        <h4>Thirsty Maps</h4>

        <div className={datesContainer}>
          {pastDates.length > 0 && (
              <div>
                <h3>Past</h3>
                {pastDates.map(dateRow)}
              </div>
          )}
          {(new Date(startDate)).toDateString() === today.toDateString() && (
              <div>
                <h3>Today</h3>
                {dateRow(startDate)}
              </div>
          )}
          {futureDates.length > 0 && (
              <div>
                <h3>Upcoming</h3>
                {futureDates.map(dateRow)}
              </div>
          )}
        </div>
        <h1 className={dateHeading}>
          {formatDate(selectedDate)}
        </h1>
        <GalleryMap openings={dateMap.get(selectedDate)}/>
      </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>

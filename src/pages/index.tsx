import * as React from "react"
import {graphql, HeadFC, PageProps, useStaticQuery} from "gatsby"
import GalleryMap from "../components/galleryMap";
import {useState} from "react";
import { dateHeading, datesContainer, selectableDate, headerCard, cardHeader, cardFooter, cardBody, footerContent, datePicker, dateGroup, underline, logo} from './index.module.scss'
import Layout from "../components/layout";
import {Card, CardHeader, CardBody, CardFooter, Divider, Chip, Button} from "@nextui-org/react";
import { motion } from "framer-motion";
import { ReactComponent as LogoSVG } from "../images/logo.svg"
import {SEO} from "../components/seo";

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
        emoji
      }
    }
  }
}`)
  const dateMap = new Map();
  let startDate = parseInt(data.allOpening.group[0].fieldValue)
  const futureDates: number[] = [];
  const pastDates: number[] = [];
  let todayDateStamp: number | null = null;
  var today = new Date();

  for (const group of data.allOpening.group) {
    const currTimestamp = parseInt(group.fieldValue)
    dateMap.set(currTimestamp, group.nodes)

    if ((new Date(currTimestamp)).toDateString() !== today.toDateString()) {
      if (currTimestamp < today.valueOf()) {
        pastDates.push(currTimestamp)
      } else {
        futureDates.push(currTimestamp)
      }
    } else {
      todayDateStamp = currTimestamp
    }
  }

  // Try to set startDate to today, closest day in the future, or nearest day in the past
  if (todayDateStamp !== null) {
    startDate = todayDateStamp
  } else if (futureDates.length > 0) {
    startDate = futureDates[0]
  } else {
    startDate = pastDates[pastDates.length - 1]
  }

  const [selectedDate, setSelectedDate] = useState<number>(startDate)
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false)
  const onClickDate = (date: number) => {return (e: any) => {setSelectedDate(date)}}
  const datePickerVisibleStyle = {
    height: "auto",
    visibility: "visible"
  }
  const datePickerInvisibleStyle = {visibility: "hidden", height: "0px"}
  const dateRow = (date: number) => {return (<h5 className={selectableDate} onClick={onClickDate(date)}>{formatDate(date)}{date === selectedDate && <motion.span className={underline} layoutId="underline"></motion.span>}</h5>)
  }

  return (
      <Layout>
        <GalleryMap openings={dateMap.get(selectedDate)}/>
        <Card className={headerCard + " bg-background/10"} isBlurred={true}>
          <CardHeader className={cardHeader}>
            <LogoSVG className={logo}/>
          </CardHeader>
          <Divider/>
          <CardFooter className={cardFooter}>
            <div className={footerContent}>
              <h1 className={dateHeading}>
                {formatDate(selectedDate)}
              </h1>
              <Button size="sm" variant="bordered" radius={"full"} onPress={() => {
                setDatePickerVisible(!datePickerVisible)
              }}>
                {datePickerVisible ? (<>Close</>) : (<>Change</>)}
              </Button>
            </div>
            <motion.div initial={datePickerInvisibleStyle}
                        animate={datePickerVisible ? datePickerVisibleStyle : datePickerInvisibleStyle}>
                {(new Date(startDate)).toDateString() === today.toDateString() && (
                    <div className={dateGroup}>
                      <h3 style={{fontWeight: 500}}>Today</h3>
                      {dateRow(startDate)}
                    </div>
                )}
                {futureDates.length > 0 && (
                    <div className={dateGroup}>
                      <h3 style={{fontWeight: 500}}>Upcoming</h3>
                      {futureDates.map(dateRow)}
                    </div>
                )}
              {pastDates.length > 0 && (
                  <div className={dateGroup}>
                    <h3 style={{fontWeight: 500}}>Past</h3>
                    {pastDates.reverse().map(dateRow)}
                  </div>
              )}
            </motion.div>
          </CardFooter>
        </Card>
      </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => (
    <SEO
      title={"ArtParty NYC | Free Art Events"}
      description={"Map of free gallery openings in New York."}
    />
)

import React from "react"
import IOpening from "../types/IOpening";

type SEOProps = {
    title: string
    description: string
    children?: React.FC
}

export const SEO = (props: SEOProps) => {
    return (
        <>
            <title>{props.title}</title>
            <meta name="description" content={props.description}/>
            <script data-goatcounter="https://artparty.goatcounter.com/count" async src="//gc.zgo.at/count.js"/>
            {props.children}
        </>
    )
}
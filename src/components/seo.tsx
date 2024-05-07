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
            <meta name="description" content={props.description} />
            {props.children}
        </>
    )
}
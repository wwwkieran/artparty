import type { GatsbyNode } from "gatsby"
import { createWorker } from "tesseract.js";
import IOpening from "./src/types/IOpening";
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding"

export const sourceNodes: GatsbyNode[`sourceNodes`] = async (gatsbyApi) => {
    const { reporter } = gatsbyApi
    reporter.info(`Beginning custom node sourcing...`)

    const output = await parseImages(["./list-one.png", "./list-two.png"]);
    const openings = await parseText(output);
    for (const opening of openings) {
        gatsbyApi.actions.createNode({
            ...opening,
            // Required fields
            id: gatsbyApi.createNodeId(opening.name + opening.date.toString()),
            internal: {
                type: `Opening`,
                contentDigest: gatsbyApi.createContentDigest(opening)
            }
        })
    }
}

const parseImages = async (imagePaths: string[]) => {
    const worker = await createWorker('eng');
    let out = "";
    for (const path of imagePaths) {
        const { data: { text } } = await worker.recognize(path);
        out = out.concat(text)
    }
    await worker.terminate();
    return out
}

const parseText = async (input: string): Promise<IOpening[]> => {
    const openings: IOpening[] = []
    let date = NaN
    const geoClient = Geocoding({accessToken: process.env.MAPBOX_GEOCODE_TOKEN ?? "", origin: ""});

    for (const line of input.split('\n')) {
        if (isNaN(date)) {
            date = Date.parse(line)
            continue
        }

        const lineElements = line.split(',')
        if (lineElements.length === 2) {
            let location = lineElements[1]
            let description = ""
            if (lineElements[1].indexOf("(") !== -1) {
                location = lineElements[1].substring(0, lineElements[1].indexOf("("))
                description = lineElements[1].substring(lineElements[1].indexOf("("))
            }
            const resp = await geoClient.forwardGeocode({
                query: location + " NYC",
                limit: 1,
            }).send()
            openings.push(
                {
                    name: lineElements[0],
                    date: date,
                    address: location.trim(),
                    description: description.trim(),
                    lat: resp!.body.features[0].center[1],
                    long: resp!.body.features[0].center[0],
                }
            )
        }
    }
    return openings
}
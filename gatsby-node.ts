import type { GatsbyNode } from "gatsby"
import { createWorker } from "tesseract.js";
import IOpening from "./src/types/IOpening";
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding"
// @ts-ignore
import { igApi, getCookie } from "insta-fetcher"

const neighborhoods = ["les", "chelsea", "ues", "uws", "midtown", "chinatown", "soho", "tribeca", "astoria", "chinatown/two bridges", "brooklyn", "east village", "noho", "little italy", "chinatown/soho", "les/bowery", "southstreet seaport", "bowery", "west village", "jersey city", "queens", "hell's kitchen", "nomad", "nolita", "midtown east", "ridgewood", "harlem", "meatpacking", "greenwich village"]

export const sourceNodes: GatsbyNode[`sourceNodes`] = async (gatsbyApi) => {
    const { reporter } = gatsbyApi
    reporter.info(`Beginning custom node sourcing...`)

    reporter.info(`Fetching from instagram...`)
    const posts = await pullImages();
    // const posts = [["./list-one.png", "./list-two.png"]]

    for (let i = 0; i < posts.length; i++) {
        reporter.info('Parsing images for post ' + (i + 1).toString() + ' of ' + posts.length + '...')
        const output = await parseImages(posts[i]);
        const openings = await parseText(output);
        for (const opening of openings) {
            gatsbyApi.actions.createNode({
                ...opening,
                // Required fields
                id: gatsbyApi.createNodeId(opening.name + opening.date.toString() + opening.address),
                internal: {
                    type: `Opening`,
                    contentDigest: gatsbyApi.createContentDigest(opening)
                }
            })
        }
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
    let neighborhood = ""

    for (const line of input.split('\n')) {
        if (isNaN(date)) {
            date = Date.parse(line + " " + (new Date()).getFullYear().toString() + " 12:00:00 EST")
            continue
        }

        if (neighborhoods.includes(line.trim().toLowerCase())) {
            if (line.trim().toLowerCase() === "les") {
                neighborhood = "lower east side"
            } else if (line.trim().toLowerCase() === "ues") {
                neighborhood = "upper east side"
            } else if (line.trim().toLowerCase() === "uws") {
                neighborhood = "upper west side"
            } else {
                neighborhood = line.trim().toLowerCase()
            }
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
                query: location + ", " + neighborhood + ", NYC",
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

const pullImages = async (): Promise<string[][]> => {
    const ig = new igApi(process.env.INSTA_COOKIE!)
    const resp = await ig.fetchUserPostsV2('thirstygallerina')
    const out: string[][] = []
    for (let i = 0;  i < 5; i++) {
        const post = resp.edges[i].node
        if (post.__typename === "GraphVideo") {
            continue
        }

        let images: string[] = []
        if (post.edge_sidecar_to_children !== undefined) {
            for (const image of post.edge_sidecar_to_children.edges) {
                images.push(image.node.display_url)
            }
        } else {
            images = [post.display_url]
        }
        out.push(images)
    }
    return out
}
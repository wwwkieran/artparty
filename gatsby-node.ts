import type { GatsbyNode } from "gatsby"
import { createWorker } from "tesseract.js";
import IOpening from "./src/types/IOpening";
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding"
// @ts-ignore
import { igApi, getCookie } from "insta-fetcher"
import axios from "axios";
import { HttpsProxyAgent } from 'https-proxy-agent';
import {IPaginatedPosts} from "insta-fetcher/dist/types";

const neighborhoods = ["les", "chelsea", "ues", "uws", "midtown", "chinatown", "soho", "tribeca", "astoria", "chinatown/two bridges", "brooklyn", "east village", "noho", "little italy", "chinatown/soho", "les/bowery", "southstreet seaport", "bowery", "west village", "jersey city", "queens", "hell's kitchen", "nomad", "nolita", "midtown east", "ridgewood", "harlem", "meatpacking", "greenwich village"]

const isNeighborhood = (input: string) => {
    const line = input.trim().toLowerCase()
    if (neighborhoods.includes(line)){
        return true
    }

    const lineElements = line.split('/')
    if (lineElements.length === 2) {
        return neighborhoods.includes(lineElements[0].trim()) || neighborhoods.includes(lineElements[1].trim())
    }

    return false
}


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

export const parseImages = async (imagePaths: string[]) => {
    const worker = await createWorker('eng');
    let out = "";
    for (const path of imagePaths) {
        const { data: { text } } = await worker.recognize(path);
        out = out.concat(text)
    }
    await worker.terminate();
    return out
}

export const parseText = async (input: string): Promise<IOpening[]> => {
    const openings: IOpening[] = []
    let date = NaN
    const geoClient = Geocoding({accessToken: process.env.MAPBOX_GEOCODE_TOKEN ?? "", origin: ""});
    let neighborhood = ""

    for (const line of input.split('\n')) {
        if (isNaN(date)) {
            date = Date.parse(line + " " + (new Date()).getFullYear().toString() + " 12:00:00 EST")
            continue
        }

        if (isNeighborhood(line)) {
            if (line.trim().toLowerCase() === "les") {
                neighborhood = "lower east side"
            } else if (line.trim().toLowerCase() === "ues") {
                neighborhood = "upper east side"
            } else if (line.trim().toLowerCase() === "uws") {
                neighborhood = "upper west side"
            } else {
                neighborhood = line.trim().toLowerCase()
            }
            continue
        }

        const lineElements = line.split(',')
        if (lineElements.length === 2) {
            const { location, description, emoji } = parseEventLine(lineElements[1])
            const resp = await geoClient.forwardGeocode({
                query: location + ", " + neighborhood + ", NYC",
                limit: 1,
            }).send()
            // const resp = {
            //     body: {
            //         features: [
            //             {
            //                 center: [0, 0]
            //             }
            //         ]
            //     }
            // }
            openings.push(
                {
                    name: lineElements[0],
                    date: date,
                    address: location.trim(),
                    description: description.trim(),
                    lat: resp!.body.features[0].center[1],
                    long: resp!.body.features[0].center[0],
                    emoji: emoji,
                }
            )
        }
    }
    return openings
}

const parseEventLine =(lineElement: string) => {
    const emojiMap = {
        "WV": "🥂",
        "V": "🥂",
        "NV": "🥂",
        "**": "🥂",
        "/Y": "🥂",
        "*¢": "🥂",
        "¥¢": "🥂",
        "¥{": "🥂",
        "%": "🥂",
        "Yd": "🥂🍺",
        "@®": "🍷",
        "®": "🍷",
        "@": "🍷",
        "Ip": "🍺",
        "=": "☕️",
        "J?": "🎶",
        "4%": "🧀",
    }
    // We can be a bit more aggressive in the description
    const descOnlyEmojiMap = {
        "W": "🥂",
        "1": "🍺",
        "#4": "🥂🍷",
    }

    let location = lineElement
    let description = ""
    if (lineElement.indexOf("(") !== -1) {
        location = lineElement.substring(0, lineElement.indexOf("("))
        description = lineElement.substring(lineElement.indexOf("("))
    }

    let emoji = ""
    const searchString = description !== "" ? description : location
    const words = searchString.split(" ")
    const maps = description !== "" ? [emojiMap, descOnlyEmojiMap] : [emojiMap]
    for (let m of maps) {
        let k: keyof typeof m
        // @ts-ignore
        for (k in m) {
            const index = words.indexOf(k);
            if (index > -1) {
                emoji += m[k]
                words.splice(index, 1)
            }
        }
    }

    const searchStringReconstructed = words.join(" ")

    if (description !== "") {
        description = searchStringReconstructed
    } else {
        location = searchStringReconstructed
    }

    return {location, description, emoji}
}

const pullImages = async (): Promise<string[][]> => {
    const agent = new HttpsProxyAgent('https://' + process.env.PROXY_CREDS! + '@gate.smartproxy.com:7000')
    let resp: IPaginatedPosts | null = null;
    for (let i = 0; i < 5; i++) {
        // @ts-ignore
        const ig = new igApi(undefined, {
            proxy: false,
            httpsAgent: agent,
            timeout: 10000,
        })
        try {
            resp = await ig.fetchUserPostsV2('thirstygallerina')
        } catch (error) {
            console.error(error)
            continue
        }
        break
    }

    if (resp === null) {
        throw Error("Could not fetch from instagram after 5 tries...")
    }

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
import type { GatsbyNode } from "gatsby"
import { createWorker } from "tesseract.js";
import IOpening from "./src/types/IOpening";

export const sourceNodes: GatsbyNode[`sourceNodes`] = async (gatsbyApi) => {
    const { reporter } = gatsbyApi
    reporter.info(`Beginning custom node sourcing...`)

    const output = await parseImages(["./list-one.png", "./list-two.png"]);
    const openings = parseText(output);
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

const parseText = (input: string): IOpening[] => {
    const openings: IOpening[] = []
    let date = NaN;
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
                location = lineElements[1].substring(0,lineElements[1].indexOf("("))
                description = lineElements[1].substring(lineElements[1].indexOf("("))
            }
            openings.push(
                {
                    name: lineElements[0],
                    date: date,
                    address: location.trim(),
                    description: description.trim(),
                }
            )
        }
    }
    return openings
}
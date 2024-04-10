import type { GatsbyNode } from "gatsby"
import { createWorker } from "tesseract.js";

export const sourceNodes: GatsbyNode[`sourceNodes`] = async (gatsbyApi) => {
    const { reporter } = gatsbyApi
    reporter.info(`Beginning custom node sourcing...`)

    const output = await parseImages(["./list-one.png", "./list-two.png"]);
    const openings = parseText(output);


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

interface IOpening {
    name: string,
    date: number,
    location: string,
    description: string,
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
                    location: location.trim(),
                    description: description.trim(),
                }
            )
        }
    }
    console.log(openings)
    return openings
}
import {parseImages, parseText} from "../gatsby-node";
const fs = require('fs')

async function testParse() {
    const imagePaths = []
    for (const i of fs.readdirSync('./test_images')) {
        if (i.includes('.png')) {
            imagePaths.push('./test_images/' + i)

        }
    }
    const output = await parseImages(imagePaths);
    const openings = await parseText(output);
    for (const opening of openings) {
        console.log(opening.address + " " + opening.description + " " + opening.emoji)
    }
}

testParse()
const {post, get} = require("axios");
const {igApi, getCookie} = require("insta-fetcher");


module.exports.run = async (event, context) => {
    if (await getLatestPostTimestamp() > await getLastDeployTimestamp()) {
        console.log("Triggering deploy...")
        triggerDeploy()
    } else {
        console.log("No deploy necessary!")
    }
};

async function getLatestPostTimestamp() {
    const cookie = await getCookie(process.env.INSTA_LOGIN, process.env.INSTA_PASSWORD)
    const ig = new igApi(cookie)
    const resp = await ig.fetchUserPostsV2('thirstygallerina')
    return resp.edges[0].node.taken_at_timestamp * 1000
}

async function getLastDeployTimestamp() {
    const resp = await get('https://api.github.com/repos/wwwkieran/thirsty-gallerina-maps/deployments', {
        ref: 'main',
    }, {
        headers: {
            Authorization: "Bearer " + process.env.GITHUB_TOKEN
        }
    }).catch(function (error) {
        console.log('Failed to get last deploy time!')
        console.log(error)
    });
    return Date.parse(resp.data[0].created_at)
}

async function triggerDeploy() {
    await post('https://api.github.com/repos/wwwkieran/artparty/actions/workflows/main.yml/dispatches', {
        ref: 'main',
    }, {
        headers: {
            Authorization: "Bearer " + process.env.GITHUB_TOKEN
        }
    })
        .then(function (response) {
            console.log('Successfully triggered deploy!')
        })
        .catch(function (error) {
            console.log('Failed to trigger deploy!')
            console.log(error)
        });
}

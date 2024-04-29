const {post} = require("axios");
const {igApi} = require("insta-fetcher");


module.exports.run = async (event, context) => {
    if (await getLatestPostTimestamp() > await getLastDeployTimestamp()) {
        console.log("Triggering deploy...")
        triggerDeploy()
    } else {
        console.log("No deploy necessary!")
    }
};

async function getLatestPostTimestamp() {
    const ig = new igApi(process.env.INSTA_COOKIE)
    const resp = await ig.fetchUserPostsV2('thirstygallerina')
    return resp.edges[0].node.created_at
}

async function getLastDeployTimestamp() {
    const resp = await post('https://api.github.com/repos/wwwkieran/artparty/deployments', {
        ref: 'main',
    }, {
        headers: {
            Authorization: "Bearer " + process.env.GITHUB_TOKEN
        }
    }).catch(function (error) {
        console.log('Failed to get last deploy time!')
        console.log(error)
    });
    console.log(resp)
    return Date.now()
}

function triggerDeploy() {
    post('https://api.github.com/repos/wwwkieran/artparty/actions/workflows/main.yml/dispatches', {
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

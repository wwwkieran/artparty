const {post} = require("axios");
module.exports.run = async (event, context) => {
    triggerDeploy()
};

function triggerDeploy() {
    post('https://api.github.com/repos/wwwkieran/artparty/actions/workflows/main.yml/dispatches', {
        ref: 'main',
    }, {
        headers: {
            Authorization: "Bearer " + process.env.GITHUB_TOKEN
        }
    })
        .then(function (response) {
            console.log('Successfully triggered deploy')
        })
        .catch(function (error) {
            console.log(error)
        });
}

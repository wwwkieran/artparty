const {post} = require("axios");
module.exports.run = async (event, context) => {

  post('https://api.github.com/repos/wwwkieran/thirsty-gallerina-maps/actions/workflows/main.yml/dispatches', {
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
};

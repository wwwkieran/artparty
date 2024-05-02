const {getCookie} = require("insta-fetcher");

getCookie(process.env.INSTA_LOGIN, process.env.INSTA_PASSWORD).then((v) => {
    console.log(v)
})
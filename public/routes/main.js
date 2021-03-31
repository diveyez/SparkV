const Express = require("express")
const Router = Express.Router()

const CheckAuth = require("../auth/CheckAuth")

Router.get("/", async (request, response) => {
    response.redirect("/selector")
})

Router.get("/selector", CheckAuth, async (request, response) => {
    response.render("selector", {
        user: request.userinfo,
        currentURL: `${global.Bot.Config.website.baseURL}/${request.originalUrl}`
    })
})

module.exports = Router
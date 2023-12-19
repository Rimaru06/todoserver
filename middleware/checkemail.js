const zod = require("zod")

const emailRestriction = zod.string().email();
function checkEmail(req, res, next) {
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const response = emailRestriction.safeParse(email);

    if (response.success) {
        next();
    }
    else {
        res.send({ "error": "invalid email" });
    }
}

module.exports = checkEmail;
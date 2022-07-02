const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const InvitedGuestRouter = require('./routers/invited-guest');

const app = express()
const port = process.env.PORT || 8080;


app.use(express.json())
app.use(userRouter)
app.use(InvitedGuestRouter)

app.listen(port, () => {
    console.log("Server is listen on port: " + port)
})
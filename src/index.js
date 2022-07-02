const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const InvitedGuest = require('./models/invitedGuest');

const app = express()
const port = process.env.PORT || 8080;


app.use(express.json())

app.post('/users', ((req, res) => {
    const user = new User(req.body);

    user.save()
        .then(() => {
            res.status(201)
            res.send(user)
        })
        .catch((error) => {
            res.status(400)
            res.send(error)
        })

}))

app.get('/users/', ((req, res) => {
    User.find({})
        .then((user) => {
            res.send(user);
        })
        .catch((error) => {
            res.status(400)
            res.send(error)
        })

}))

app.get('/users/:id', ((req, res) => {
    const _id = req.params.id;
    console.log(_id)
    User.findOne({_id: _id})
        .then((user) => {
            console.log(user)
            if (!user) {
                res.status(500)
                return res.send()
            }
            res.send(user);
        })
        .catch((error) => {
            res.status(400)
            res.send(error)
        })

}))

app.post('/invited-guests', ((req, res) => {
    const invitedGuest = new InvitedGuest(req.body);

    invitedGuest.save()
        .then(() => {
            res.status(201)
            res.send(invitedGuest)
        })
        .catch((error) => {
            res.status(400)
            res.send(error)
        })
}))

app.get('/invited-guests/', ((req, res) => {
    InvitedGuest.find({})
        .then((invitedGuests) => {
            if (!invitedGuests) {
                res.status(404)
                return res.send("Resource not found")
            }
            res.send(invitedGuests);
        })
        .catch((error) => {
            res.status(500)
            res.send(error)
        })
}))

app.get('/invited-guests/:id', ((req, res) => {
    const _id = req.params.id;
    InvitedGuest.findOne({_id: _id})
        .then((invitedGuest) => {
            console.log(invitedGuest)
            if (!invitedGuest) {
                res.status(404)
                return res.send()
            }
            res.send(invitedGuest);
        })
        .catch((error) => {
            res.status(500)
            res.send(error)
        })
}))

app.listen(port, () => {
    console.log("Server is listen on port: " + port)
})
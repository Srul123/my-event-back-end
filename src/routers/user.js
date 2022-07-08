const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require("../middleware/auth")


router.post('/users', (async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400)
        res.send(e)
    }

}))

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/users/me', auth, (async (req, res) => {
    res.send(req.user)
}))

router.get('/users/:id', (async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findOne({_id: _id})
        if (!user) {
            return res.status(404).send()
        }
        res.send(user);
    } catch (e) {
        res.status(400)
        res.send(e)
    }

}))


router.patch('/users/:id', (async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid updates"})
    }
    const _id = req.params.id;
    console.log(_id)
    try {
        const user = await User.findOne({_id: _id})
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400)
        res.send(e)
    }
}))
module.exports = router
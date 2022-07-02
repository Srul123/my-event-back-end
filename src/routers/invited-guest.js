const express = require('express')
const InvitedGuest = require('../models/invitedGuest')
const router  = new express.Router()



router.post('/invited-guests', (async (req, res) => {
    const invitedGuest = new InvitedGuest(req.body);
    try {
        await invitedGuest.save()
        res.status(201).send(invitedGuest)
    } catch (e) {
        res.status(400)
        res.send(e)
    }
}))

router.get('/invited-guests/', (async (req, res) => {
    try {
        const invitedGuests = await InvitedGuest.find({})
        res.status(201).send(invitedGuests);
    } catch (e) {
        res.status(400)
        res.send(e)
    }
}))

router.get('/invited-guests/:id', (async (req, res) => {
    const _id = req.params.id;
    try {
        const invitedGuest = await InvitedGuest.findOne({_id: _id})
        if (!invitedGuest) {
            return res.status(404).send()
        }
        res.status(200).send(invitedGuest);
    } catch (e) {
        res.status(400)
        res.send(e)
    }
}))

router.patch('/invited-guests/:id', (async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'totalInvited', 'phoneNumber', 'email', 'arrivalStatus', 'comments']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid updates"})
    }
    const _id = req.params.id;
    try {
        const invitedGuest = await InvitedGuest.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        if (!invitedGuest) {
            return res.status(404).send()
        }
        res.send(invitedGuest)
    } catch (e) {
        res.status(400)
        res.send(e)
    }
}))

router.delete('/invited-guests/:id', (async (req, res) => {
    const _id = req.params.id;
    try {
        const invitedGuest = await InvitedGuest.findOneAndDelete({_id: _id})
        if (!invitedGuest) {
            return res.status(404).send()
        }
        res.status(200).send(invitedGuest);
    } catch (e) {
        res.status(400)
        res.send(e)
    }
}))

module.exports = router
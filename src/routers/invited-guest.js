const express = require('express')
const InvitedGuest = require('../models/invitedGuest')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/invited-guests', auth, async (req, res) => {
    const invitedGuest = new InvitedGuest({
        ...req.body,
        user: req.user._id
    });
    try {
        await invitedGuest.save()
        res.status(201).send(invitedGuest)
    } catch (e) {
        res.status(400)
        res.send(e)
    }
})

router.get('/invited-guests/', auth, async (req, res) => {
    try {
        await req.user.populate('invitedGuests')
        res.status(201).send(req.user.invitedGuests);
    } catch (e) {
        res.status(400)
        res.send(e)
    }
})

router.get('/invited-guests/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const invitedGuest = await InvitedGuest.findOne({_id, user: req.user._id})
        if (!invitedGuest) {
            return res.status(404).send()
        }
        res.status(200).send(invitedGuest);
    } catch (e) {
        res.status(400)
        res.send(e)
    }
})

router.patch('/invited-guests/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'totalInvited', 'phoneNumber', 'email', 'arrivalStatus', 'comments']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error: "Invalid updates"})
    }
    try {
        const invitedGuest = await InvitedGuest.findOne({_id: req.params.id, user: req.user._id})
        if (!invitedGuest) {
            return res.status(404).send()
        }
        updates.forEach((update) => invitedGuest[update] = req.body[update])
        await invitedGuest.save()
        res.send(invitedGuest)
    } catch (e) {
        res.status(400)
        res.send(e)
    }
})

router.delete('/invited-guests/:id', auth,async (req, res) => {
    try {
        const invitedGuest = await InvitedGuest.findOneAndDelete({_id: req.params.id, user: req.user._id})
        if (!invitedGuest) {
            return res.status(404).send()
        }
        res.status(200).send(invitedGuest);
    } catch (e) {
        res.status(400)
        res.send(e)
    }
})

module.exports = router
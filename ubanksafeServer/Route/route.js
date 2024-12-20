const saferoute = require("express").Router()

const vendorControl = require('../Controller/vendorDetails')

saferoute.post('/readvenodersdetails',vendorControl.readvenodersdetails)



module.exports = saferoute
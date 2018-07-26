"use strict";

const express = require('express');
const router  = express.Router();

module.exports = Event => {
  router.get('/:hash', (req, res) => {
    Event
      .getEventByHash(req.params.hash)
      .then( event => {
        res.render('events/show.html.ejs', {event: event})
      })
      .catch( () => {
        res.sendStatus(404)
      })
  })

  return router;
}

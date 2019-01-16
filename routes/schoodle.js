"use strict";

const express = require('express');
const router = express.Router();
const shortid = require('shortid');

module.exports = (knex) => {

  router.post("/create", (req, res) => {
    let data = req.body;
    let hash = shortid.generate();

    console.log(hash);

    knex('events').insert({
        host: data.host,
        title: data.title,
        description: data.description,
        hash: hash,
        location: data.location
      }).returning('id')
      .then(([id]) => {
        if (Array.isArray(data.start)) {
          for (var i = 0; i < data.start.length; i++) {
            knex('times').insert({
              start_time: data.start[i],
              end_time: data.end[i],
              date: data.date,
              event_id: id
            }).then((success) => {
              console.log(success)
            }).catch(err => {
              console.log('Handle Rejected Promise', err)
            })
          }
        } else {
          knex('times').insert({
            start_time: data.start,
            end_time: data.end,
            date: data.date,
            event_id: id
          }).then((success) => {
            console.log(success)
          }).catch(err => {
            console.log('Handle Rejected Promise', err)
          })
        }
      })

    setTimeout(() => {
      res.redirect('/event/' + hash)
    }, 2000);

    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const msg = {
    //   to: req.body.email,
    //   from: 'schoodledoodle@outlook.com',
    //   subject: data.title,
    //   text: data.description,
    //   html: `<strong>Here is your event link: http://localhost:8080/event/${hash}</strong>`,
    // };
    // sgMail.send(msg);

  });

  return router;
}

"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 3000;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

const shortid = require('shortid');
const moment = require('moment');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

//------------------------------------------------------------

// Event
app.get("/event/:hash", async (req, res) => {

  let templateVars = {};

  templateVars.events = await knex
  .select()
  .from("events")
  .limit(1)
  .where("hash", '=', req.params.hash)

  templateVars.times = await knex
  .select()
  .from("times")
  .where('times.event_id', '=', templateVars.events[0].id)

  templateVars.attendees = await knex
  .select()
  .from("attendees")
  .where('attendees.event_id', '=', templateVars.events[0].id)

  templateVars.date = moment(templateVars.times[0].date.toISOString().slice(0, 10)).format('LL');

  try {
    for(var person in templateVars.attendees){
      await knex
      .select()
      .from('attendees_times')
      .innerJoin('times', 'attendees_times.time_id', 'times.id')
      .where('attendees_times.attendee_id','=', templateVars.attendees[person].id)
      .then((availabilities) => {
        templateVars.attendees[person].times_available = [];
        templateVars.currentEvent = templateVars.events[0].id;
        for(var availability in availabilities){
          templateVars.attendees[person].times_available.push(availabilities[availability].id);
        }
      });
    }
  } catch(e) {
    console.log(e)
  }
  res.render('event', templateVars);
});

app.post("/event/:hash", async (req, res) => {
  let _name = req.body.name;
  let _event_id = req.body.event_id;
  let _email = 'this@email.com';

  let times = req.body.timeSlot;
  if(typeof times === 'string'){
    times = [times];
  }

  console.log('time ids: ', times);
  let hash = req.params.hash;

  knex('attendees').insert({
    name: _name,
    email: _email,
    event_id: _event_id
  }).returning('*')
  .then(([attendees]) => {
    for(var time in times){
      knex('attendees_times').insert({
        attendee_id: attendees.id,
        time_id: times[time]
      }).returning('*')
      .then((data) => {
        console.log('Data: ', data);
      })
    }
  })
  .then(() => {
    res.redirect(req.get("referer"));
  })

  // res.redirect('/event/' + hash);
});

//------------------------------------------------------------

// Create Event
app.get("/create", (req, res) => {
  res.render("create");
});

app.post('/create', (req, res) => {
  let data = req.body;
  let hash = shortid.generate();
  console.log(hash);
  console.log(data)
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
        }).then(() => {
          console.log('DONE')
        })
      }
    } else {
      knex('times').insert({
        start_time: data.start,
        end_time: data.end,
        date: data.date,
        event_id: id
      }).then(() => {
        console.log('DONE')
      })
    }
  })
  res.redirect('/event/' + hash);
});

//------------------------------------------------------------

//new edit add events
app.post("/event/:hash/edit", (req, res) => {
  let times = req.body.timeSlot;
  if(typeof times === 'string'){
    times = [times];
  }

  if(times) {
    console.log('Change Times');
  } else {
    console.log('Delete Times');
  }

  let _attendee_id = req.body.submissionButton;
  let hash = req.params.hash;

  console.log('attendee id: ', _attendee_id);
  console.log('time ids: ', times);

  knex('attendees_times')
  .where({ attendee_id: _attendee_id })
  .del()
  .then(() =>{
    for(var time in times){
      knex('attendees_times').insert({
        attendee_id: _attendee_id,
        time_id: times[time]
      }).returning('*')
      .then((data) => {
        console.log('Data: ', data);
        res.redirect('/');
      })
    }
  })
  .then(() => {
    res.redirect(req.get("referer"));
  })
})

//------------------------------------------------------------

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

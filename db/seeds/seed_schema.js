exports.seed = function(knex, Promise) {
    return knex('Events').del()
      .then(function () {
          return knex('Events').insert({title: 'Lighthouse Labs', description: 'JS Fundamentals', URL: 'https://www.lighthouselabs.com', location: '46 Spadina, Toronto'}).returning("*")
      }).then(event => {
          console.log(event[0].id)
          let id = event[0].id
          knex('Times').insert({start_time: '7:30 PM', end_time: '9:00 PM', date: 'July 30, 2018', event_id: 'id'}).returning("*")
      }).then(event => {
          console.log(event)
          return knex('Attendees').insert({name: 'Dexter', email: 'boyGenius@TheGreat.com', event_id: event[0]}).returning('event_id')
      }).then(event => {
        return knex('Attendees_Times').insert({attendee_id: event[0], event_id: event[0]})
  });
}
exports.seed = function(knex, Promise) {
    let id = 0;
    return knex('events').del()
      .then(function () {
          return knex('events').insert({host: 'DeeDee', title: 'Lighthouse Labs', description: 'JS Fundamentals', hash: 'kjg4j3', location: '46 Spadina, Toronto'}).returning("id");
      }).then(event => {
          id = event[0];
          return knex('times').insert({start_time: '7:30 PM', end_time: '9:00 PM', date: 'July 30, 2018', event_id: id}).returning("event_id");
      }).then(() => {
          return knex('attendees').insert({name: 'Dexter', email: 'boyGenius@TheGreat.com', event_id: id}).returning('event_id');
      }).then(() => {
        return knex('attendees_times').insert({attendee_id: id, time_id: id});
  });
}
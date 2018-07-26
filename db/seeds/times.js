exports.seed = function(knex, Promise) {
    return knex('Times').del()
      .then(function () {
        return Promise.all([
          knex('Times').insert({start_time: '7:30 PM', end_time: '9:00 PM', date: 'July 30, 2018'}),
        ]);
      });
  };
  
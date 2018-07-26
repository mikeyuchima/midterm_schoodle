exports.seed = function(knex, Promise) {
    return knex('Attendees').del()
      .then(function () {
        return Promise.all([
          knex('Attendees').insert({name: 'Dexter', email: 'boyGenius@TheGreat.com'}),
        ]);
      });
  };
  
exports.seed = function(knex, Promise) {
    return knex('Events').del()
      .then(function () {
        return Promise.all([
          knex('Events').insert({title: 'Lighthouse Labs', description: 'JS Fundamentals', URL: 'https://www.lighthouselabs.com', location: '46 Spadina, Toronto'}),
        ]);
      });
  };
  
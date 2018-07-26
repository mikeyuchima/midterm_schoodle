
exports.up = function(knex, Promise) {
  return new Promise( resolve => {
    knex.schema.renameTable('Events', 'events')
      .then( () => {
        return knex.schema.alterTable('events', table => {
          table.renameColumn('URL', 'url')
          table.unique('url')
        })
      })
      .then( () => {
        resolve()
      })
  })
};

exports.down = function(knex, Promise) {

};

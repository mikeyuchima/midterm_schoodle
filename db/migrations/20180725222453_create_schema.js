exports.up = function(knex, Promise) {
    return knex.schema.createTable('Events', function (table) { 
        table.increments('id').primary();
        table.string('title');
        table.string('description');
        table.string('URL');
        table.string('location');
        }).then(() => {        
            return knex.schema.createTable('Attendees', function (table) {
            table.increments('id').primary()
            table.string('name');
            table.string('email');
            table.integer('event_id').unsigned();
            table.foreign('event_id').references('Events.id');
        }).then(() => {
            return knex.schema.createTable('Times', function (table) {
            table.increments('id').primary()
            table.string('start_time');
            table.string('end_time');
            table.date('date');
            table.integer('event_id').unsigned();
            table.foreign('event_id').references('Events.id');
            }).then(() => {
                return knex.schema.createTable('Attendees_Times', function (table) {
                table.integer('attendee_id').unsigned();
                table.foreign('attendee_id').references('Attendees.id');
                table.integer('time_id').unsigned();
                table.foreign('time_id').references('Times.id');
                })
            })
        })
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('Events_Times', function (table) { 
        }).then(data => {        
            return knex.schema.dropTable('Attendees_Times', function (table) {
        }).then(data => {
            return knex.schema.dropTable('Times', function (table) {
            }).then(data => {
                return knex.schema.dropTable('Attendees', function (table) {
                }).then(data => {
                    return knex.schema.dropTable('Events', function (table) {
                    })
                })
            })
        })
    })
}
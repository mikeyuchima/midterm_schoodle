exports.up = function(knex, Promise) {
    return knex.schema.createTable('events', function (table) { 
        table.increments('id').primary();
        table.string('host');
        table.string('title');
        table.string('description');
        table.string('hash');
        table.string('location');
        }).then(() => {        
            return knex.schema.createTable('attendees', function (table) {
            table.increments('id').primary()
            table.string('name');
            table.string('email');
            table.integer('event_id').unsigned();
            table.foreign('event_id').references('events.id');
        }).then(() => {
            return knex.schema.createTable('times', function (table) {
            table.increments('id').primary()
            table.string('start_time');
            table.string('end_time');
            table.date('date');
            table.integer('event_id').unsigned();
            table.foreign('event_id').references('events.id');
            }).then(() => {
                return knex.schema.createTable('attendees_times', function (table) {
                table.integer('attendee_id').unsigned();
                table.foreign('attendee_id').references('attendees.id');
                table.integer('time_id').unsigned();
                table.foreign('time_id').references('times.id');
                })
            })
        })
    })
}

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('attendees_times', function () {
    }).then(() => {
        return knex.schema.dropTable('times', function () {
        }).then(() => {
            return knex.schema.dropTable('attendees', function () {
            }).then(() => {
                return knex.schema.dropTable('events', function () {
                })
            })
        })
    })
}

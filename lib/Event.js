module.exports = knex => {
  return {
    getEventByHash: hashId => {
      return new Promise( (resolve, reject) => {
        resolve({title: 'Event Title'})
        /*knex
          .from('events')
          .where({id: hashId})
          .limit(1)
          .then( events => {
            resolve( events.length > 0 ? events[0] : null)
          })
          .catch( err => {
            reject(err)
          }) */
      })
    }
  }
}

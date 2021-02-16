'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BooksSchema extends Schema {
  up () {
    this.table('books', (table) => {
      // alter table
      table.string('image_url', 254)
    })
  }

  down () {
    this.table('books', (table) => {
      // reverse alternations
      table.dropColumn('image_url')
    })
  }
}

module.exports = BooksSchema

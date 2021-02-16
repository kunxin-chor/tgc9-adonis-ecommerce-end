'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCartToUserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.text('cart_data');
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
      table.drop('cart_data');
    })
  }
}

module.exports = AddCartToUserSchema

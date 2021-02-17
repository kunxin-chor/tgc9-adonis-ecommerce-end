'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCartToUsersSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.text('cart_content')
    })
  }

  down () {
    this.table('add_cart_to_users', (table) => {
      // reverse alternations
      table.drop(cart_content)
    })
  }
}

module.exports = AddCartToUsersSchema

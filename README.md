# Walkthrough
1. Clone the `.env.example` file and rename it as `.env`

2. Go to the RandomKeyGen website and copy a key and set it in the `.env` file

3. At the project folder, do `yarn install`

4. Do migration with `adonis migration:run`

## Adding in an API-based shopping cart


### Modifying the Users table
We are going to change the `Users` table so that it can save a **serialized form** of a shopping
cart. To serialize means to "change an object into a string" so that we can save it.

At the terminal, type in the command to make a new migration:

```adonis make:migration add_cart_to_user```

From the prompt, choose `Select table`.

Open up the created migration file in `database/migrations` and change it to the following:
```
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
```

### Decide on the cart format

The follow JavaScript object is a **sample** of how data in the shopping cart will look like.

```
[
    "3":{
        "id": 3
        "title":"The Lord of the Rings",
        "condition": 2,
        "price": 3000,
        "qty": 2
    }
]
```
The *key* is the id of the book. We **expects the React client** to store the
shopping cart in this format and will send our API this particular format

### Add an API to save the cart

Let's create a new `api\CartController`, that allows us to update the content of a user's
shopping cart. At the terminal, type in (and select HTTP requests at the prompt)

```
adonis make:controller api/CartController
```
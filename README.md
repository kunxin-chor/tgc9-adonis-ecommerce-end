# Walkthrough
1. Clone the `.env.example` file and rename it as `.env`

2. Go to the RandomKeyGen website and copy a key and set it in the `.env` file

3. At the project folder, do `yarn install`

4. Do migration with `adonis migration:run`

## Adding in an API-based shopping cart

We are going to change the `Users` table so that it can save a **serialized form** of a shopping
cart. To serialize means to "change an object into a string" so that we can save it.

At the terminal, type in the command to make a new migration:

```adonis make:migration add_cart_to_user```

From the prompt, choose `Select table`.

Open up the created migration file in `database/migrations` and change it to the following:


'use strict'


const Book = use('App/Models/Book')
const Config = use('Config')
const { validateAll } = use('Validator')

const rules = {
  title: 'required|max:254',
  condition: 'required|integer|range:1,5',
  price: 'required|integer|above:1',
  image_url: 'required'
}

const messages = {
  'title.required': 'Please provide a title',
  'title.max': 'Please provide a shorter title',
  'condition.range': 'Must be between 1 to 5',
  'condition.required': 'Please provide a condition rating',
  'condition.integer': 'Must be a whole number',
  'price.required': 'Please provide a price',
  'price.above': 'Price cannot be lower than 1',
  'price.integer': 'Must be a whole number',
  'image_url.required': 'Please provide an image'
}

class BookController {
  async index({ view, request }) {

    let query = Book.query();
    // retrieve search parameters from the query strings
    let searchParams = request.get();

    if (searchParams.title) {
      query.where('title', 'like', '%' + searchParams.title + '%')
    }

    if (searchParams.maxPrice) {
      query.where('price', '<=', searchParams.maxPrice)
    }

    if (searchParams.condition) {
      query.where('condition', '>=', searchParams.condition)
    }

    // select all the rows from the books table
    let allBooks = await query.fetch();
    return view.render('books/index', {
      "books": allBooks.toJSON(), // must convert to JSON
      "oldValues": request.get()
    })
  }

  async show({ view, params }) {
    // extract out the book_id parameter from the URL
    let bookId = params.book_id;

    // select * from books where id = bookId
    let book = await Book.find(bookId);
    return view.render("books/show", {
      "book": book
    })
  }

  create({ view }) {
    return view.render('books/create', {
      cloudinaryName: Config.get('cloudinary.name'),
      cloudinaryPreset: Config.get('cloudinary.preset'),
      cloudinaryApiKey: Config.get('cloudinary.api_key'),
      signUrl: '/cloudinary/sign'
    })
  }

  async processCreate({ request, response, session }) {

    let body = request.post();
    const validation = await validateAll(body, rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    let book = new Book();
    book.title = body.title;
    book.condition = body.condition;
    book.price = body.price;
    book.image_url = body.image_url;
    session.flash({ notification: `${book.title} has been created` });
    await book.save();
    return response.route('BookController.index')
  }
}

module.exports = BookController

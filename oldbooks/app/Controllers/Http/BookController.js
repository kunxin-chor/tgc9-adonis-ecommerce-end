'use strict'


const Book = use('App/Models/Book')
const Config = use('Config')

class BookController {
  async index({view, request}) {

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

  async show({view, params}) {
    // extract out the book_id parameter from the URL
    let bookId = params.book_id;

    // select * from books where id = bookId
    let book = await Book.find(bookId);
    return view.render("books/show", {
      "book": book
    })
  }

  create({view}) {
    return view.render('books/create',{
      cloudinaryName: Config.get('cloudinary.name'),
      cloudinaryPreset: Config.get('cloudinary.preset'),
      cloudinaryApiKey: Config.get('cloudinary.api_key'),
      signUrl:'/cloudinary/sign'
    })
  }

  async processCreate({request, response}) {
    let body = request.post();
    console.log(body);
    let book = new Book();
    book.title = body.title;
    book.condition = body.condition;
    book.price = body.price;
    book.image_url = body.image_url;
    await book.save();
    return response.route('BookController.index')
  }
}

module.exports = BookController

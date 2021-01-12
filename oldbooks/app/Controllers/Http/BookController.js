'use strict'


const Book = use('App/Models/Book')
const Config = use('Config')
const {validateAll} = use('Validator')

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

  async processCreate({request, response, session}) {

    const rules = {
      'title':'required|max:100',
      'condition':'required|integer|range:1,5',
      'price':'required|integer|above:0'
    }

    const messages = {
      'title.required':"Please enter a title for the book",
      'title.max':"Please enter a shorter title",
      'condition.required':"Please enter a condition rating",
      'condition.integer':"Please only enter whole numbers",
      'condition.range':'Please enter only numbers from 1 to 5',
      'price.required':"Please enter a price",
      'price.integer':"Please enter an integer for price",
      'price.above':'Price must be greater than 0'
    }

    // extract out the data in the form
    let body = request.post();

    // validate the data inside the body variable
    // 1st arg -- the data to validate
    // 2nd arg -- the validation rules
    // 3rd arg -- custome error messages
    const validation = await validateAll(body, rules, messages);

    if (validation.fails()) {
      // store all the error messages inside the session
      session.withErrors(validation.messages()).flashExcept([]);

      console.log(validation.messages())

      // go back to the previous page
      return response.redirect('back')
    }


    console.log(body);
    let book = new Book();
    book.title = body.title;
    book.condition = body.condition;
    book.price = body.price;
    book.image_url = body.image_url;
    await book.save();
    // show a flash message to the user that we have successfully created a book
    session.flash({
      notification: `${book.title} has been created`
    })
    return response.route('BookController.index')
  }
}

module.exports = BookController

'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route.get('books/', 'BookController.index').as('show_all_books')
Route.get('books/create', 'BookController.create')
Route.post('books/create', 'BookController.processCreate')
Route.get('books/:book_id', 'BookController.show').as('show_book')


Route.get('authors/', 'AuthorController.index').as('show_all_authors')
Route.get('authors/create', 'AuthorController.create')
Route.post('authors/create', 'AuthorController.processCreate')
Route.get('authors/:author_id', 'AuthorController.show').as('show_author')

Route.get('publishers', 'PublisherController.index').as('show_all_publishers')
Route.get('publishers/:publisher_id/show', 'PublisherController.show').as('show_publisher')
Route.get('publishers/create', 'PublisherController.create')
Route.post('publishers/create', 'PublisherController.processCreate')
Route.get('publishers/:publisher_id/update', 'PublisherController.update')
Route.post('publishers/:publisher_id/update', 'PublisherController.processUpdate')
Route.get('publishers/:publisher_id/delete', 'PublisherController.delete').as('delete_publisher')
Route.post('publishers/:publisher_id/delete', 'PublisherController.processDelete')

Route.get('cloudinary/sign', 'CloudinaryController.sign')
     .as('cloudinary_sign')

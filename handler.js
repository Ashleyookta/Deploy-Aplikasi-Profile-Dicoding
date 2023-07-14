const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

  if(!name || name === undefined){
    const response = h.response({
      "status": 'fail',
      "message": 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if(pageCount < readPage && readPage > pageCount){
    const response = h.response({
      "status": "fail",
      "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    name,year,author,summary,publisher,pageCount,readPage,reading,id,finished,insertedAt,updatedAt
  };
  books.push(newBooks);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if(!isSuccess){
    const response = h.response({
      "status": "error",
      "message": "Buku gagal ditambahkan"
    });
    response.code(500);
    return response;
  }

  else{
    const response = h.response(
      {
      "status": "success",
      "message": "Buku berhasil ditambahkan",
      "data": {
          "bookId": id
      },
    });
    response.code(201);
    return response;
  }
}


const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (name) {
    const queryName = books.filter((book) => {
      const nameRegex = new RegExp(name, 'gi');
      return nameRegex.test(book.name);
    });
    const response = h.response({
        status: 'success',
        data: {
          books: queryName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
    response.code(200);
    return response;
  }

  if (reading) {
    const queryReading = books.filter(
      (book) => Number(book.reading) === Number(reading),
    );
    const response = h.response({
        status: 'success',
        data: {
          books: queryReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);
    return response;
  }

  if(finished){
    const queryFinished = books.filter((book) => Number(book.finished) === Number(finished),
  );
  const response = h.response({
      status: 'success',
      data: {
        books: queryFinished.map((book) => ({
          id: book.id,
            name: book.name,
            publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }

    if (books) {
      const response = h.response({
      "status": "success",
      "data": {
        books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
      }
      });
      response.code(200);
      return response;
    }

    else{
      const response = h.response({
      "status": "success",
      "data": [],
      });
      response.code(200);
      return response;
    }

    
}

const getBookByIdHandler = (request,h) => {
  const {bookId} = request.params;

  const book = books.filter((b) => b.id === bookId)[0];
  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  else{
    const response = h.response({
        status: 'success',
        data: {
          book
        },
      });
      response.code(200);
      return response;
  }
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

  if(!name || name === undefined){
    const response = h.response({
      "status": 'fail',
      "message": 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  if(pageCount < readPage && readPage > pageCount){
    const response = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
    });
    response.code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  else{
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };
    const response = h.response({
      "status": "success",
      "message": "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) {
    const response = h.response({
      "status": "fail",
      "message": "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }

  else{
    books.splice(index,1)
    const response = h.response({
      "status": "success",
      "message": "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }
};

module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler,editBookByIdHandler,deleteBookByIdHandler};

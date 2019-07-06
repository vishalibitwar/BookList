class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
  }
}

class UI {

  addBookToList(book) {
    const list = document.getElementById('list-item');
    const row = document.createElement('tr');
    row.innerHTML =
      ` <td>${book.title}</td>
          <td>${ book.author}</td>
          <td><a href="#" class="delete">X</a></td> `;
    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement('div');
    div.className = ` alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    document.querySelector('#submit').disabled = true;
    setTimeout(function () {
      document.querySelector('.alert').remove();
      document.querySelector('#submit').disabled = false;
    }, 1200);
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
  }

  deleteBook(target) {
      target.parentElement.parentElement.remove();
    this.showAlert('Book is Removed', 'sucess');
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null)
      books = [];
    else
      books = JSON.parse(localStorage.getItem('books'));
    return books;
  }
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const ui = new UI();
      ui.addBookToList(book);
    });
  }
  static addBook(book) {
    const books = this.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(author) {
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.author === author)
        books.splice(index, 1);
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}
document.addEventListener('DOMContentLoaded', Store.displayBooks);

document.querySelector('#list-item').addEventListener('click', function (e) {
  const ui = new UI();
  if (e.target.classList.contains('delete'))
    ui.deleteBook(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});

document.getElementById('book-form').addEventListener('submit', function (e) {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const book = new Book(title, author);
  const ui = new UI();
  if (title === '' || author === '') {
    ui.showAlert('Please fill all the fields', 'error');
  } else {
    ui.addBookToList(book);
    Store.addBook(book);
    ui.showAlert('Book is added', 'sucess');
    ui.clearFields();
  }
});
/**
 * [
 *    {
 *      id: <int>
 *      title: <string>
 *      author: <string>
 *      year: <int>
 *      isComplete: <boolean>
 *    }
 * ]
 */

let books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

/* Fungsi ini untuk generate id buku */
function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    window.alert(
      "Your browser does not support local storage, system can't save your book!"
    );
    return false;
  }
  return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see books}
 */
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

/**
 * Fungsi ini digunakan dalam membuat element baru untuk menampilkan buku yang di tambahkan pengguna
 */
function makeBook(bookObject) {
  const { id, title, author, year, isComplete } = bookObject;

  /* Variable ini digunakan untuk Membuat 3 Child Elemen book_item -> "title, author, year". */
  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Author : " + author;

  const textYear = document.createElement("p");
  textYear.innerText = "Year : " + year;

  /* Variable ini digunakan untuk Membuat 1 Child lainnya dari Elemen book_item -> "title, author, year". */
  const greenButton = document.createElement("button");
  greenButton.classList.add("green");

  const redButton = document.createElement("button");
  redButton.classList.add("red");

  const actionButton = document.createElement("div");
  actionButton.classList.add("action");
  actionButton.append(greenButton, redButton);

  /* Variable ini digunakan untuk Membuat parent (pembungkus) "book_item" dengan tag article yang berisikan 3 elemen didalamnya (child) -> "title, author, year". */
  const articleBookItem = document.createElement("article");
  articleBookItem.classList.add("book_item");
  articleBookItem.append(textTitle, textAuthor, textYear, actionButton);
  articleBookItem.setAttribute("id", `${id}`);

  /**
   * Fungsi ini digunakan untuk Confirm Delete Penghapusan buku
   */
  const ui = {
    confirm: async (message) => createConfirm(message),
  };

  const createConfirm = (message) => {
    return new Promise((complete, failed) => {
      $("#confirmMessage").text(message);

      $("#confirmYes").off("click");
      $("#confirmNo").off("click");

      $("#confirmYes").on("click", () => {
        $(".confirm").hide();
        complete(true);
      });
      $("#confirmNo").on("click", () => {
        $(".confirm").hide();
        complete(false);
      });

      $(".confirm").show();
    });
  };

  const saveForm = async () => {
    const confirm = await ui.confirm(
      "Are you sure you want to delete this book?"
    );

    if (confirm) {
      deleteBookFromCompleted(id);
      alert("Deleting Book Success!");
    } else {
      alert("Deleting Books is cancelled!");
    }
  };

  /**
   * Kondisi ini untuk menambahkan button "hapus buku" dan "selesai dibaca" atau "belum selesai dibaca" setelah buku ditambahkan oleh pengguna
   */
  if (isComplete === true) {
    greenButton.innerText = "Selesai di Baca";
    greenButton.addEventListener("click", function () {
      window.alert('Book has been successfully moved to "unfinished" list');
      unReadBookFromCompleted(id);
    });

    redButton.innerText = "Hapus Buku";
    redButton.addEventListener("click", function () {
      redButton.setAttribute("onclick", saveForm());
    });
  } else {
    greenButton.innerText = "Belum selesai di Baca";
    greenButton.addEventListener("click", function () {
      window.alert('Book has been successfully moved to "finished " list');
      addBookToCompleted(id);
    });
    redButton.innerHTML = "Hapus Buku";
    redButton.addEventListener("click", function () {
      redButton.setAttribute("onclick", saveForm());
    });
  }

  return articleBookItem;
}

/**
 * Fungsi ini digunakan untuk menambahkan buku baru
 */
function addBook() {
  const textTitleBook = document.getElementById("inputBookTitle").value;
  const textAuthorBook = document.getElementById("inputBookAuthor").value;
  const textYearBook = document.getElementById("inputBookYear").value;
  const checkAddBook = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();

  const bookObject = generateBookObject(
    generatedID,
    textTitleBook,
    textAuthorBook,
    textYearBook,
    checkAddBook,
    false
  );

  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

/**
 * Fungsi ini digunakan untuk memindahkan buku ke kondisi "selesai dibaca" --> isComplete = true
 */
function addBookToCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

/**
 * Fungsi ini digunakan untuk memindahkan buku ke kondisi "belum selesai dibaca" --> isComplete = false
 */
function unReadBookFromCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

/**
 * Fungsi ini digunakan untuk menghapus buku
 */
function deleteBookFromCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm /* HTMLFormElement */ = document.getElementById("inputBook");

  const cariBuku = document.getElementById("searchSubmit");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  cariBuku.addEventListener("click", function (event) {
    event.preventDefault();
    searchListBooks();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data successfully updated.");
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  const checkAddBook = document.getElementById("inputBookIsComplete").checked;

  // clearing list item
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (bookItem.isComplete) {
      completeBookshelfList.append(bookElement);
    } else if (checkAddBook.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  }
});

/**
 * Fungsi ini digunakan untuk fitur Pencarian buku
 */
function searchListBooks() {
  const searchBookTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const searchBookItems = document.querySelectorAll(".book_item > h3");

  if (searchBookTitle != "") {
    for (const data of searchBookItems) {
      if (data.innerText.toLowerCase().includes(searchBookTitle)) {
        data.parentElement.style.display = "block";
      } else {
        data.parentElement.style.display = "none";
      }
    }
    window.alert("Books has been Found!");
  } else {
    window.alert("Books not found, Please add first!");
  }
}

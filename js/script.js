const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const title = document.getElementById("judul").value;
  const author = document.getElementById("penulis").value;
  const year = document.getElementById("tahun").value;
  const isCompleted = document.getElementById("checklist").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    isCompleted
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById("unCompleted");
  uncompletedBOOKList.innerHTML = "";

  const completedBOOKList = document.getElementById("Completed");
  completedBOOKList.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    uncompletedBOOKList.append(bookElement);

    if (bookItem.isCompleted == false) {
      uncompletedBOOKList.append(bookElement);
    } else {
      completedBOOKList.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h2");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("h4");
  textAuthor.innerText = "Judul : " + bookObject.author;

  const dateYear = document.createElement("h4");
  dateYear.innerText = "Tahun : " + bookObject.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, dateYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const belumBacaButton = document.createElement("button");
    belumBacaButton.innerText = "Belum Selesai dibaca";
    belumBacaButton.classList.add("read-button");
    belumBacaButton.addEventListener("click", function () {
      readTaskFromCompleted(bookObject.id);
    });

    const hapusButton1 = document.createElement("button");
    hapusButton1.innerText = "Hapus Buku";
    hapusButton1.classList.add("delete-button");
    hapusButton1.addEventListener("click", function () {
      removeTaskFromCompleted(bookObject.id);
    });

    container.append(belumBacaButton, hapusButton1);
  } else {
    const selesaiDibacaButton = document.createElement("button");
    selesaiDibacaButton.innerText = "Selesai dibaca";
    selesaiDibacaButton.classList.add("read-button");
    selesaiDibacaButton.addEventListener("click", function () {
      addTaskToCompleted(bookObject.id);
    });

    const hapusButton2 = document.createElement("button");
    hapusButton2.innerText = "Hapus Buku";
    hapusButton2.classList.add("delete-button");
    hapusButton2.addEventListener("click", function () {
      removeTaskFromCompleted(bookObject.id);
    });

    container.append(selesaiDibacaButton, hapusButton2);
  }

  return container;
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function readTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

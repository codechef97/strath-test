var selectType = document.getElementById("selectType");
var totalCount = document.getElementById("totalCount");
var inputSearch = document.getElementById("input1");
selectType.addEventListener('change', ChangePlaceholder);

//dynamically changing the placeholder depending on the selection from dropdown.
function ChangePlaceholder() {
    if (selectType.value == "byTitle") {
        inputSearch.placeholder = "Enter Book Title";
    }
    if (selectType.value == "byISBN") {
        inputSearch.placeholder = "Enter Book's ISBN";
    }
}


// This will help us to get the booksList
function getBooksList() {

    document.getElementById('outputList').innerHTML = "";
    totalCount.innerText = "";

    // Validation of input - It'll reduce unnecessary API call
    if (inputSearch.value.length <= 0) {
        alert("Please Enter Book Title / ISBN")
        return;
    }

    //Call GetBookListBy ISBN
    if (selectType.value == "byISBN")
        return getBooksListByISBN();
    
    
    fetch("https://openlibrary.org/search.json?q=" + inputSearch.value + "&page=1&limit=10")
        .then(a => a.json())
        .then(response => {
            document.getElementById('main-output').style.display = "block";
            totalCount.innerText = "(1-10 of " + response.numFound + ")";
            for (var i = 0; i < 10; i++) {
                document.getElementById("outputList").innerHTML +=
                    "<div class=\"book\" style=\"cursor:pointer; margin:1px\" onClick=\"getBookDetailsEngine(" + (response.docs[i].isbn ? response.docs[i].isbn[0] : undefined) + ")\">" +
                    "<p>Title: &nbsp" + response.docs[i].title +
                    "</p> <div style=\"display:flex; min-width:100%;\"><p> Year: &nbsp" + (response.docs.publish_year ? (!Array.isArray(response.docs[i].publish_year) ? response.docs[i].publish_year : response.docs[i].publish_year.sort().reverse()[0]) : "Not Mentioned") +
                    "</p>&nbsp;&nbsp;&nbsp;&nbsp; <p>ISBN: &nbsp;" + (response.docs[i].isbn ? response.docs[i].isbn[0] : "No ISBN") +
                    "</p></div></div>"
            }
        });
}

// This is the real engine to fire an API to get details 
function getBookDetailsEngine(isbn) {
    
    if (!isbn) {
        alert("Invalid ISBN");
        return;
    }


    fetch("https://openlibrary.org/api/books?bibkeys=ISBN:" + isbn + "&jscmd=data&format=json")
        .then(a => a.json())
        .then(response => {
            if (Object.keys(response).length === 0) {
                alert("No such ISBN Exists");
                return;
            }
            data = response ? response["ISBN:" + isbn] : {};
            document.getElementById("bookdetails-container").style.display = "block";
            document.getElementById("back-button").style.display = "block";
            document.getElementById("page-container").style.display = "none";
            document.getElementById('book-title').innerText = data.title;
            document.getElementById('book-author').innerText = data.authors[0].name;
            document.getElementById('book-cover').src = data.cover ? data.cover.small : "";
            document.getElementById('publish-year').innerText = data.publish_date;
            document.getElementById('book-isbn').innerText = isbn;
            document.getElementById("view-details").onClick = "window.open('" + data.url + "','_blank');";
        });
}

function getBooksListByISBN() {
    return getBookDetailsEngine(inputSearch.value);
}

// Temporary Go Back Functionality - Trying to have SPA.
function goBack() {
    document.getElementById("bookdetails-container").style.display = "none";
    document.getElementById("page-container").style.display = "block";
    document.getElementById("back-button").style.display = "none";
}

// If the user presses the "Enter" key on the keyboard/ Search should work
inputSearch.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("search-btn").click();
    }
  });
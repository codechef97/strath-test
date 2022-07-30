var selectType = document.getElementById("selectType");
var totalCount = document.getElementById("totalCount");

function ChangePlaceholder() {
    var inputSearch = document.getElementById("input1");
    if (selectType.value == "byTitle") {
        inputSearch.placeholder = "Enter Book Title";
    }
    if (selectType.value == "byISBN") {
        inputSearch.placeholder = "Enter Book's ISBN";
    }
}

selectType.addEventListener('change', ChangePlaceholder);


{/* <script> */ }
function getBooks1() {
    document.getElementById('output1').innerHTML = "";
    totalCount.innerText = "";
    if(document.getElementById("input1").value.length <= 0)
    {
        alert("Please Enter Book Title / ISBN")
        return;
    }
        
    if(selectType.value == "byISBN")
        return getBooks2();
    fetch("https://openlibrary.org/search.json?q=" + document.getElementById("input1").value + "&page=1&limit=10")
        .then(a => a.json())
        .then(response => {
            document.getElementById('main-output').style.display = "block";
            totalCount.innerText = "(1-10 of " + response.numFound +")"; 
            for (var i = 0; i < 10; i++) {
                document.getElementById("output1").innerHTML +=
                    "<div class=\"book\" style=\"padding:3px\">"+
                    "<p>Title: &nbsp" + response.docs[i].title +
                    "</p> <div style=\"display:flex; min-width:100%;\"><p> Year: &nbsp" + (response.docs.publish_year? (!Array.isArray(response.docs[i].publish_year)? response.docs[i].publish_year : response.docs[i].publish_year.sort().reverse()[0]) : "Not Mentioned") +
                    "</p>&nbsp;&nbsp;&nbsp;&nbsp; <p>ISBN: &nbsp;" + (response.docs[i].isbn? response.docs[i].isbn[0] : "No ISBN")  +
                    "</p></div></div>"
            }
        });
}


function getBooks2() {

    fetch("https://openlibrary.org/api/books?bibkeys=ISBN:" + document.getElementById("input1").value + "&jscmd=data&format=json")
        .then(a => a.json())
        .then(response => {
            if(Object.keys(response).length === 0)
            {
                alert("No such ISBN Exists");
                return;
            }
                
            console.log(response);
            data = response? response["ISBN:"+document.getElementById("input1").value] : {};
            document.getElementById("bookdetails-container").style.display="block";
            document.getElementById("page-container").style.display="none";
            document.getElementById('book-title').innerText = data.title;
            document.getElementById('book-author').innerText = data.authors[0].name;
            document.getElementById('book-cover').src = data.cover? data.cover.small : "";
            document.getElementById('publish-year').innerText = data.publish_date;
            document.getElementById('book-isbn').innerText = document.getElementById("input1").value;
            document.getElementById("view-details").onClick = "window.open('"+data.url+"','_blank');";
        });
}
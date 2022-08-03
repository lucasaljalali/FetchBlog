//get Fake API website
const url = 'https://jsonplaceholder.typicode.com/posts';

//get main page elements to use
const loadingElement = document.querySelector('#loading');
const postsContainer = document.querySelector('#postsContainer');

//get posts page elements to use
const postPage = document.querySelector('#post');
const postContainer = document.querySelector('#postContainer');
const commentsContainer = document.querySelector('#commentsContainer');

    //get comments section elements on posts page to use
    const commentForm = document.querySelector('#commentForm');
    const emailInput = document.querySelector('#email');
    const bodyInput = document.querySelector('#body');

//get post id from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get('id');


//FUNCTIONS

//function to get all posts from API and show in main page
async function getAllPosts() {
    
    //get raw data from API
    const response = await fetch(url);
    
    //transform API raw data in a array
    const data = await response.json();
    
    //hide the "loading" info on main page
    loadingElement.classList.add('hide');

    //get info from each API posts, using the arrays data, and insert into html
    data.map((post) => {

        //create html elements for each API post
        const title = document.createElement('h2');
        const body = document.createElement('p');
        const link = document.createElement('a');
        const div = document.createElement('div');
        
        //insert data from each API post, as text, inside each html element 
        title.innerText = post.title;
        body.innerText = post.body;
        
        //insert "Read", as text, and a href attribute linked to each post inside each 'a' html element  
        link.innerText = 'Read';
        link.setAttribute('href', `/post.html?id=${post.id}`);
        
        //put every html element created inside a div (for each post)
        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);
        
        //put each div inside the postContainer, creating a list of divs (posts)
        postsContainer.appendChild(div);
    });
}


//function to get individual post and show in post page
async function getPost(id) {
    
    //get post and comments raw data from API for each post by its id
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ]);

    //transform API raw data in a array
    const dataPost = await responsePost.json();
    const dataComments = await responseComments.json();
    
    //hide the "loading" info on post page
    loadingElement.classList.add('hide');
    postPage.classList.remove('hide');

    //create html elements
    const title = document.createElement('h1');
    const body = document.createElement('p');

    //insert data from API post, as text, inside each html element
    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    //put html elements created inside the postContainer html element
    postContainer.appendChild(title);
    postContainer.appendChild(body);

    //get (map) each comment data of the post and pass the function createComment (see below)
    dataComments.map((comment) => {
        createComment(comment);
    });
}


//function to create a comment inside comment section on post page (for each comment comming from fake API)
function createComment(comment) {
    
    //create html elements for each API comment
    const div = document.createElement('div');
    const email = document.createElement('h3');
    const commentBody = document.createElement('p');

    //insert data from each API comment, as text, inside each html element
    email.innerText = comment.email;
    commentBody.innerText = comment.body;
    
    //put every html element created inside a div (for each comment)
    div.appendChild(email);
    div.appendChild(commentBody);
    
    //put each div inside the commentsContainer, creating a list of divs (comments)
    commentsContainer.appendChild(div);
}


//function to post a comment inside comment section on post page
async function postComment(comment) {

    //send (post) comment raw data from html form to the fake API
    const response = await fetch(`${url}/${postId}/comments`, {
        method: 'POST',
        body: comment,
        headers: {
            'Content-type': 'application/json',
        }
    });

    //get the data (raw comment data) that was post before from fake API and convert to array 
    const data = await response.json();

    //pass the createComment function for this comment, adding it to the end of the comments divs list
    createComment(data);
}


//condition to select the scripts that will run for each page (main and post)

//if there is no post id, it means that it is the main page and call the getAllPosts function to show the list of posts. 
if(!postId) {
    getAllPosts();

//if there is a post id, it means that it is a post page and call the below...    
} else {
    
    //function to show the post by its id (see above)
    getPost(postId);
    
    //add a function to the event of clicking the comment form submit button ("send")
    commentForm.addEventListener('submit', (e) => {
        
        //prevent to post without data
        e.preventDefault();

        //create a object with the inputed values
        let comment = {
            email: emailInput.value,
            body: bodyInput.value
        };
        
        //convert the object to a string
        comment = JSON.stringify(comment);

        //pass the postComment function to this comment (post it on the fake API, get back and show in the comment section)
        postComment(comment);
    });
}
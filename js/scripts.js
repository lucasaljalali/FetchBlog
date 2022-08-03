const url = 'https://jsonplaceholder.typicode.com/posts';

const loadingElement = document.querySelector('#loading');
const postsContainer = document.querySelector('#postsContainer');

const postPage = document.querySelector('#post');
const postContainer = document.querySelector('#postContainer');
const commentsContainer = document.querySelector('#commentsContainer');

const commentForm = document.querySelector('#commentForm');
const emailInput = document.querySelector('#email');
const bodyInput = document.querySelector('#body');


//get id from URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get('id');

//function to get all posts from API
async function getAllPosts() {
    
    //get raw data from API
    const response = await fetch(url);
    console.log(response);
    console.log(typeof response);
    
    //transform API raw data in a array
    const data = await response.json();
    console.log(data);
    console.log(typeof data);
    
    //now that we have the data, we can hide the "loading" info
    loadingElement.classList.add('hide');

    //get infos we want from each API posts and insert into html
    data.map((post) => {
        //create html elements for each API post
        const title = document.createElement('h2');
        const body = document.createElement('p');
        const link = document.createElement('a');
        const div = document.createElement('div');
        
        //insert data text in each html element created before
        title.innerText = post.title;
        body.innerText = post.body;
        
        //create a direct link to each post 
        link.innerText = 'Read';
        link.setAttribute('href', `/post.html?id=${post.id}`);
        
        //put every element inside a div (for each post)
        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);
        
        //put each div inside the postContainer
        postsContainer.appendChild(div);
    });
}


//function to get individual post
async function getPost(id) {

    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ]);

    const dataPost = await responsePost.json();
    
    const dataComments = await responseComments.json();
    
    loadingElement.classList.add('hide');
    postPage.classList.remove('hide');

    const title = document.createElement('h1');
    const body = document.createElement('p');

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    dataComments.map((comment) => {
        createComment(comment);
    });
}


function createComment(comment) {
    
    const div = document.createElement('div');
    const email = document.createElement('h3');
    const commentBody = document.createElement('p');

    email.innerText = comment.email;
    commentBody.innerText = comment.body;

    div.appendChild(email);
    div.appendChild(commentBody);

    commentsContainer.appendChild(div);

}


async function postComment(comment) {
    const response = await fetch(`${url}/${postId}/comments`, {
        method: 'POST',
        body: comment,
        headers: {
            'Content-type': 'application/json',
        }
    });

    const data = await response.json();

    createComment(data);
}


if(!postId) {
    getAllPosts();
} else {
    getPost(postId);

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let comment = {
            email: emailInput.value,
            body: bodyInput.value
        };

        comment = JSON.stringify(comment);

        postComment(comment);
    });
}
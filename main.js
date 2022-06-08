import './style.css';

const URL = 'https://jsonplaceholder.typicode.com/posts';

const loadingElement = document.querySelector('#loading');
const postsContainer = document.querySelector('#posts-container');

const postPage = document.querySelector('#post');
const postContainer = document.querySelector('#post-container');
const commentsContainer = document.querySelector('#comments-container');

const commentForm = document.querySelector('#comment-form');
const emailInput = document.querySelector('#email');
const bodyInput = document.querySelector('#comment');

// get id from URL
const UrlSearchParams = new URLSearchParams(window.location.search);
const postID = UrlSearchParams.get('id');

const mountPost = data => {
  data.map(post => {
    const div = document.createElement('div');
    const title = document.createElement('h2');
    const body = document.createElement('p');
    const link = document.createElement('a');

    title.innerText = post.title;
    body.innerText = post.body;
    link.innerText = 'Ler';
    link.setAttribute('href', `/posts.html?id=${post.id}`);

    div.appendChild(title);
    div.appendChild(body);
    div.appendChild(link);

    postsContainer.appendChild(div);
  });
};

const mountComment = comment => {
  const div = document.createElement('div');
  const email = document.createElement('h3');
  const commentBody = document.createElement('p');

  email.innerText = comment.email;
  commentBody.innerText = comment.body;

  div.appendChild(email);
  div.appendChild(commentBody);

  commentsContainer.appendChild(div);
};

const getAllPosts = async () => {
  const response = await fetch(URL);
  const data = await response.json();

  loadingElement.classList.add('hide');
  mountPost(data);
};

const getPost = async id => {
  // preciso executar dois requests ao mesmo tempo
  const [responsePost, responseComments] = await Promise.all([
    // URL a ser acessada
    fetch(`${URL}/${id}`),
    fetch(`${URL}/${id}/comments`),
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

  dataComments.map(comment => mountComment(comment));
};

const commentEvent = event => {
  event.preventDefault();
  const comment = JSON.stringify({
    email: emailInput.value,
    body: bodyInput.value,
  });
  postComment(comment);
};

const postComment = async comment => {
  const response = await fetch(`${URL}/${postID}/comments`, {
    method: 'POST',
    body: comment,
    headers: {
      'content-type': 'application/json',
    },
  });
  const data = await response.json();

  mountComment(data);
};

if (!postID) {
  getAllPosts();
} else {
  getPost(postID);
  commentForm.addEventListener('submit', e => commentEvent(e));
}

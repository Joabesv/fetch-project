import './style.css';

const URL = 'https://jsonplaceholder.typicode.com/posts';

const loadingElement = document.querySelector('#loading');
const postsContainer = document.querySelector('#posts-container');

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

const getAllPosts = async () => {
  const response = await fetch(URL);
  console.log(response);

  const data = await response.json();
  console.log(data);

  loadingElement.classList.add('hide');

  mountPost(data);
};

getAllPosts();

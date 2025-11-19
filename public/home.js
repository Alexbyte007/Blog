const postsContainer = document.getElementById('posts');
const searchInput = document.getElementById('search');
const tagInput = document.getElementById('tagFilter');
const searchBtn = document.getElementById('searchBtn');

let allPosts = [];

function renderPosts(posts) {
  if (!posts.length) {
    postsContainer.textContent = '暂无文章';
    return;
  }

  postsContainer.innerHTML = '';
  posts.forEach((post) => {
    const card = document.createElement('article');
    card.className = 'post-card';
    const created = new Date(post.createdAt).toLocaleString();
    const tags = post.tags && post.tags.length ? `标签：${post.tags.join(', ')}` : '';

    card.innerHTML = `
      <h3><a href="/post.html?id=${post.id}">${post.title}</a></h3>
      <div class="post-meta">作者：${post.author || '匿名'} · 发布于 ${created}</div>
      <div class="post-summary">${post.summary || ''}</div>
      <div class="post-tags">${tags}</div>
    `;
    postsContainer.appendChild(card);
  });
}

function applyFilter() {
  const keyword = searchInput.value.trim().toLowerCase();
  const tagKeyword = tagInput.value.trim().toLowerCase();

  const filtered = allPosts.filter((post) => {
    const text = `${post.title} ${post.summary || ''} ${post.content}`.toLowerCase();
    const matchText = !keyword || text.includes(keyword);
    const matchTag = !tagKeyword || (post.tags || []).some((t) => t.toLowerCase().includes(tagKeyword));
    return matchText && matchTag;
  });

  renderPosts(filtered);
}

function loadPosts() {
  postsContainer.textContent = '正在加载文章...';
  fetch('/api/posts')
    .then((res) => res.json())
    .then((data) => {
      allPosts = data;
      applyFilter();
    })
    .catch((err) => {
      postsContainer.textContent = '加载失败: ' + err;
    });
}

searchBtn.addEventListener('click', () => {
  applyFilter();
});

searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') applyFilter();
});

loadPosts();

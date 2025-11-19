const postContainer = document.getElementById('post');

function getPostIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function renderPost(post, views) {
  const created = new Date(post.createdAt).toLocaleString();
  const tags = post.tags && post.tags.length ? `标签：${post.tags.join(', ')}` : '';
  const viewCount = views != null ? views : post.views || 0;

  postContainer.innerHTML = `
    <h1>${post.title}</h1>
    <div class="post-meta">作者：${post.author || '匿名'} · 发布于 ${created} · 浏览：${viewCount}</div>
    <div class="post-tags">${tags}</div>
    <div class="post-content" style="margin-top: 16px; white-space: pre-wrap;">${post.content}</div>
    <section style="margin-top:24px;">
      <h3>评论</h3>
      <div id="comments">正在加载评论...</div>
      <form id="comment-form" style="margin-top:12px;">
        <div class="form-group">
          <label>昵称：</label>
          <input type="text" id="comment-author" />
        </div>
        <div class="form-group">
          <label>评论内容：</label>
          <textarea id="comment-content" rows="3" required></textarea>
        </div>
        <button type="submit" class="button-primary">发表评论</button>
      </form>
    </section>
  `;

  attachCommentHandlers(post.id);
}

function loadComments(postId) {
  const commentsContainer = document.getElementById('comments');
  commentsContainer.textContent = '正在加载评论...';
  fetch(`/api/posts/${postId}/comments`)
    .then((res) => {
      if (!res.ok) {
        throw new Error('加载评论失败');
      }
      return res.json();
    })
    .then((comments) => {
      if (!comments.length) {
        commentsContainer.textContent = '暂时还没有评论，快来抢沙发～';
        return;
      }
      const list = document.createElement('ul');
      comments.forEach((c) => {
        const li = document.createElement('li');
        const created = new Date(c.createdAt).toLocaleString();
        li.innerHTML = `<strong>${c.author || '匿名'}</strong> · ${created}<br/>${c.content}`;
        list.appendChild(li);
      });
      commentsContainer.innerHTML = '';
      commentsContainer.appendChild(list);
    })
    .catch((err) => {
      commentsContainer.textContent = '加载失败: ' + err.message;
    });
}

function attachCommentHandlers(postId) {
  loadComments(postId);
  const form = document.getElementById('comment-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const author = document.getElementById('comment-author').value.trim();
    const content = document.getElementById('comment-content').value.trim();
    if (!content) {
      alert('评论内容不能为空');
      return;
    }
    fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ author, content }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => Promise.reject(err));
        }
        return res.json();
      })
      .then(() => {
        document.getElementById('comment-content').value = '';
        loadComments(postId);
      })
      .catch((err) => {
        alert('评论失败: ' + (err.error || err));
      });
  });
}

function loadPost() {
  const id = getPostIdFromQuery();
  if (!id) {
    postContainer.textContent = '缺少文章 ID。';
    return;
  }

  postContainer.textContent = '正在加载文章...';
  Promise.all([
    fetch(`/api/posts/${id}`).then((res) => {
      if (!res.ok) throw new Error('文章不存在');
      return res.json();
    }),
    fetch(`/api/posts/${id}/view`, { method: 'POST' }).then((res) =>
      res.ok ? res.json() : { views: null }
    ),
  ])
    .then(([post, viewResp]) => {
      renderPost(post, viewResp.views);
    })
    .catch((err) => {
      postContainer.textContent = '加载失败: ' + err.message;
    });
}

loadPost();

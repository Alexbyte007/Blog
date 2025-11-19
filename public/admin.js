const form = document.getElementById('new-post-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const tagsInput = document.getElementById('tags').value.trim();
  const summary = document.getElementById('summary').value.trim();
  const content = document.getElementById('content').value.trim();

  if (!title || !content) {
    alert('标题和内容是必填项');
    return;
  }

  const tags = tagsInput
    ? tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, author, tags, summary, content }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => Promise.reject(err));
      }
      return res.json();
    })
    .then((post) => {
      alert('发布成功！');
      window.location.href = `/post.html?id=${post.id}`;
    })
    .catch((err) => {
      alert('发布失败: ' + (err.error || err));
    });
});

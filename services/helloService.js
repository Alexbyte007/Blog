const helloRepository = require('../repositories/helloRepository');

exports.getAllPosts = () => {
  return helloRepository.findAll();
};

exports.getPostById = (id) => {
  return helloRepository.findById(id);
};

exports.getPostBySlug = (slug) => {
  return helloRepository.findBySlug(slug);
};

exports.createPost = (data) => {
  return helloRepository.create(data);
};

exports.updatePost = (id, data) => {
  return helloRepository.update(id, data);
};

exports.deletePost = (id) => {
  return helloRepository.remove(id);
};

exports.incrementViews = (id) => {
  return helloRepository.incrementViews(id);
};

exports.getComments = (id) => {
  return helloRepository.getComments(id);
};

exports.addComment = (id, data) => {
  return helloRepository.addComment(id, data);
};

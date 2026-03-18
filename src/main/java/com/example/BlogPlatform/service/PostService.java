package com.example.BlogPlatform.service;

import com.example.BlogPlatform.model.Post;
import com.example.BlogPlatform.repository.CommentRepository;
import com.example.BlogPlatform.repository.FollowRepository;
import com.example.BlogPlatform.repository.PostRepository;
import com.example.BlogPlatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PostService {

    @Autowired private PostRepository    postRepository;
    @Autowired private UserRepository    userRepository;
    @Autowired private CommentRepository commentRepository;
    @Autowired private FollowRepository  followRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPopularPosts() {
        return postRepository.findAllByOrderByViewsDesc();
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public Post incrementViews(Long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post != null) {
            post.setViews(post.getViews() + 1);
            return postRepository.save(post);
        }
        return null;
    }

    public Post likePost(Long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post != null) {
            post.setLikes(post.getLikes() + 1);
            return postRepository.save(post);
        }
        return null;
    }

    public List<Post> getPostsByAuthor(Long authorId) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
    }

    public List<Post> searchPosts(String keyword) {
        return postRepository.searchByKeyword(keyword);
    }

    public Post createPost(Map<String, Object> body) {
        String title      = (String) body.get("title");
        String content    = (String) body.get("content");
        String category   = (String) body.get("category");
        Number authorIdNum = (Number) body.get("authorId");

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        if (authorIdNum != null) {
            userRepository.findById(authorIdNum.longValue())
                          .ifPresent(post::setAuthor);
        }
        return postRepository.save(post);
    }

    public Post updatePost(Long id, Map<String, Object> body) {
        Post post = postRepository.findById(id).orElse(null);
        if (post == null) return null;

        String title    = (String) body.get("title");
        String content  = (String) body.get("content");
        String category = (String) body.get("category");

        if (title    != null) post.setTitle(title);
        if (content  != null) post.setContent(content);
        if (category != null) post.setCategory(category);
        post.setUpdatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public Map<String, Object> getAuthorStats(Long authorId) {
        long totalPosts      = postRepository.countByAuthorId(authorId);
        long totalComments   = commentRepository.countByPostAuthorId(authorId);
        long totalCategories = postRepository.countDistinctCategoriesByAuthorId(authorId);
        long totalFollowers  = followRepository.countByFollowingId(authorId);
        long totalFollowing  = followRepository.countByFollowerId(authorId);
        Long totalViews      = postRepository.sumViewsByAuthorId(authorId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts",      totalPosts);
        stats.put("totalComments",   totalComments);
        stats.put("totalCategories", totalCategories);
        stats.put("totalFollowers",  totalFollowers);
        stats.put("totalFollowing",  totalFollowing);
        stats.put("totalViews",      totalViews != null ? totalViews : 0);
        return stats;
    }

    public Map<String, Object> toResponse(Post post) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",        post.getId());
        map.put("title",     post.getTitle());
        map.put("content",   post.getContent());
        map.put("category",  post.getCategory());
        map.put("views",     post.getViews());
        map.put("likes",     post.getLikes());
        map.put("createdAt", post.getCreatedAt());
        map.put("updatedAt", post.getUpdatedAt());

        if (post.getAuthor() != null) {
            map.put("authorId",   post.getAuthor().getId());
            map.put("authorName", post.getAuthor().getName());
        }
        return map;
    }
}
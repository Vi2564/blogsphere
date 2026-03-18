package com.example.BlogPlatform.controller;

import com.example.BlogPlatform.model.Post;
import com.example.BlogPlatform.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public List<Map<String, Object>> getAllPosts() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Post p : postService.getAllPosts()) result.add(postService.toResponse(p));
        return result;
    }

    @GetMapping("/popular")
    public List<Map<String, Object>> getPopularPosts() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Post p : postService.getPopularPosts()) result.add(postService.toResponse(p));
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        Optional<Post> post = postService.getPostById(id);
        if (post.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        return ResponseEntity.ok(postService.toResponse(post.get()));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<?> incrementView(@PathVariable Long id) {
        Post post = postService.incrementViews(id);
        if (post == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        return ResponseEntity.ok(postService.toResponse(post));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Long id) {
        Post post = postService.likePost(id);
        if (post == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        return ResponseEntity.ok(postService.toResponse(post));
    }

    @GetMapping("/user/{authorId}")
    public List<Map<String, Object>> getPostsByAuthor(@PathVariable Long authorId) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Post p : postService.getPostsByAuthor(authorId)) result.add(postService.toResponse(p));
        return result;
    }

    @GetMapping("/user/{authorId}/stats")
    public Map<String, Object> getAuthorStats(@PathVariable Long authorId) {
        return postService.getAuthorStats(authorId);
    }

    @GetMapping("/search")
    public List<Map<String, Object>> searchPosts(@RequestParam String keyword) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Post p : postService.searchPosts(keyword)) result.add(postService.toResponse(p));
        return result;
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Map<String, Object> body) {
        Post created = postService.createPost(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.toResponse(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Post updated = postService.updatePost(id, body);
        if (updated == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found.");
        return ResponseEntity.ok(postService.toResponse(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Post deleted.");
    }
}
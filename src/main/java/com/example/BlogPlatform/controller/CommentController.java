package com.example.BlogPlatform.controller;

import com.example.BlogPlatform.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Get all comments for a post
    @GetMapping("/post/{postId}")
    public List<Map<String, Object>> getCommentsByPost(@PathVariable Long postId) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (var c : commentService.getCommentsByPost(postId)) {
            result.add(commentService.toResponse(c));
        }
        return result;
    }

    // Add a comment
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Map<String, Object> body) {
        var saved = commentService.addComment(body);
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(commentService.toResponse(saved));
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok("Comment deleted.");
    }
}
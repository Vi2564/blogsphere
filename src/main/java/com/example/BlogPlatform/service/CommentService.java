package com.example.BlogPlatform.service;

import com.example.BlogPlatform.model.Comment;
import com.example.BlogPlatform.repository.CommentRepository;
import com.example.BlogPlatform.repository.PostRepository;
import com.example.BlogPlatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CommentService {

    @Autowired private CommentRepository commentRepository;
    @Autowired private PostRepository    postRepository;
    @Autowired private UserRepository    userRepository;

    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
    }

    public Comment addComment(Map<String, Object> body) {
        String content     = (String) body.get("content");
        Number postIdNum   = (Number) body.get("postId");
        Number authorIdNum = (Number) body.get("authorId");
        Number parentIdNum = (Number) body.get("parentId");

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());

        if (parentIdNum != null) {
            comment.setParentId(parentIdNum.longValue());
        }

        if (postIdNum != null) {
            postRepository.findById(postIdNum.longValue())
                          .ifPresent(comment::setPost);
        }

        if (authorIdNum != null) {
            userRepository.findById(authorIdNum.longValue())
                          .ifPresent(comment::setAuthor);
        }

        return commentRepository.save(comment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    public Map<String, Object> toResponse(Comment comment) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",        comment.getId());
        map.put("content",   comment.getContent() != null ? comment.getContent() : "");
        map.put("parentId",  comment.getParentId());
        map.put("createdAt", comment.getCreatedAt());

        if (comment.getAuthor() != null) {
            map.put("authorId",   comment.getAuthor().getId());
            map.put("authorName", comment.getAuthor().getName());
        } else {
            map.put("authorId",   null);
            map.put("authorName", "Anonymous");
        }

        if (comment.getPost() != null) {
            map.put("postId", comment.getPost().getId());
        }

        return map;
    }
}
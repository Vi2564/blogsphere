package com.example.BlogPlatform.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "parent_id")
    private Long parentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private User author;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId()                       { return id; }
    public void setId(Long id)                { this.id = id; }

    public String getContent()                { return content; }
    public void setContent(String content)    { this.content = content; }

    public Long getParentId()                 { return parentId; }
    public void setParentId(Long parentId)    { this.parentId = parentId; }

    public Post getPost()                     { return post; }
    public void setPost(Post post)            { this.post = post; }

    public User getAuthor()                   { return author; }
    public void setAuthor(User author)        { this.author = author; }

    public LocalDateTime getCreatedAt()       { return createdAt; }
    public void setCreatedAt(LocalDateTime t) { this.createdAt = t; }
}
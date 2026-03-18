package com.example.BlogPlatform.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String category;

    @Column(columnDefinition = "INT DEFAULT 0")
    private int views = 0;

    @Column(columnDefinition = "INT DEFAULT 0")
    private int likes = 0;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    private User author;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId()                       { return id; }
    public void setId(Long id)                { this.id = id; }

    public String getTitle()                  { return title; }
    public void setTitle(String title)        { this.title = title; }

    public String getContent()                { return content; }
    public void setContent(String content)    { this.content = content; }

    public String getCategory()               { return category; }
    public void setCategory(String category)  { this.category = category; }

    public int getViews()                     { return views; }
    public void setViews(int views)           { this.views = views; }

    public int getLikes()                     { return likes; }
    public void setLikes(int likes)           { this.likes = likes; }

    public User getAuthor()                   { return author; }
    public void setAuthor(User author)        { this.author = author; }

    public List<Comment> getComments()        { return comments; }
    public void setComments(List<Comment> c)  { this.comments = c; }

    public LocalDateTime getCreatedAt()       { return createdAt; }
    public void setCreatedAt(LocalDateTime t) { this.createdAt = t; }

    public LocalDateTime getUpdatedAt()       { return updatedAt; }
    public void setUpdatedAt(LocalDateTime t) { this.updatedAt = t; }
}
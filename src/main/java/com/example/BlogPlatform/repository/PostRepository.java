package com.example.BlogPlatform.repository;

import com.example.BlogPlatform.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId);

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findAllByOrderByViewsDesc();

    List<Post> findByCategoryOrderByCreatedAtDesc(String category);

    @Query("SELECT p FROM Post p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Post> searchByKeyword(@Param("keyword") String keyword);

    long countByAuthorId(Long authorId);

    @Query("SELECT COUNT(DISTINCT p.category) FROM Post p WHERE p.author.id = :authorId")
    long countDistinctCategoriesByAuthorId(@Param("authorId") Long authorId);

    @Query("SELECT SUM(p.views) FROM Post p WHERE p.author.id = :authorId")
    Long sumViewsByAuthorId(@Param("authorId") Long authorId);
}
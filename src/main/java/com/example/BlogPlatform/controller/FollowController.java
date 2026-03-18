package com.example.BlogPlatform.controller;

import com.example.BlogPlatform.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "http://localhost:5173")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{followerId}/{followingId}")
    public ResponseEntity<?> toggleFollow(
            @PathVariable Long followerId,
            @PathVariable Long followingId) {
        return ResponseEntity.ok(followService.toggleFollow(followerId, followingId));
    }

    @GetMapping("/status/{followerId}/{followingId}")
    public ResponseEntity<?> getFollowStatus(
            @PathVariable Long followerId,
            @PathVariable Long followingId) {
        Map<String, Object> result = new HashMap<>();
        result.put("following",     followService.isFollowing(followerId, followingId));
        result.put("followerCount", followService.getFollowerCount(followingId));
        result.put("followingCount",followService.getFollowingCount(followingId));
        return ResponseEntity.ok(result);
    }
}
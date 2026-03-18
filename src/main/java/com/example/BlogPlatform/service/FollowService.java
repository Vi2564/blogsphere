package com.example.BlogPlatform.service;

import com.example.BlogPlatform.model.Follow;
import com.example.BlogPlatform.repository.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    public Map<String, Object> toggleFollow(Long followerId, Long followingId) {
        Map<String, Object> result = new HashMap<>();

        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
                            .ifPresent(f -> followRepository.deleteById(f.getId()));
            result.put("following", false);
            result.put("message",   "Unfollowed successfully");
        } else {
            Follow follow = new Follow();
            follow.setFollowerId(followerId);
            follow.setFollowingId(followingId);
            followRepository.save(follow);
            result.put("following", true);
            result.put("message",   "Followed successfully");
        }

        result.put("followerCount", followRepository.countByFollowingId(followingId));
        return result;
    }

    public boolean isFollowing(Long followerId, Long followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    public long getFollowerCount(Long userId) {
        return followRepository.countByFollowingId(userId);
    }

    public long getFollowingCount(Long userId) {
        return followRepository.countByFollowerId(userId);
    }
}
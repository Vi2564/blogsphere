package com.example.BlogPlatform.service;

import com.example.BlogPlatform.model.User;
import com.example.BlogPlatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Map<String, Object> toResponse(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id",    user.getId());
        map.put("name",  user.getName());
        map.put("email", user.getEmail());
        return map;
    }
}
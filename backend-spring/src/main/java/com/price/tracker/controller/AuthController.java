package com.price.tracker.controller;

import com.price.tracker.domain.entity.User;
import com.price.tracker.dto.AuthRequest;
import com.price.tracker.dto.AuthResponse;
import com.price.tracker.dto.RegisterRequest;
import com.price.tracker.repository.UserRepository;
import com.price.tracker.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El email ya está registrado"));
        }

        User user = User.builder()
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .build();

        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), req.name()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        var user = userRepository.findByEmail(req.email());
        if (user.isEmpty() || !passwordEncoder.matches(req.password(), user.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Credenciales inválidas"));
        }

        String token = jwtUtils.generateToken(user.get().getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.get().getEmail(), user.get().getEmail().split("@")[0]));
    }
}

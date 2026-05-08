package edu.cit.ycoy.orderflow.controller;

import edu.cit.ycoy.orderflow.dto.LoginDto;
import edu.cit.ycoy.orderflow.dto.UserRegistrationDto;
import edu.cit.ycoy.orderflow.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import edu.cit.ycoy.orderflow.entity.User;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistrationDto dto) {
        try {
            userService.registerUser(dto);
            // Returns a JSON object: {"message": "User registered successfully!"}
            return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
        } catch (RuntimeException e) {
            // Returns a JSON object: {"error": "Email is already registered!"}
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginDto dto) {
    try {
        User user = userService.loginUser(dto.getEmail(), dto.getPassword());
        // For now, we return a success message and user details
        return ResponseEntity.ok(Map.of(
            "message", "Login successful!",
            "email", user.getEmail(),
            "fullName", user.getFullName(),
            "role", user.getRole(),
            "id", user.getId()
            
            
        ));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
}
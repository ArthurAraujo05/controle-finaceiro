package com.exemplo.auth.service;

import com.exemplo.auth.exception.AuthException;
import com.exemplo.auth.model.Users;
import com.exemplo.auth.repository.UserRepository;
import com.exemplo.auth.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public String register(String email, String password) {
        if (userRepo.findByEmail(email).isPresent()) {
            throw new AuthException("Usuário já existe");
        }

        String hashedPassword = passwordEncoder.encode(password);
        userRepo.save(new Users(null, email, hashedPassword));
        return jwtUtil.generateToken(email);
    }

    public String login(String email, String password) {
        Users user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AuthException("Usuário não encontrado"));

        if (!passwordEncoder.matches(password, user.getSenha())) {
            throw new AuthException("Senha incorreta");
        }

        return jwtUtil.generateToken(email);
    }
}

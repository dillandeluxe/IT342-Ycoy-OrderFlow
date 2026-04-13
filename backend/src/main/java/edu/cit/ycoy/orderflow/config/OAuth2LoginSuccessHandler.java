package edu.cit.ycoy.orderflow.config;

import edu.cit.ycoy.orderflow.entity.User;
import edu.cit.ycoy.orderflow.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public OAuth2LoginSuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String username = oAuth2User.getAttribute("login");
        String email = oAuth2User.getAttribute("email");
        if (email == null) email = username + "@github.com"; 

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        if (existingUser.isEmpty()) {
            user = new User();
            user.setEmail(email);
            user.setFullName(oAuth2User.getAttribute("name") != null ? oAuth2User.getAttribute("name") : username);
            user.setRole("SELLER"); // Default role
            user.setPasswordHash("OAUTH2_PROVIDED_ACCOUNT");
            userRepository.save(user);
        } else {
            user = existingUser.get();
        }

        // Redirect back to React frontend and pass the user info in the URL
        // This mimics exactly what your AuthController returns!
        String targetUrl = "http://localhost:5173/oauth2/redirect?email=" + user.getEmail() + 
                           "&role=" + user.getRole() + 
                           "&fullName=" + user.getFullName();
                           
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
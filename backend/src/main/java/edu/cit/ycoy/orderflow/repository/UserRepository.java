package edu.cit.ycoy.orderflow.repository;

import edu.cit.ycoy.orderflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring Boot automatically writes the SQL for this just based on the method name!
    Optional<User> findByEmail(String email);
}
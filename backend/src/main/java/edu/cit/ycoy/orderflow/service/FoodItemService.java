package edu.cit.ycoy.orderflow.service;

import edu.cit.ycoy.orderflow.entity.FoodItem;
import edu.cit.ycoy.orderflow.entity.User;
import edu.cit.ycoy.orderflow.repository.FoodItemRepository;
import edu.cit.ycoy.orderflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private UserRepository userRepository;

    // FACADE: Hides the database implementation details from the controller
    public List<FoodItem> getAllAvailableFood() {
        return foodItemRepository.findAll();
    }

    // FACADE: Allows future validation logic to be added here without bloating the controller
    public FoodItem addNewFoodItem(FoodItem foodItem) {
        if (foodItem.getPrice() == null || foodItem.getPrice().doubleValue() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }

        if (foodItem.getStock() == null || foodItem.getStock() < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }

        if (foodItem.getSeller() == null || foodItem.getSeller().getId() == null) {
            throw new IllegalArgumentException("Seller ID is required");
        }

        Long sellerId = foodItem.getSeller().getId();
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        foodItem.setSeller(seller);

        return foodItemRepository.save(foodItem);
    }

    public FoodItem updateFoodItem(Long id, FoodItem foodItem) {
        FoodItem existingItem = foodItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Food item not found"));

        if (foodItem.getPrice() == null || foodItem.getPrice().doubleValue() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }

        if (foodItem.getStock() == null || foodItem.getStock() < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }

        if (foodItem.getSeller() == null || foodItem.getSeller().getId() == null) {
            throw new IllegalArgumentException("Seller ID is required");
        }

        Long sellerId = foodItem.getSeller().getId();
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        existingItem.setName(foodItem.getName());
        existingItem.setDescription(foodItem.getDescription());
        existingItem.setPrice(foodItem.getPrice());
        existingItem.setStock(foodItem.getStock());
        existingItem.setCategory(foodItem.getCategory());
        existingItem.setImageUrl(foodItem.getImageUrl());
        existingItem.setAvailable(foodItem.isAvailable());
        existingItem.setSeller(seller);

        return foodItemRepository.save(existingItem);
    }

    public void deleteFoodItem(Long id) {
        if (!foodItemRepository.existsById(id)) {
            throw new IllegalArgumentException("Food item not found");
        }
        foodItemRepository.deleteById(id);
    }
}
package edu.cit.ycoy.orderflow.service;

import edu.cit.ycoy.orderflow.entity.FoodItem;
import edu.cit.ycoy.orderflow.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    // FACADE: Hides the database implementation details from the controller
    public List<FoodItem> getAllAvailableFood() {
        return foodItemRepository.findAll();
    }

    // FACADE: Allows future validation logic to be added here without bloating the controller
    public FoodItem addNewFoodItem(FoodItem foodItem) {
        if (foodItem.getPrice().doubleValue() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        return foodItemRepository.save(foodItem);
    }
}
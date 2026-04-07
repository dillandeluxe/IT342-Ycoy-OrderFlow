package edu.cit.ycoy.orderflow.controller;

import edu.cit.ycoy.orderflow.entity.FoodItem;
import edu.cit.ycoy.orderflow.service.FoodItemService; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/food")
public class FoodItemController {

    // APPLIED PATTERN: Using the Service Facade instead of talking directly to the Database
    @Autowired
    private FoodItemService foodItemService;

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        // The controller just asks the service for the data now
        return ResponseEntity.ok(foodItemService.getAllAvailableFood());
    }

    @PostMapping
    public ResponseEntity<?> addFoodItem(@RequestBody FoodItem foodItem) {
        try {
            // The controller passes the new food to the service layer to handle business logic
            FoodItem savedItem = foodItemService.addNewFoodItem(foodItem);
            return ResponseEntity.ok(savedItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFoodItem(@PathVariable Long id, @RequestBody FoodItem foodItem) {
        try {
            FoodItem updatedItem = foodItemService.updateFoodItem(id, foodItem);
            return ResponseEntity.ok(updatedItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFoodItem(@PathVariable Long id) {
        try {
            foodItemService.deleteFoodItem(id);
            return ResponseEntity.ok(Map.of("message", "Food item deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
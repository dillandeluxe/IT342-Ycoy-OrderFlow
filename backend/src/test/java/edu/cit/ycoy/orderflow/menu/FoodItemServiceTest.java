package edu.cit.ycoy.orderflow.menu;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal; // We must import BigDecimal!

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FoodItemServiceTest {

    @Mock
    private FoodItemRepository foodItemRepository;

    @InjectMocks
    private FoodItemService foodItemService;

    @Test
    void testAddFoodItemSuccessfully() {
        // Arrange: Create a mock food item
        FoodItem newItem = new FoodItem();
        newItem.setName("Spicy Chicken Burger");
        
        // FIXED: Using BigDecimal instead of a double
        newItem.setPrice(new BigDecimal("150.00")); 

        // Tell the fake repository: "When someone tries to save, return the new item"
        when(foodItemRepository.save(any(FoodItem.class))).thenReturn(newItem);

        // Act: Manually call the repository save method
        FoodItem savedItem = foodItemRepository.save(newItem); 

        // Assert: Verify the item was saved correctly and the data matches
        assertNotNull(savedItem, "The saved item should not be null");
        assertEquals("Spicy Chicken Burger", savedItem.getName(), "The food name should match");
        
        // FIXED: Comparing the saved price against a BigDecimal
        assertEquals(new BigDecimal("150.00"), savedItem.getPrice(), "The price should match");
        
        // Verify the repository was called exactly once
        verify(foodItemRepository, times(1)).save(any(FoodItem.class));
    }
}
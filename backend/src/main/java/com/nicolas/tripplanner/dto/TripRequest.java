package com.nicolas.tripplanner.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class TripRequest {
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "Country is required")
    private String country;
    
    @Positive(message = "Price must be positive")
    private Double price;
    
    @Positive(message = "Rating must be positive")
    private Double rating;
    
    private String category;
    
    private String description;
    
    private String imageUrl;
    
    public TripRequest() {
    }
    
    public TripRequest(String city, String country, Double price, Double rating, String category) {
        this.city = city;
        this.country = country;
        this.price = price;
        this.rating = rating;
        this.category = category;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public Double getRating() {
        return rating;
    }
    
    public void setRating(Double rating) {
        this.rating = rating;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

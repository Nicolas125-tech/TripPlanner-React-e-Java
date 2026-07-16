package com.nicolas.tripplanner.dto;

public class TripResponse {
    
    private Long id;
    private String city;
    private String country;
    private Double price;
    private Double rating;
    private String category;
    private String description;
    private String imageUrl;
    
    public TripResponse(Long id, String city, String country, Double price, Double rating, String category, String description, String imageUrl) {
        this.id = id;
        this.city = city;
        this.country = country;
        this.price = price;
        this.rating = rating;
        this.category = category;
        this.description = description;
        this.imageUrl = imageUrl;
    }
    
    public Long getId() {
        return id;
    }
    
    public String getCity() {
        return city;
    }
    
    public String getCountry() {
        return country;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public Double getRating() {
        return rating;
    }
    
    public String getCategory() {
        return category;
    }
    
    public String getDescription() {
        return description;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
}

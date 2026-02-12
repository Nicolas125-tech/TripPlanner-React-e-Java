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
    
    public TripResponse() {
    }
    
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
    
    public void setId(Long id) {
        this.id = id;
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

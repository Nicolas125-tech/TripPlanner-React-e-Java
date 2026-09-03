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
    
    private TripResponse(Builder builder) {
        this.id = builder.id;
        this.city = builder.city;
        this.country = builder.country;
        this.price = builder.price;
        this.rating = builder.rating;
        this.category = builder.category;
        this.description = builder.description;
        this.imageUrl = builder.imageUrl;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String city;
        private String country;
        private Double price;
        private Double rating;
        private String category;
        private String description;
        private String imageUrl;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder city(String city) {
            this.city = city;
            return this;
        }

        public Builder country(String country) {
            this.country = country;
            return this;
        }

        public Builder price(Double price) {
            this.price = price;
            return this;
        }

        public Builder rating(Double rating) {
            this.rating = rating;
            return this;
        }

        public Builder category(String category) {
            this.category = category;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public TripResponse build() {
            return new TripResponse(this);
        }
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

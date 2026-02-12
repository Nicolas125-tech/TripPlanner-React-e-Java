package com.nicolas.tripplanner.config;

import com.nicolas.tripplanner.model.Trip;
import com.nicolas.tripplanner.repository.TripRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    
    @Bean
    public CommandLineRunner seedDatabase(TripRepository tripRepository) {
        return args -> {
            if (tripRepository.count() == 0) {
                Trip trip1 = new Trip("Paris", "France", 4500.0, 4.8, "Cidade");
                trip1.setDescription("A Cidade Luz espera por você.");
                trip1.setImageUrl("https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800");
                
                Trip trip2 = new Trip("Tokyo", "Japan", 6200.0, 4.9, "Cidade");
                trip2.setDescription("Futuro e tradição.");
                trip2.setImageUrl("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800");
                
                Trip trip3 = new Trip("Rio de Janeiro", "Brazil", 1800.0, 4.7, "Praia");
                trip3.setDescription("Cidade Maravilhosa.");
                trip3.setImageUrl("https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=800");
                
                Trip trip4 = new Trip("Dubai", "United Arab Emirates", 3200.0, 4.6, "Cidade");
                trip4.setDescription("Luxo e modernidade no deserto.");
                trip4.setImageUrl("https://images.unsplash.com/photo-1512453328298-ce6bacd09c5a?auto=format&fit=crop&q=80&w=800");
                
                Trip trip5 = new Trip("Barcelona", "Spain", 2800.0, 4.7, "Cidade");
                trip5.setDescription("Arte, arquitetura e praias.");
                trip5.setImageUrl("https://images.unsplash.com/photo-1562883714-2ecaafc3fed3?auto=format&fit=crop&q=80&w=800");
                
                tripRepository.save(trip1);
                tripRepository.save(trip2);
                tripRepository.save(trip3);
                tripRepository.save(trip4);
                tripRepository.save(trip5);
            }
        };
    }
}

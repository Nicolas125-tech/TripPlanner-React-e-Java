package com.nicolas.tripplanner.cache;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CacheConfigTest {
    @Autowired
    private CacheManager cacheManager;

    @Test
    void testCacheManagerType() {
        System.out.println("Cache Manager: " + cacheManager.getClass().getName());
    }
}

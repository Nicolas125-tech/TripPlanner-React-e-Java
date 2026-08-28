package com.nicolas.tripplanner.cache;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {"ADMIN_USERNAME=test_user", "ADMIN_PASSWORD=test_secure_pass_123"})
class CacheConfigTest {
    @Autowired
    private CacheManager cacheManager;

    @Test
    void testCacheManagerType() {
        assertEquals(org.springframework.cache.concurrent.ConcurrentMapCacheManager.class, cacheManager.getClass());
    }
}

package com.nicolas.tripplanner.cache;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cache.CacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {"ADMIN_USERNAME=test_user", "ADMIN_PASSWORD=test_secure_pass_123"})
class CacheConfigTest {
    private static final Logger logger = LoggerFactory.getLogger(CacheConfigTest.class);
    @Autowired
    private CacheManager cacheManager;

    @Test
    void testCacheManagerType() {
        logger.info("Cache Manager: {}", cacheManager.getClass().getName());
        assertNotNull(cacheManager, "Cache manager should be configured");
    }
}

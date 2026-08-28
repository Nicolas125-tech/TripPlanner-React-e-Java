package com.nicolas.tripplanner.exception;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class GlobalExceptionHandlerBenchmarkTest {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandlerBenchmarkTest.class);

    @Test
    public void benchmarkReduceVsJoining() {
        // Setup a large list of mock field errors to amplify the performance difference
        List<String> errors = new ArrayList<>();
        for (int i = 0; i < 5000; i++) {
            errors.add("field" + i + ": message " + i);
        }

        // Warm up
        for (int i = 0; i < 100; i++) {
            runReduce(errors);
            runJoining(errors);
        }

        System.gc();
        try { Thread.sleep(500); } catch (InterruptedException e) {}

        long startReduce = System.nanoTime();
        for (int i = 0; i < 50; i++) {
            runReduce(errors);
        }
        long endReduce = System.nanoTime();

        System.gc();
        try { Thread.sleep(500); } catch (InterruptedException e) {}

        long startJoining = System.nanoTime();
        for (int i = 0; i < 50; i++) {
            runJoining(errors);
        }
        long endJoining = System.nanoTime();

        logger.info("========== BENCHMARK RESULTS ==========");
        logger.info("Reduce approach took (50 iters): " + (endReduce - startReduce) / 1_000_000.0 + " ms");
        logger.info("Joining approach took (50 iters): " + (endJoining - startJoining) / 1_000_000.0 + " ms");
        logger.info("=======================================");
    }

    private String runReduce(List<String> errors) {
        return errors.stream().reduce("", (acc, msg) -> acc + "\n" + msg);
    }

    private String runJoining(List<String> errors) {
        return "\n" + errors.stream().collect(Collectors.joining("\n"));
    }
}

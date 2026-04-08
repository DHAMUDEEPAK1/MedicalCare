// Test Script for Goku Assistant Clinical Brain
import { interpretCommand, analyzeFile } from './assistantBrain';

function testSequence() {
    console.log("=== Testing Goku Clinical Brain ===\n");

    // 1. Test Lab Report Analysis (Text-based)
    console.log("TEST 1: Direct Hb Report");
    const hbResult = interpretCommand("My Hb level is 11.5");
    console.log("Result:", hbResult.message);
    console.log("------------------\n");

    // 2. Test BP Analysis
    console.log("TEST 2: Direct BP Measurement");
    const bpResult = interpretCommand("My BP is 150/95");
    console.log("Result:", bpResult.message);
    console.log("------------------\n");

    // 3. Test File Analysis (Simulated)
    console.log("TEST 3: Uploaded Lab Report (Simulated)");
    const fileResult = analyzeFile("report_1.txt", "Sugar level: 110, Cholesterol: 210");
    console.log("Result:", fileResult.message);
    console.log("------------------\n");

    // 4. Test Prescription Scheduling
    console.log("TEST 4: Prescription Analysis");
    const rxResult = analyzeFile("rx_scan.txt", "Take Amoxicillin 500mg tid for 7 days");
    console.log("Result:", rxResult.message);
    console.log("------------------\n");

    // 5. Test Context Awareness (Follow-up)
    console.log("TEST 5: Contextual Follow-up");
    const contextResult = interpretCommand("Tell me more about it");
    console.log("Result (Should refer to Rx):", contextResult.message);
    console.log("------------------\n");
}

try {
    testSequence();
} catch (error) {
    console.error("Test failed:", error);
}

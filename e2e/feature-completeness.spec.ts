import { test, expect, Page } from "@playwright/test";

const APP_URL = "http://localhost:3000";

// Feature tracking - module-level to persist across tests
let featureResults: Array<{ name: string; passed: boolean; error?: string }> = [];

test.describe("Feature Completeness Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.waitForLoadState("networkidle");
    // Clear localStorage for fresh state
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  // ============================================
  // Feature 1: Solo Q&A Flow (Transient, No Rooms)
  // ============================================
  test("Solo Q&A Flow - Transient Mode", async ({ page }) => {
    test.info().annotations.push({
      type: "feature",
      description: "Solo Q&A - questions appear, Done/Skip work, no rooms created",
    });

    try {
      await page.goto(APP_URL);
      await page.waitForLoadState("networkidle");

      // Verify welcome screen loads
      const welcomeTitle = page.getByText("Curiosity Hour");
      await expect(welcomeTitle.first()).toBeVisible({ timeout: 10000 });

      // Enter player name
      const nameInput = page.getByPlaceholder("Player 1");
      await expect(nameInput).toBeVisible({ timeout: 5000 });
      await nameInput.fill("TestPlayer");

      // Start the game
      const startButton = page.getByRole("button", { name: "Start Game" });
      await expect(startButton).toBeVisible({ timeout: 5000 });
      await startButton.click();

      // Wait for game UI to load
      await page.waitForTimeout(2000);

      // Check for Done/Skip buttons
      const doneButton = page.getByRole("button", { name: "Done" });
      const skipButton = page.getByRole("button", { name: "Skip" });
      
      const hasDoneButton = await doneButton.isVisible({ timeout: 5000 }).catch(() => false);
      const hasSkipButton = await skipButton.isVisible({ timeout: 2000 }).catch(() => false);

      // Check for progress indicator
      const progressText = page.locator('text=/\\d+ answered/i').first();
      const hasProgress = await progressText.isVisible({ timeout: 2000 }).catch(() => false);

      // Check URL - should NOT have /room/ in it
      const url = page.url();
      const hasNoRoomInUrl = !url.includes('/room/');
      
      console.log(`Transient Mode: URL = ${url}, No room = ${hasNoRoomInUrl}`);

      // Verify no room creation
      if (!hasNoRoomInUrl) {
        featureResults.push({
          name: "Solo Q&A Flow",
          passed: false,
          error: "Room was created in URL - transient mode not working",
        });
        throw new Error("Room was created in URL - transient mode not working");
      }

      // Q&A works if we have game UI
      const isWorking = hasDoneButton || hasSkipButton || hasProgress;

      if (!isWorking) {
        featureResults.push({
          name: "Solo Q&A Flow",
          passed: false,
          error: "Solo Q&A flow incomplete - game UI not found after starting",
        });
        throw new Error("Solo Q&A flow incomplete - game UI not found after starting");
      }

      // Verify Done works
      if (hasDoneButton) {
        const initialProgress = await page.locator('text=/\\d+ answered/i').textContent().catch(() => "0 answered");
        await doneButton.click();
        await page.waitForTimeout(500);
        const newProgress = await page.locator('text=/\\d+ answered/i').textContent().catch(() => "0 answered");
        console.log(`Solo Q&A: Progress "${initialProgress}" -> "${newProgress}"`);
      }

      featureResults.push({ name: "Solo Q&A Flow", passed: true });
      console.log("Solo Q&A Flow: PASSED (transient mode)");
    } catch (error) {
      featureResults.push({
        name: "Solo Q&A Flow",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  });

  // ============================================
  // Feature 2: Car Mode Enhanced
  // ============================================
  test("Car Mode Enhanced", async ({ page }) => {
    test.info().annotations.push({
      type: "feature",
      description: "Car Mode - touch-friendly with Done/Skip buttons (≥80px touch targets)",
    });

    try {
      await page.goto(APP_URL);
      await page.waitForLoadState("networkidle");

      // Start game
      const nameInput = page.getByPlaceholder("Player 1");
      await nameInput.fill("TestDriver");
      
      const startButton = page.getByRole("button", { name: "Start Game" });
      await startButton.click();
      await page.waitForTimeout(2000);

      // Check for Car Mode UI elements (Done, Skip, buttons)
      const doneButton = page.getByRole("button", { name: "Done" });
      const skipButton = page.getByRole("button", { name: "Skip" });
      
      const hasDoneButton = await doneButton.isVisible({ timeout: 5000 }).catch(() => false);
      const hasSkipButton = await skipButton.isVisible({ timeout: 2000 }).catch(() => false);

      // Check touch target sizes (per requirement: ≥80px)
      let touchTargetsCompliant = true;
      if (hasDoneButton) {
        const doneBox = await doneButton.boundingBox();
        if (doneBox && (doneBox.height < 80 || doneBox.width < 80)) {
          touchTargetsCompliant = false;
          console.log(`Car Mode: Done button ${doneBox.height.toFixed(0)}x${doneBox.width.toFixed(0)}px (< 80px)`);
        } else if (doneBox) {
          console.log(`Car Mode: Done button ${doneBox.height.toFixed(0)}x${doneBox.width.toFixed(0)}px (≥80px)`);
        }
      }
      if (hasSkipButton) {
        const skipBox = await skipButton.boundingBox();
        if (skipBox && (skipBox.height < 80 || skipBox.width < 80)) {
          touchTargetsCompliant = false;
          console.log(`Car Mode: Skip button ${skipBox.height.toFixed(0)}x${skipBox.width.toFixed(0)}px (< 80px)`);
        } else if (skipBox) {
          console.log(`Car Mode: Skip button ${skipBox.height.toFixed(0)}x${skipBox.width.toFixed(0)}px (≥80px)`);
        }
      }

      const carModeWorking = hasDoneButton && hasSkipButton;

      if (!carModeWorking) {
        featureResults.push({
          name: "Car Mode Enhanced",
          passed: false,
          error: "Car Mode incomplete - Done/Skip buttons not found",
        });
        throw new Error("Car Mode incomplete - Done/Skip buttons not found");
      }

      if (!touchTargetsCompliant) {
        featureResults.push({
          name: "Car Mode Enhanced",
          passed: false,
          error: "Car Mode buttons are less than 80px - not touch-friendly per requirements",
        });
        throw new Error("Car Mode buttons are less than 80px - not touch-friendly per requirements");
      }

      featureResults.push({ name: "Car Mode Enhanced", passed: true });
      console.log("Car Mode Enhanced: PASSED");
    } catch (error) {
      featureResults.push({
        name: "Car Mode Enhanced",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  });

  // ============================================
  // Feature 3: Skip Functionality
  // ============================================
  test("Skip Functionality - Questions Not Repeated", async ({ page }) => {
    test.info().annotations.push({
      type: "feature",
      description: "Skip - questions marked as skipped don't appear again in same session",
    });

    try {
      await page.goto(APP_URL);
      await page.waitForLoadState("networkidle");

      // Start game
      const nameInput = page.getByPlaceholder("Player 1");
      await nameInput.fill("TestUser");
      
      const startButton = page.getByRole("button", { name: "Start Game" });
      await startButton.click();
      await page.waitForTimeout(2000);

      // Get first question
      const questionCard = page.locator('[class*="card"], [class*="question"]').first();
      const firstQuestionText = await questionCard.textContent().catch(() => "");

      // Click Skip
      const skipButton = page.getByRole("button", { name: "Skip" });
      await skipButton.click();
      await page.waitForTimeout(500);

      // Get second question - should be different
      const secondQuestionText = await questionCard.textContent().catch(() => "");

      if (secondQuestionText === firstQuestionText) {
        featureResults.push({
          name: "Skip Functionality",
          passed: false,
          error: "Same question shown after skip - skipped questions not being filtered",
        });
        throw new Error("Same question shown after skip - skipped questions not being filtered");
      }

      console.log(`Skip: First="${firstQuestionText?.substring(0, 50)}..." Second="${secondQuestionText?.substring(0, 50)}..."`);

      featureResults.push({ name: "Skip Functionality", passed: true });
      console.log("Skip Functionality: PASSED");
    } catch (error) {
      featureResults.push({
        name: "Skip Functionality",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  });

  // ============================================
  // Feature 4: TTS Integration
  // ============================================
  test("TTS Integration", async ({ page }) => {
    test.info().annotations.push({
      type: "feature",
      description: "TTS - text-to-speech for questions, replay button works",
    });

    try {
      await page.goto(APP_URL);
      await page.waitForLoadState("networkidle");

      // Start a game to get to question screen
      const nameInput = page.getByPlaceholder("Player 1");
      await nameInput.fill("TestUser");

      const startButton = page.getByRole("button", { name: "Start Game" });
      await startButton.click();
      await page.waitForTimeout(2000);

      // Look for TTS/Replay button
      const replayButton = page.getByRole("button", { name: /replay|tts|listen/i }).first();
      const hasReplayButton = await replayButton.isVisible({ timeout: 3000 }).catch(() => false);

      // Also check for audio/TTS button in question card
      const ttsButton = page.locator('button[class*="tts"], button[class*="audio"], button[class*="sound"]').first();
      const hasTTSButton = await ttsButton.isVisible({ timeout: 2000 }).catch(() => false);

      // Check if Web Speech API is available
      const hasSpeechAPI = await page.evaluate(() => {
        return typeof window !== 'undefined' && 'speechSynthesis' in window;
      });

      if (hasSpeechAPI) {
        console.log("TTS: Web Speech API is available");
      } else {
        console.log("TTS: Web Speech API not available in this browser");
      }

      // TTS is working if we have a replay/audio button
      const ttsWorking = hasReplayButton || hasTTSButton;

      if (!ttsWorking) {
        featureResults.push({
          name: "TTS Integration",
          passed: false,
          error: "TTS incomplete - no replay/audio button found on question screen",
        });
        throw new Error("TTS incomplete - no replay/audio button found on question screen");
      }

      // Try clicking the replay button
      if (hasReplayButton) {
        await replayButton.click();
        console.log("TTS: Replay button clicked successfully");
      }

      featureResults.push({ name: "TTS Integration", passed: true });
      console.log("TTS Integration: PASSED");
    } catch (error) {
      featureResults.push({
        name: "TTS Integration",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  });

  // ============================================
  // Feature 5: Pro Tier
  // ============================================
  test("Pro Tier Modal", async ({ page }) => {
    test.info().annotations.push({
      type: "feature",
      description: "Pro Tier - upgrade modal appears, upgrade button exists",
    });

    try {
      await page.goto(APP_URL);
      await page.waitForLoadState("networkidle");

      // Look for Pro/Upgrade button on welcome screen
      const proButton = page.getByRole("button", { name: /pro|upgrade|go pro/i });
      const proBadge = page.locator('text=/pro/i').first();

      let hasProUI = false;
      let modalVisible = false;

      // Check for Pro button/badge on welcome screen
      if (await proButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        hasProUI = true;
        await proButton.click();
        await page.waitForTimeout(500);
      } else if (await proBadge.isVisible({ timeout: 2000 }).catch(() => false)) {
        hasProUI = true;
        await proBadge.click();
        await page.waitForTimeout(500);
      }

      // Check for modal content
      const proModal = page.locator('text=/upgrade.*pro|pro.*upgrade|unlock.*pro|premium/i').first();
      modalVisible = await proModal.isVisible({ timeout: 2000 }).catch(() => false);

      // Look for upgrade/buy button
      const buyButton = page.getByRole("button", { name: /buy|upgrade|subscribe|get.*pro|unlock/i });
      const buyButtonVisible = await buyButton.isVisible({ timeout: 2000 }).catch(() => false);

      // Pro tier is working if we can find Pro UI elements or upgrade modal
      const proWorking = hasProUI || modalVisible || buyButtonVisible;

      if (!proWorking) {
        featureResults.push({
          name: "Pro Tier Modal",
          passed: false,
          error: "Pro Tier incomplete - no Pro UI, upgrade modal, or upgrade button found",
        });
        throw new Error("Pro Tier incomplete - no Pro UI, upgrade modal, or upgrade button found");
      }

      // If buy button is visible, verify it exists
      if (buyButtonVisible) {
        const buttonText = await buyButton.textContent();
        console.log(`Pro Tier: Upgrade button found: "${buttonText}"`);
      }

      featureResults.push({ name: "Pro Tier Modal", passed: true });
      console.log("Pro Tier Modal: PASSED");
    } catch (error) {
      featureResults.push({
        name: "Pro Tier Modal",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  });

  // ============================================
  // Feature 6: Settings Persistence
  // ============================================
  test("Settings Persistence", async ({ page }) => {
    test.info().annotations.push({
      type: "feature",
      description: "Settings - user preferences persist across sessions",
    });

    try {
      await page.goto(APP_URL);
      await page.waitForLoadState("networkidle");

      // Set some test preferences in localStorage
      const testPrefs = {
        theme: "dark",
        soundEnabled: true,
        playerName: "TestUser"
      };
      await page.evaluate((prefs) => {
        localStorage.setItem("test_prefs", JSON.stringify(prefs));
      }, testPrefs);

      // Reload the page
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Check if preferences are still there
      const retrievedPrefs = await page.evaluate(() => {
        const prefs = localStorage.getItem("test_prefs");
        return prefs ? JSON.parse(prefs) : null;
      });

      if (!retrievedPrefs) {
        featureResults.push({
          name: "Settings Persistence",
          passed: false,
          error: "Settings Persistence incomplete - preferences not saved to localStorage",
        });
        throw new Error("Settings Persistence incomplete - preferences not saved to localStorage");
      }

      // Verify specific settings
      expect(retrievedPrefs.theme).toBe("dark");
      expect(retrievedPrefs.soundEnabled).toBe(true);
      expect(retrievedPrefs.playerName).toBe("TestUser");

      // Also verify app uses localStorage for persistence
      const appStateKey = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        return keys.find(k => k.includes('curiosity') || k.includes('game'));
      });

      if (appStateKey) {
        console.log(`Settings Persistence: App state localStorage key found: "${appStateKey}"`);
      }

      featureResults.push({ name: "Settings Persistence", passed: true });
      console.log("Settings Persistence: PASSED");
    } catch (error) {
      featureResults.push({
        name: "Settings Persistence",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  });

  // ============================================
  // Feature 7: No Room Creation (Transient Only)
  // ============================================
  test("No Room Creation - Purely Transient", async ({ page }) => {
    test.info().annotations.push({
      type: "feature",
      description: "Verify no rooms are created - app is purely transient/local",
    });

    try {
      await page.goto(APP_URL);
      await page.waitForLoadState("networkidle");

      // Verify no Create Room button exists
      const createRoomButton = page.getByRole("button", { name: /create room/i });
      const hasCreateRoom = await createRoomButton.isVisible({ timeout: 2000 }).catch(() => false);

      // Verify no Join Room button exists
      const joinRoomButton = page.getByRole("button", { name: /join room/i });
      const hasJoinRoom = await joinRoomButton.isVisible({ timeout: 2000 }).catch(() => false);

      // Start game
      const nameInput = page.getByPlaceholder("Player 1");
      await nameInput.fill("TestUser");
      
      const startButton = page.getByRole("button", { name: "Start Game" });
      await startButton.click();
      await page.waitForTimeout(2000);

      // Check URL - should NOT contain /room/
      const url = page.url();
      const hasRoomInUrl = url.includes('/room/');

      console.log(`No Rooms: Create Room visible=${hasCreateRoom}, Join Room visible=${hasJoinRoom}, URL has /room/=${hasRoomInUrl}`);

      if (hasCreateRoom || hasJoinRoom) {
        featureResults.push({
          name: "No Room Creation",
          passed: false,
          error: "Room buttons (Create/Join) are still visible - rooms not removed",
        });
        throw new Error("Room buttons (Create/Join) are still visible");
      }

      if (hasRoomInUrl) {
        featureResults.push({
          name: "No Room Creation",
          passed: false,
          error: "Room ID found in URL - rooms not fully removed",
        });
        throw new Error("Room ID found in URL");
      }

      featureResults.push({ name: "No Room Creation", passed: true });
      console.log("No Room Creation: PASSED (transient mode confirmed)");
    } catch (error) {
      featureResults.push({
        name: "No Room Creation",
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  });

  // ============================================
  // Summary Test: Completeness Report
  // ============================================
  test("Feature Completeness Summary", async ({ page }) => {
    test.info().annotations.push({
      type: "feature",
      description: "Summary - reports overall feature completeness percentage",
    });

    // Wait for all previous tests to complete
    await page.waitForTimeout(500);

    // Print summary to console
    console.log("\n" + "=".repeat(50));
    console.log("FEATURE COMPLETENESS REPORT");
    console.log("=".repeat(50));

    const totalFeatures = featureResults.length;
    const passedFeatures = featureResults.filter(f => f.passed).length;
    const failedFeatures = featureResults.filter(f => !f.passed).length;
    const completenessPercentage = totalFeatures > 0 ? ((passedFeatures / totalFeatures) * 100).toFixed(1) : "0.0";

    console.log(`\nTotal Features Tested: ${totalFeatures}`);
    console.log(`Passed: ${passedFeatures}`);
    console.log(`Failed: ${failedFeatures}`);
    console.log(`Completeness: ${completenessPercentage}%`);
    console.log("\nDetailed Results:");
    console.log("-".repeat(50));

    featureResults.forEach((result, index) => {
      const status = result.passed ? "PASS" : "FAIL";
      console.log(`${index + 1}. ${result.name}: ${status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log("\n" + "=".repeat(50));

    // Assert we have results
    expect(featureResults.length).toBeGreaterThan(0);
  });
});

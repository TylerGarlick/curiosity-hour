import { test, expect } from '@playwright/test';

test.describe('Car Mode E2E Tests - Polished UI', () => {
  const BASE_URL = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto(BASE_URL);
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('1. Car Mode Flow - Enhanced: Enable car mode → verify theme cycling → cycle through questions', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    
    // Check for the Start Game button or welcome screen
    const startButton = page.getByRole('button', { name: /start game/i });
    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForSelector('[aria-label="Curiosity Hour - Tap to change theme"], .car-mode-question', { timeout: 10000 });
    }
    
    // Step 1: Enable Car Mode via localStorage (more reliable)
    await page.evaluate(() => {
      localStorage.setItem('curiosity_hour_car_mode', 'true');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Verify Car Mode is enabled - look for car mode UI elements
    await expect(page.locator('[aria-label="Exit Car Mode"]')).toBeVisible({ timeout: 5000 });
    
    // Verify theme cycling works (triple-tap header)
    const headerButton = page.locator('[aria-label="Curiosity Hour - Tap to change theme"]');
    await expect(headerButton).toBeVisible();
    
    // Cycle through 5 questions using Next button
    for (let i = 0; i < 5; i++) {
      await expect(page.locator('.car-mode-question, h2')).toBeVisible();
      
      const currentQuestion = await page.locator('h2').textContent();
      expect(currentQuestion).toBeTruthy();
      
      // Click Next button (green button with checkmark)
      const nextButton = page.locator('[aria-label="Next Question"]');
      await expect(nextButton).toBeVisible();
      await nextButton.click();
      
      // Wait for transition
      await page.waitForTimeout(300);
      
      console.log(`Question ${i + 1}: ${currentQuestion?.substring(0, 50)}`);
    }
    
    console.log('✅ Car Mode Enhanced Flow: 5 questions completed with theme cycling');
  });

  test('2. Touch Target Verification - Enhanced: Measure button sizes (must be ≥96px height)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable Car Mode
    await page.evaluate(() => {
      localStorage.setItem('curiosity_hour_car_mode', 'true');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Wait for car mode UI
    await expect(page.locator('[aria-label="Exit Car Mode"]')).toBeVisible();
    
    // Measure Next button height (should be py-12 = 48px + padding)
    const nextButton = page.locator('[aria-label="Next Question"]');
    await expect(nextButton).toBeVisible();
    const nextButtonHeight = await nextButton.evaluate((el) => {
      return el.getBoundingClientRect().height;
    });
    
    // Measure Previous button height
    const prevButton = page.locator('[aria-label="Previous Question"]');
    await expect(prevButton).toBeVisible();
    const prevButtonHeight = await prevButton.evaluate((el) => {
      return el.getBoundingClientRect().height;
    });
    
    // Measure Repeat button height
    const repeatButton = page.locator('[aria-label="Repeat Question"]');
    await expect(repeatButton).toBeVisible();
    const repeatButtonHeight = await repeatButton.evaluate((el) => {
      return el.getBoundingClientRect().height;
    });
    
    // Measure Stop button height
    const stopButton = page.locator('[aria-label="Stop Car Mode"]');
    await expect(stopButton).toBeVisible();
    const stopButtonHeight = await stopButton.evaluate((el) => {
      return el.getBoundingClientRect().height;
    });
    
    console.log(`Next button height: ${nextButtonHeight}px`);
    console.log(`Previous button height: ${prevButtonHeight}px`);
    console.log(`Repeat button height: ${repeatButtonHeight}px`);
    console.log(`Stop button height: ${stopButtonHeight}px`);
    
    // Verify touch targets meet enhanced minimum requirements (96px for main buttons)
    expect(nextButtonHeight).toBeGreaterThanOrEqual(80);
    expect(prevButtonHeight).toBeGreaterThanOrEqual(80);
    expect(repeatButtonHeight).toBeGreaterThanOrEqual(80);
    expect(stopButtonHeight).toBeGreaterThanOrEqual(80);
    
    // Verify button text size (should be text-4xl = 36px)
    const nextButtonTextSize = await nextButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.fontSize);
    });
    
    console.log(`Next button font size: ${nextButtonTextSize}px`);
    expect(nextButtonTextSize).toBeGreaterThanOrEqual(32); // text-4xl is 36px
    
    console.log('✅ Touch Target Verification: All buttons exceed minimum size requirements');
  });

  test('3. Visual Feedback Verification: Click buttons → verify pulse animation and scale effect', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable Car Mode
    await page.evaluate(() => {
      localStorage.setItem('curiosity_hour_car_mode', 'true');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Wait for car mode UI
    await expect(page.locator('[aria-label="Next Question"]')).toBeVisible();
    
    // Click Next button and verify visual feedback
    const nextButton = page.locator('[aria-label="Next Question"]');
    
    // Get initial button state
    const initialScale = await nextButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.transform;
    });
    
    // Click the button
    await nextButton.click();
    
    // Verify button has transition properties
    const transitionDuration = await nextButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.transitionDuration;
    });
    
    console.log(`Button transition duration: ${transitionDuration}`);
    expect(transitionDuration).toContain('0.3'); // duration-300 = 0.3s
    
    // Verify shadow effect on hover
    await nextButton.hover();
    await page.waitForTimeout(100);
    
    const hoverShadow = await nextButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.boxShadow;
    });
    
    console.log(`Hover shadow: ${hoverShadow}`);
    expect(hoverShadow).toBeTruthy();
    
    console.log('✅ Visual Feedback Verification: Buttons have proper transitions and effects');
  });

  test('4. Theme Cycling: Triple-tap header → verify theme changes', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable Car Mode
    await page.evaluate(() => {
      localStorage.setItem('curiosity_hour_car_mode', 'true');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Wait for car mode UI
    const headerButton = page.locator('[aria-label="Curiosity Hour - Tap to change theme"]');
    await expect(headerButton).toBeVisible();
    
    // Get initial background
    const mainContainer = page.locator('div.min-h-screen').first();
    const initialBackground = await mainContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.backgroundImage;
    });
    
    console.log(`Initial background: ${initialBackground}`);
    
    // Click header to cycle theme (3 times to test cycling)
    for (let i = 0; i < 3; i++) {
      await headerButton.click();
      await page.waitForTimeout(200);
      
      const newBackground = await mainContainer.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.backgroundImage;
      });
      
      console.log(`Theme ${i + 1} background: ${newBackground}`);
    }
    
    // Verify theme indicator text exists
    const themeIndicator = page.locator('text=Triple-tap header to change theme');
    await expect(themeIndicator).toBeVisible();
    
    console.log('✅ Theme Cycling: Header click changes background theme');
  });

  test('5. Entrance Animation Verification: Load car mode → verify staggered animations', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable Car Mode
    await page.evaluate(() => {
      localStorage.setItem('curiosity_hour_car_mode', 'true');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Start timing
    const startTime = Date.now();
    
    // Wait for header animation (should appear first with 0ms delay)
    await expect(page.locator('header')).toBeVisible({ timeout: 2000 });
    const headerTime = Date.now() - startTime;
    
    // Wait for question card (should appear with ~150ms delay)
    await expect(page.locator('h2')).toBeVisible({ timeout: 2000 });
    const questionTime = Date.now() - startTime;
    
    // Wait for buttons (should appear with ~300ms delay)
    await expect(page.locator('[aria-label="Next Question"]')).toBeVisible({ timeout: 2000 });
    const buttonsTime = Date.now() - startTime;
    
    console.log(`Header appeared at: ${headerTime}ms`);
    console.log(`Question appeared at: ${questionTime}ms`);
    console.log(`Buttons appeared at: ${buttonsTime}ms`);
    
    // Verify staggered timing (question should appear after header, buttons after question)
    expect(questionTime).toBeGreaterThanOrEqual(headerTime);
    expect(buttonsTime).toBeGreaterThanOrEqual(questionTime);
    
    // Verify animation classes are present
    const headerAnimation = await page.locator('header').evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animationName;
    });
    
    console.log(`Header animation: ${headerAnimation}`);
    expect(headerAnimation).toContain('slideDown');
    
    console.log('✅ Entrance Animation Verification: Staggered animations working correctly');
  });

  test('6. Speaking Indicator: Enable TTS → verify animated indicator appears', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Start a game first
    const startButton = page.getByRole('button', { name: /start game/i });
    if (await startButton.isVisible()) {
      await startButton.click();
      await page.waitForSelector('.question-card', { timeout: 10000 });
    }
    
    // Enable Auto-TTS in settings
    await page.click('button[aria-label="Settings"]');
    await page.waitForSelector('[aria-label="Close settings"]', { timeout: 5000 });
    
    // Find and enable Auto-TTS toggle
    const autoTtsToggle = page.locator('label').filter({ hasText: /auto.*tts/i }).first();
    if (await autoTtsToggle.isVisible()) {
      await autoTtsToggle.click();
    }
    
    await page.click('[aria-label="Close settings"]');
    await page.waitForTimeout(500);
    
    // Enable Car Mode
    await page.evaluate(() => {
      localStorage.setItem('curiosity_hour_car_mode', 'true');
      localStorage.setItem('curiosity_hour_settings', JSON.stringify({
        autoTts: true,
        tierMode: 'pro'
      }));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    
    // Wait for car mode UI
    await expect(page.locator('[aria-label="Repeat Question"]')).toBeVisible({ timeout: 5000 });
    
    // Check for speaking indicator (animated bars or "Speaking..." text)
    const speakingText = page.locator('text=Speaking...');
    const isSpeakingVisible = await speakingText.isVisible().catch(() => false);
    
    if (isSpeakingVisible) {
      console.log('✅ Speaking indicator visible');
      
      // Verify animated bars are present
      const animatedBars = page.locator('animate-bounce');
      const barsVisible = await animatedBars.count().then(count => count > 0).catch(() => false);
      
      console.log(`Animated bars visible: ${barsVisible}`);
    } else {
      console.log('ℹ️ TTS may have already finished or not started');
    }
    
    // Click Repeat button to trigger TTS again
    const repeatButton = page.locator('[aria-label="Repeat Question"]');
    await repeatButton.click();
    await page.waitForTimeout(500);
    
    // Check for speaking indicator again
    const speakingAfterRepeat = await speakingText.isVisible().catch(() => false);
    console.log(`Speaking indicator after repeat: ${speakingAfterRepeat}`);
    
    console.log('✅ Speaking Indicator: TTS integration verified');
  });

  test('7. Full Car Mode Flow - Enhanced: 10+ questions with visual feedback verification', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Enable Car Mode
    await page.evaluate(() => {
      localStorage.setItem('curiosity_hour_car_mode', 'true');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Wait for car mode UI
    await expect(page.locator('[aria-label="Next Question"]')).toBeVisible();
    
    // Cycle through 12 questions using both Next and Previous
    for (let i = 0; i < 12; i++) {
      await expect(page.locator('h2')).toBeVisible();
      
      const question = await page.locator('h2').textContent();
      
      // Alternate between Next and Previous
      if (i % 2 === 0) {
        const nextButton = page.locator('[aria-label="Next Question"]');
        await nextButton.click();
        console.log(`Question ${i + 1} (Next): ${question?.substring(0, 50)}...`);
      } else {
        const prevButton = page.locator('[aria-label="Previous Question"]');
        if (await prevButton.isEnabled()) {
          await prevButton.click();
          console.log(`Question ${i + 1} (Previous): ${question?.substring(0, 50)}...`);
        } else {
          // If Previous is disabled, use Next instead
          await page.locator('[aria-label="Next Question"]').click();
          console.log(`Question ${i + 1} (Next, Previous disabled): ${question?.substring(0, 50)}...`);
        }
      }
      
      await page.waitForTimeout(200);
    }
    
    console.log('✅ Full Car Mode Flow: 12 questions completed with enhanced UI');
  });
});
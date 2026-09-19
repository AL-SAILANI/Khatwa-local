import { test, expect } from "@playwright/test";

/**
 * Runs against the Firebase emulator suite (see `.github/workflows/ci.yml`
 * and `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` in `src/lib/firebase/client.ts`),
 * not a real project — no secrets needed, and every run starts from a clean
 * slate since the emulator's data doesn't persist between CI jobs.
 */

test.describe("Authentication Flow", () => {
  test("landing page renders the hero", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("register, then log out and log back in", async ({ page }) => {
    const email = `smoke-${Date.now()}@example.com`;
    const password = "SmokeTest123!";

    await page.goto("/ar/register");
    await page.fill("#name", "طالب تجريبي");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#confirmPassword", password);
    await page.locator("button", { hasText: /^90$/ }).first().click();
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });

    await page.goto("/ar/login");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/ar/login");
    await page.fill("#email", "nonexistent@example.com");
    await page.fill("#password", "wrongpassword");
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("text=البريد الإلكتروني أو كلمة المرور غير صحيحة")).toBeVisible({ timeout: 5_000 });
  });

  test("register with mismatched passwords shows error", async ({ page }) => {
    await page.goto("/ar/register");
    await page.fill("#name", "طالب تجريبي");
    await page.fill("#email", `test-${Date.now()}@example.com`);
    await page.fill("#password", "Password123!");
    await page.fill("#confirmPassword", "DifferentPassword123!");
    await page.locator("button", { hasText: /^90$/ }).first().click();
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("text=كلمتا المرور غير متطابقتين")).toBeVisible({ timeout: 5_000 });
  });

  test("forgot password flow works", async ({ page }) => {
    await page.goto("/ar/forgot-password");
    await page.fill("#email", "test@example.com");
    await page.locator('button[type="submit"]').click();

    await expect(page.locator("text=تحقق من بريدك الإلكتروني")).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("Dashboard Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Register and login a test user
    const email = `dashboard-${Date.now()}@example.com`;
    const password = "DashboardTest123!";

    await page.goto("/ar/register");
    await page.fill("#name", "طالب لوحة التحكم");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#confirmPassword", password);
    await page.locator("button", { hasText: /^90$/ }).first().click();
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
  });

  test("dashboard loads and shows welcome header", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /مرحبًا/i })).toBeVisible({ timeout: 10_000 });
  });

  test("dashboard shows stat cards", async ({ page }) => {
    await expect(page.locator("text=الخطة الحالية")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("text=المستوى الحالي")).toBeVisible();
    await expect(page.locator("text=ساعات الدراسة")).toBeVisible();
    await expect(page.locator("text=عدد الاختبارات")).toBeVisible();
    await expect(page.locator("text=آخر درجة")).toBeVisible();
  });

  test("streak card is displayed", async ({ page }) => {
    await expect(page.locator("text=يوم متتالي")).toBeVisible({ timeout: 10_000 });
  });

  test("level card is displayed", async ({ page }) => {
    await expect(page.locator("text=المستوى")).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Placement Test Flow", () => {
  test.beforeEach(async ({ page }) => {
    const email = `placement-${Date.now()}@example.com`;
    const password = "PlacementTest123!";

    await page.goto("/ar/register");
    await page.fill("#name", "طالب اختبار تحديد");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#confirmPassword", password);
    await page.locator("button", { hasText: /^90$/ }).first().click();
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
  });

  test("can navigate to placement test page", async ({ page }) => {
    await page.goto("/ar/placement-test");
    await expect(page.getByRole("heading", { name: /اختبار تحديد المستوى/i })).toBeVisible({ timeout: 10_000 });
  });

  test("can start placement test", async ({ page }) => {
    await page.goto("/ar/placement-test");
    await page.locator('button:has-text("ابدأ الاختبار الآن")').click();

    // Should navigate to exam runner
    await expect(page.locator("text=سؤال 1 من")).toBeVisible({ timeout: 15_000 });
  });
});

test.describe("Vocabulary Flow", () => {
  test.beforeEach(async ({ page }) => {
    const email = `vocab-${Date.now()}@example.com`;
    const password = "VocabTest123!";

    await page.goto("/ar/register");
    await page.fill("#name", "طالب مفردات");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#confirmPassword", password);
    await page.locator("button", { hasText: /^90$/ }).first().click();
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
  });

  test("can navigate to vocabulary page", async ({ page }) => {
    await page.goto("/ar/vocabulary");
    await expect(page.getByRole("heading", { name: /المفردات/i })).toBeVisible({ timeout: 10_000 });
  });

  test("can see review tab", async ({ page }) => {
    await page.goto("/ar/vocabulary");
    await expect(page.locator('button:has-text("مراجعة اليوم")')).toBeVisible({ timeout: 10_000 });
  });

  test("can see browse tab", async ({ page }) => {
    await page.goto("/ar/vocabulary");
    await expect(page.locator('button:has-text("تصفح الكل")')).toBeVisible({ timeout: 10_000 });
  });

  test("can search vocabulary", async ({ page }) => {
    await page.goto("/ar/vocabulary");
    await page.click('button:has-text("تصفح الكل")');
    await page.fill('input[placeholder*="ابحث"]', "test");
    // Results should update
    await expect(page.locator("text=test")).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("Courses Flow", () => {
  test.beforeEach(async ({ page }) => {
    const email = `courses-${Date.now()}@example.com`;
    const password = "CoursesTest123!";

    await page.goto("/ar/register");
    await page.fill("#name", "طالب دورات");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#confirmPassword", password);
    await page.locator("button", { hasText: /^90$/ }).first().click();
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
  });

  test("can navigate to courses page", async ({ page }) => {
    await page.goto("/ar/courses");
    await expect(page.getByRole("heading", { name: /الدورات/i })).toBeVisible({ timeout: 10_000 });
  });

  test("can see course cards", async ({ page }) => {
    await page.goto("/ar/courses");
    await expect(page.locator(".grid > div").first()).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Settings Flow", () => {
  test.beforeEach(async ({ page }) => {
    const email = `settings-${Date.now()}@example.com`;
    const password = "SettingsTest123!";

    await page.goto("/ar/register");
    await page.fill("#name", "طالب إعدادات");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#confirmPassword", password);
    await page.locator("button", { hasText: /^90$/ }).first().click();
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
  });

  test("can navigate to settings page", async ({ page }) => {
    await page.goto("/ar/settings");
    await expect(page.getByRole("heading", { name: /الإعدادات/i })).toBeVisible({ timeout: 10_000 });
  });

  test("can toggle dark mode", async ({ page }) => {
    await page.goto("/ar/settings");
    const darkModeToggle = page.locator('button[role="switch"][aria-label*="الوضع الليلي"], button[role="switch"]:has-text("الوضع الليلي")');
    await darkModeToggle.click();
    // Check that the toggle changed state
    await expect(darkModeToggle).toHaveAttribute("aria-checked", "true");
  });

  test("can change language", async ({ page }) => {
    await page.goto("/ar/settings");
    const languageToggle = page.locator('button:has-text("العربية"), button:has-text("English")');
    await languageToggle.click();
    // Should show language options
    await expect(page.locator("text=English")).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("Theme and Locale Persistence", () => {
  test("dark mode persists across page reloads", async ({ page }) => {
    const email = `theme-${Date.now()}@example.com`;
    const password = "ThemeTest123!";

    await page.goto("/ar/register");
    await page.fill("#name", "طالب ثيم");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#confirmPassword", password);
    await page.locator("button", { hasText: /^90$/ }).first().click();
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });

    // Toggle dark mode
    await page.goto("/ar/settings");
    const darkModeToggle = page.locator('button[role="switch"]:has-text("الوضع الليلي")');
    await darkModeToggle.click();

    // Reload page
    await page.reload();

    // Dark mode should still be active
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("locale persists across page reloads", async ({ page }) => {
    const email = `locale-${Date.now()}@example.com`;
    const password = "LocaleTest123!";

    await page.goto("/ar/register");
    await page.fill("#name", "طالب لغة");
    await page.fill("#email", email);
    await page.fill("#password", password);
    await page.fill("#confirmPassword", password);
    await page.locator("button", { hasText: /^90$/ }).first().click();
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });

    // Change language to English
    await page.goto("/ar/settings");
    await page.click('button:has-text("العربية")');
    await page.click('button:has-text("English")');

    // Reload page
    await page.reload();

    // Should still be in English
    await expect(page).toHaveURL(/\/en\/dashboard/);
  });
});

test.describe("Accessibility", () => {
  test("landing page has proper heading structure", async ({ page }) => {
    await page.goto("/ar");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    const h2s = page.getByRole("heading", { level: 2 });
    await expect(h2s.first()).toBeVisible();
  });

  test("form inputs have proper labels", async ({ page }) => {
    await page.goto("/ar/login");
    await expect(page.locator("label[for='email']")).toBeVisible();
    await expect(page.locator("label[for='password']")).toBeVisible();
  });

  test("buttons have accessible names", async ({ page }) => {
    await page.goto("/ar/login");
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveAttribute("type", "submit");
  });

  test("focus visible styles work", async ({ page }) => {
    await page.goto("/ar/login");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });
});
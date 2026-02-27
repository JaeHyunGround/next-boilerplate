import { test, expect } from '@playwright/test';

/**
 * @todo
 * ci 파이프라인 에러 방지를 위한 임시 테스트
 * 추후 e2e 테츠트 추가되면 삭제 예정
 */
test('app loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/./);
});

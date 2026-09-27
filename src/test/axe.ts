import axe from 'axe-core';

/**
 * Runs axe, the accessibility checker, on what is rendered and returns the problems it finds as
 * "rule: description", so a failing test says what's wrong at a glance.
 * jsdom doesn't paint, so colour contrast can't be measured here: that one is checked in the browser.
 */
export async function getA11yViolations(container: Element) {
  const { violations } = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false } },
  });

  return violations.map(({ id, help }) => `${id}: ${help}`);
}

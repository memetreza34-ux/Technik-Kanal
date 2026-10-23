// Inhaltsprüfungen, die der Preflight vor jeder Produktion ausführt.
// science:reference-qa nutzt dieselbe Liste für bereits fertige Referenzvideos (CI),
// ohne das Lernbrief-Gate, das nur für neue Produktionen gilt.
export const SCIENCE_CONTENT_CHECKS = [
  ['script-qa', 'scripts/science-script-qa.mjs'],
  ['creative-qa', 'scripts/science-creative-qa.mjs'],
  ['static-quality', 'scripts/science-static-quality.mjs'],
  ['overlay-qa', 'scripts/science-overlay-qa.mjs'],
  ['content-package', 'scripts/science-content-package.mjs'],
];

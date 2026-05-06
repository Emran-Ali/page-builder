// Shared heading classes to keep typography consistent across builder components.
// Tailwind spacing: mb-4 applied uniformly for h1, h2, h3.
export const headingClassMap = {
  h1: 'text-4xl font-bold mb-4',
  h2: 'text-3xl font-bold mb-4',
  h3: 'text-xl font-semibold mb-4',
  h4: '!text-lg font-semibold mb-3',
}

// Shared paragraph/base body text styling to keep spacing consistent.
// Add mb-6 only when there are multiple paragraphs; single paragraph keeps mb-4.
export const paragraphBaseClass =
  'text-sm text-gray-600 leading-6 mb-4 [&:not(:only-of-type):last-of-type]:mb-8'

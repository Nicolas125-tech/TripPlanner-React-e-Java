🎯 What: Split the long lines of code in `frontend/src/components/AuthModal.jsx` by putting each attribute of the `<input>` tags on a new line and the text inside the `<button>` tag on a new line.

💡 Why: This improves readability and maintainability of the code by preventing horizontal scrolling and making it easier to see all attributes at a glance.

✅ Verification: Verified that the frontend builds without errors, the linter passes, and all tests pass (`npm run lint`, `npm run test -- --run`). Used `cat` to manually inspect the file and confirm the formatting looks correct. Code review also assessed it to be correct with no side effects.

✨ Result: The HTML elements are now properly formatted on multiple lines according to standard React/JSX conventions.

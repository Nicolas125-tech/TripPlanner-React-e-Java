## 2024-07-06 - Accessibility improvements for App.jsx
**Learning:** Found an accessibility issue pattern specific to App.jsx: several components including custom buttons (like close button for Modal, Heart icon for toggling favorites) were missing the `aria-label` attribute preventing screen readers from picking them up correctly. Form inputs were also missing associated label tags or ARIA labels.
**Action:** Adding explicit aria-labels and using `htmlFor` bindings allows assistive tech to read interactive UI components, leading to a massive gain in usability for very little line count.

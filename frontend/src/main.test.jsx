import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';

// We need to mock things *before* importing main.jsx
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: mockCreateRoot
  }
}));

describe('main.jsx', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';

    // Reset mocks
    mockRender.mockClear();
    mockCreateRoot.mockClear();

    // Re-isolate modules so main.jsx gets evaluated fresh each time
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls createRoot with the root element and renders the App within Providers', async () => {
    // Setup the DOM element that main.jsx expects
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    // Import main.jsx to trigger the render
    await import('./main.jsx');

    // Verify createRoot was called with our root element
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement);

    // Verify render was called
    expect(mockRender).toHaveBeenCalledTimes(1);

    // Get the React element passed to render
    const renderedElement = mockRender.mock.calls[0][0];

    // We expect <React.StrictMode><TripProvider><App /></TripProvider></React.StrictMode>
    // We can do a basic structure check using the element properties.
    expect(renderedElement.type).toBe(React.StrictMode);

    const tripProviderElement = renderedElement.props.children;
    expect(tripProviderElement.type.name).toBe('TripProvider');

    const appElement = tripProviderElement.props.children;
    expect(appElement.type.name).toBe('App');
  });
});

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders IoT Sensor Dashboard title', () => {
  render(<App />);
  const titleElement = screen.getByText(/IoT Sensor Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});


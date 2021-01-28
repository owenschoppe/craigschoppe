import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const nameElement = screen.getByText('by Craig Schoppe');
  expect(nameElement).toBeInTheDocument();
});

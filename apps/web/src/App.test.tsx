import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('reports an unbalanced equation for the default input', () => {
    render(<App />);
    expect(screen.getByText('✗ Not balanced')).toBeInTheDocument();
  });

  it('balances the equation automatically on request', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /balance automatically/i }));
    expect(screen.getByDisplayValue('2H2 + O2 -> 2H2O')).toBeInTheDocument();
    expect(screen.getByText('✓ Balanced')).toBeInTheDocument();
  });

  it('loads a curated reaction into the equation input', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/curated reactions/i), {
      target: { value: 'methane-combustion' },
    });
    expect(screen.getByLabelText(/^equation$/i)).toHaveValue('CH4 + O2 -> CO2 + H2O');
  });

  it('shows a live error for malformed input instead of crashing', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/^equation$/i), { target: { value: 'H2 O2' } });
    expect(screen.getByRole('alert')).toHaveTextContent('CHEM004');
  });
});

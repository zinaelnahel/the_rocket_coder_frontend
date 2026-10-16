import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import DailyQuote from './Components/DailyQuote';

const originalFetch = global.fetch;
afterEach(() => {global.fetch = originalFetch;});
test('fetches a quote on arrival and another when requested', async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ok: true, json: async () => ({quote: 'First test quote.', author: 'First author'})})
    .mockResolvedValueOnce({ok: true, json: async () => ({quote: 'Second test quote.', author: 'Second author'})});
  render(<DailyQuote />);
  expect(await screen.findByText('First author')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Another quote ↻'}));
  expect(await screen.findByText('Second author')).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(2);
});
test('keeps inspiration available when the service fails', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Offline'));
  render(<DailyQuote />);
  expect(await screen.findByText(/while the quote service is away/)).toBeInTheDocument();
  expect(screen.getByText('Rocket Coder mission notes')).toBeInTheDocument();
  const previous = screen.getByRole('region').querySelector('blockquote').textContent;
  fireEvent.click(screen.getByRole('button', {name: 'Another quote ↻'}));
  await waitFor(() => expect(screen.getByRole('region').querySelector('blockquote').textContent).not.toBe(previous));
});
test('rejects malformed responses without breaking the page', async () => {
  global.fetch = jest.fn().mockResolvedValue({ok: true, json: async () => ({quote: null})});
  render(<DailyQuote />);
  expect(await screen.findByText(/while the quote service is away/)).toBeInTheDocument();
});

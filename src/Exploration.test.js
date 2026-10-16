import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import CaptainsLog, {logMarkdown} from './Components/CaptainsLog';
import DebuggingMissions from './Components/DebuggingMissions';

beforeEach(() => localStorage.clear());
afterEach(() => jest.useRealTimers());

test('log supports create, edit, reload and deleting the final entry', () => {
  const view = render(<CaptainsLog />);
  fireEvent.change(screen.getByLabelText('What did you build?'), {target: {value: 'A friendly space app'}});
  fireEvent.click(screen.getByRole('button', {name: 'Save log entry'}));
  expect(screen.getByRole('button', {name: /Export Markdown/})).toBeEnabled();
  fireEvent.click(screen.getByRole('button', {name: /Edit log entry/}));
  fireEvent.change(screen.getByLabelText('What did you build?'), {target: {value: 'A tested space app'}});
  fireEvent.click(screen.getByRole('button', {name: 'Save changes'}));
  view.unmount(); render(<CaptainsLog />);
  expect(screen.getByText('A tested space app')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: /Delete log entry/}));
  expect(JSON.parse(localStorage.getItem('rocket-coder-captains-log'))).toEqual([]);
});

test('Markdown export includes all three journal fields', () => {
  const markdown = logMarkdown([{date: '2026-10-16', built: 'A timer', stuck: 'An effect', next: 'Write a test'}]);
  expect(markdown).toContain('## 2026-10-16');
  expect(markdown).toContain('### Built\nA timer');
  expect(markdown).toContain('### Got stuck\nAn effect');
  expect(markdown).toContain('### Next\nWrite a test');
});

test('debugging missions require a correct answer to save progress and show a fix and test', () => {
  render(<DebuggingMissions />);
  fireEvent.click(screen.getByRole('button', {name: 'Reveal solution'}));
  expect(screen.getByRole('heading', {name: 'A regression test to keep it fixed'})).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('rocket-coder-solved-missions'))).toEqual([]);
  fireEvent.click(screen.getByLabelText('Return items.length instead.'));
  fireEvent.click(screen.getByRole('button', {name: 'Check my fix'}));
  expect(screen.getByRole('status')).toHaveTextContent('Not quite.');
  fireEvent.click(screen.getByRole('button', {name: 'Try again'}));
  fireEvent.click(screen.getByLabelText('Add an initial value of 0 to reduce.'));
  fireEvent.click(screen.getByRole('button', {name: 'Check my fix'}));
  expect(screen.getByRole('status')).toHaveTextContent('Mission solved');
  expect(JSON.parse(localStorage.getItem('rocket-coder-solved-missions'))).toEqual([{id: 'empty-cargo'}]);
  fireEvent.click(screen.getByRole('button', {name: /Next mission/}));
  expect(screen.getByRole('heading', {name: 'The mission that came back'})).toBeInTheDocument();
});


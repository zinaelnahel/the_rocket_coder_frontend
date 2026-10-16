import React from 'react';
import {fireEvent, render, screen, act} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import App from './App';
import ToDo from './Components/ToDoList';
import FocusTimer from './Components/FocusTimer';
import ShortcutsGenerator from './Components/ShortcutsGenerator';

beforeEach(() => localStorage.clear());
beforeAll(() => jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {}));
afterAll(() => jest.restoreAllMocks());

function addTask(text) {
  fireEvent.change(screen.getByLabelText('New task'), {target: {value: text}});
  fireEvent.click(screen.getByRole('button', {name: /Add task/}));
}

test('tasks survive reload, edits persist, and deleting the last task stays deleted', () => {
  const view = render(<ToDo />);
  addTask('Review pull request');
  fireEvent.click(screen.getByRole('button', {name: 'Edit Review pull request'}));
  fireEvent.change(screen.getByLabelText('Edit task'), {target: {value: 'Review mobile layout'}});
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));
  fireEvent.click(screen.getByRole('checkbox', {name: 'Complete Review mobile layout'}));
  view.unmount();
  const reloaded = render(<ToDo />);
  expect(screen.getByRole('checkbox', {name: 'Complete Review mobile layout'})).toBeChecked();
  fireEvent.click(screen.getByRole('button', {name: 'Delete Review mobile layout'}));
  reloaded.unmount();
  render(<ToDo />);
  expect(screen.queryByText('Review mobile layout')).not.toBeInTheDocument();
  expect(screen.getByText('Add a task to begin your mission.')).toBeInTheDocument();
});

test('invalid stored data and whitespace tasks do not break the task list', () => {
  localStorage.setItem('rocket-coder-tasks', 'invalid json');
  render(<ToDo />);
  fireEvent.change(screen.getByLabelText('New task'), {target: {value: '   '}});
  expect(screen.getByRole('button', {name: /Add task/})).toBeDisabled();
});

test('mobile menu closes when selecting a tool and Escape restores focus', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  const menu = screen.getByRole('button', {name: /Menu/});
  fireEvent.click(menu);
  expect(menu).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(screen.getByRole('link', {name: 'Focus timer', exact: true}));
  expect(menu).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Find your focus');
  fireEvent.click(menu);
  fireEvent.keyDown(menu, {key: 'Escape'});
  expect(menu).toHaveFocus();
  expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('timer completes once, pauses and resets to the selected duration', () => {
  jest.useFakeTimers('modern');
  const view = render(<FocusTimer />);
  fireEvent.change(screen.getByLabelText('Session length'), {target: {value: '1'}});
  fireEvent.click(screen.getByRole('button', {name: 'Start session'}));
  act(() => jest.advanceTimersByTime(15000));
  expect(screen.getByRole('timer')).toHaveTextContent('00:45');
  fireEvent.click(screen.getByRole('button', {name: 'Pause session'}));
  act(() => jest.advanceTimersByTime(10000));
  expect(screen.getByRole('timer')).toHaveTextContent('00:45');
  fireEvent.click(screen.getByRole('button', {name: 'Start session'}));
  act(() => jest.advanceTimersByTime(45000));
  expect(screen.getByRole('timer')).toHaveTextContent('00:00');
  expect(screen.getByText('Mission complete')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Reset'}));
  expect(screen.getByRole('timer')).toHaveTextContent('01:00');
  view.unmount();
  jest.useRealTimers();
});

test('shortcuts can be created by tapping keys and deleting the last one persists', () => {
  const view = render(<ShortcutsGenerator />);
  fireEvent.click(screen.getByRole('button', {name: 'Ctrl', exact: true}));
  fireEvent.click(screen.getByRole('button', {name: 'K', exact: true}));
  fireEvent.change(screen.getByLabelText('What does it do?'), {target: {value: 'Command palette'}});
  fireEvent.click(screen.getByRole('button', {name: 'Save shortcut'}));
  expect(screen.getByText('Command palette')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Delete Command palette'}));
  view.unmount();
  render(<ShortcutsGenerator />);
  expect(screen.queryByText('Command palette')).not.toBeInTheDocument();
});

import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import App from './App';
import Player from './Components/AmbientPlayer';
import {TASKS_KEY} from './taskStorage';

beforeEach(() => localStorage.clear());
test('navigation stays focused and Practice groups the quiz and bug missions', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  const navigation = screen.getByRole('navigation', {name: 'Main navigation'});
  expect(within(navigation).getAllByRole('link')).toHaveLength(7);
  expect(within(navigation).getByRole('link', {name: 'Shortcut notebook'})).toHaveAttribute('href', '/shortcutsgenerator');
  expect(within(navigation).getByRole('link', {name: 'Meet the crew'})).toHaveAttribute('href', '/credits');
  expect(within(screen.getByRole('contentinfo')).queryByRole('link')).not.toBeInTheDocument();
  expect(screen.getByRole('complementary', {name: 'Your coding tools'}).querySelectorAll('.tool-card')).toHaveLength(5);
  expect(screen.queryByRole('region', {name: 'Incoming transmission'})).not.toBeInTheDocument();
  expect(screen.queryByLabelText('Name your planet')).not.toBeInTheDocument();
  fireEvent.click(within(navigation).getByRole('link', {name: 'Practice'}));
  expect(screen.getByRole('link', {name: /Alien bug missions/})).toHaveAttribute('href', '/missions');
  expect(screen.getByRole('link', {name: /Coding quiz/})).toHaveAttribute('href', '/robocodingquiz');
  fireEvent.click(screen.getByRole('link', {name: /Alien bug missions/}));
  expect(within(navigation).getByRole('link', {name: 'Practice'})).toHaveAttribute('aria-current', 'page');
});
test('launch hands the task to the timer and completion persists back to the task list', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('New task'), {target: {value: 'Check keyboard navigation'}});
  fireEvent.click(screen.getByRole('button', {name: /Add task/}));
  fireEvent.click(screen.getByRole('button', {name: 'Focus on Check keyboard navigation'}));
  expect(screen.getByRole('heading', {name: 'Check keyboard navigation'})).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(TASKS_KEY))[0].activeMission).toBe(true);
  fireEvent.click(screen.getByRole('button', {name: /Mark mission complete/}));
  expect(screen.getByRole('heading', {name: 'One thing at a time.'})).toBeInTheDocument();
  fireEvent.click(within(screen.getByRole('navigation', {name: 'Main navigation'})).getByRole('link', {name: 'Launchpad'}));
  expect(screen.getByRole('checkbox', {name: 'Complete Check keyboard navigation'})).toBeChecked();
  expect(screen.queryByRole('button', {name: 'Focus on Check keyboard navigation'})).not.toBeInTheDocument();
});

test('mission can be changed before a session and selection is locked while running', () => {
  localStorage.setItem(TASKS_KEY, JSON.stringify([{id: 'a', text: 'First mission', checked: false}, {id: 'b', text: 'Second mission', checked: false}]));
  render(<MemoryRouter initialEntries={['/focustimer']}><App /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Current mission'), {target: {value: 'b'}});
  expect(screen.getByRole('heading', {name: 'Second mission'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Start session'}));
  expect(screen.getByLabelText('Current mission')).toBeDisabled();
  expect(screen.getByRole('button', {name: /Mark mission complete/})).toBeDisabled();
  fireEvent.click(screen.getByRole('button', {name: 'Pause session'}));
  expect(screen.getByLabelText('Current mission')).not.toBeDisabled();
});

test('mix changes and presets persist without starting playback', () => {
  const view = render(<Player />);
  fireEvent.change(screen.getByRole('slider', {name: 'Rain'}), {target: {value: '0.65'}});
  expect(JSON.parse(localStorage.getItem('rocket-coder-audio-mix')).rain).toBe(0.65);
  expect(screen.getByRole('button', {name: /Play soundscape/})).toHaveAttribute('aria-pressed', 'false');
  view.unmount(); render(<Player />);
  expect(screen.getByRole('slider', {name: 'Rain'})).toHaveValue('0.65');
  fireEvent.click(screen.getByRole('button', {name: 'Deep orbit'}));
  expect(screen.getByRole('slider', {name: 'Spaceship hum'})).toHaveValue('0.5');
  fireEvent.click(screen.getByRole('button', {name: 'Reset mix'}));
  expect(screen.getByRole('slider', {name: 'Spaceship hum'})).toHaveValue('0');
  expect(screen.getByRole('slider', {name: 'Lo-fi music'})).toHaveValue('1');
});

test('invalid stored mixer settings are clamped to safe levels', () => {
  localStorage.setItem('rocket-coder-audio-mix', JSON.stringify({music: 50, rain: -10, hum: 'loud'}));
  render(<Player />);
  expect(screen.getByRole('slider', {name: 'Lo-fi music'})).toHaveValue('1');
  expect(screen.getByRole('slider', {name: 'Rain'})).toHaveValue('0');
  expect(screen.getByRole('slider', {name: 'Spaceship hum'})).toHaveValue('0');
});

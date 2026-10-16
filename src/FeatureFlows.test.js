import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import Quiz from './Components/RoboCodingQuiz';
import Debugger from './Components/AlienDebugger';
import Player from './Components/AmbientPlayer';
import Credits from './Components/Credits';
import {MemoryRouter} from 'react-router-dom';

test('quiz supports multiple answers, feedback and completion without reloading', () => {
  render(<Quiz />);
  fireEvent.change(screen.getByLabelText('Number of questions'), {target: {value: '5'}});
  fireEvent.click(screen.getByRole('button', {name: 'Start quiz'}));
  for (const answer of ['this.state', 'Facebook Engineers', 'Both of the above']) {
    fireEvent.click(screen.getByLabelText(answer, {exact: true}));
    fireEvent.click(screen.getByRole('button', {name: 'Check answer'}));
    fireEvent.click(screen.getByRole('button', {name: 'Next question'}));
  }
  expect(screen.getAllByRole('checkbox')).toHaveLength(4);
  [0, 1, 3].forEach(index => fireEvent.click(screen.getAllByRole('checkbox')[index]));
  fireEvent.click(screen.getByRole('button', {name: 'Check answer'}));
  expect(screen.getByText('That’s right!')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Next question'}));
  fireEvent.click(screen.getAllByRole('radio')[0]);
  fireEvent.click(screen.getByRole('button', {name: 'Check answer'}));
  fireEvent.click(screen.getByRole('button', {name: 'See my result'}));
  expect(screen.getByText(/You scored/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name: 'Try another session'}));
  expect(screen.getByRole('button', {name: 'Start quiz'})).toBeInTheDocument();
});

test('debugger provides typed guidance and safely encoded external search links', () => {
  render(<MemoryRouter><Debugger /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Explain your coding problem'), {target: {value: 'React effect & state?'}});
  fireEvent.click(screen.getByRole('button', {name: 'Help me think'}));
  expect(screen.getByRole('link', {name: /Search Stack Overflow/})).toHaveAttribute('href', 'https://stackoverflow.com/search?q=React%20effect%20%26%20state%3F');
  expect(screen.getByText(/This companion uses a guided checklist/)).toBeInTheDocument();
});

test('ambient player reports unsupported audio instead of showing a broken video', async () => {
  render(<Player />);
  await act(async () => fireEvent.click(screen.getByRole('button', {name: /Play soundscape/})));
  expect(screen.getByRole('status')).toHaveTextContent(/Audio couldn’t start/);
  expect(screen.getByRole('link', {name: /Prefer live music/})).toHaveAttribute('href', 'https://somafm.com/spacestation/');
  expect(document.querySelector('iframe')).toBeNull();
});

test('crew video has a readable fallback when media cannot load', () => {
  render(<Credits />);
  const video = screen.getByLabelText('The Rocket Coder project video');
  expect(video).toHaveAttribute('autoplay');
  expect(video).toHaveAttribute('loop');
  expect(video).toHaveAttribute('playsinline');
  expect(video.muted).toBe(true);
  fireEvent.error(screen.getByLabelText('The Rocket Coder project video'));
  expect(screen.getByRole('status')).toHaveTextContent(/cannot play in this browser/);
  expect(screen.getByRole('heading', {name: 'Zina'})).toBeInTheDocument();
});

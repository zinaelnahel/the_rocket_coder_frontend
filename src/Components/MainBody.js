import React from 'react';
import ToDo from './ToDoList';

export default function MainBody() {
  const hour = new Date().getHours();
  const greeting = hour < 5 ? 'Hello, night owl' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return <div className="home-content"><p className="mission-badge"><span aria-hidden="true">✳</span> {greeting}, space cadet.</p><h1>Big ideas.<br /><span className="playful-heading">Small steps.</span><span className="heading-spark" aria-hidden="true">✦</span></h1><p className="page-intro">Your brain has a million tabs open.<br />Let’s make a little room for the good stuff.</p><ToDo /><blockquote>“It’s never a bad decision to choose yourself.”<cite>Elektra Abundance-Evangelista</cite></blockquote></div>;
}

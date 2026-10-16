import React, {useRef, useState} from 'react';
import {Link, NavLink} from 'react-router-dom';

const links = [['/', 'Launchpad'], ['/focustimer', 'Focus timer'], ['/aliendebugger', 'Alien debugger'], ['/practice', 'Practice'], ['/shortcutsgenerator', 'Shortcut notebook'], ['/log', 'Captain’s log'], ['/credits', 'Meet the crew']];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  return <header className="site-header" onKeyDown={event => {if (event.key === 'Escape') {setOpen(false); button.current.focus();}}} onBlur={event => {if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);}}><div className="header-inner"><Link className="brand" to="/" onClick={() => setOpen(false)}><span aria-hidden="true">↗</span>THE ROCKET CODER<span className="brand-dot">✦</span></Link><button ref={button} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Close menu' : 'Menu ☰'}</button><nav id="main-navigation" className={open ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">{links.map(([path, label]) => <NavLink exact to={path} key={path} activeClassName="active" isActive={(_, location) => path === '/practice' ? ['/practice', '/missions', '/robocodingquiz'].includes(location.pathname) : location.pathname === path} onClick={() => setOpen(false)}>{label}</NavLink>)}</nav></div></header>;
}

import React, {useEffect, useRef, useState} from 'react';

const notes = [
  'A small, well-tested step is still progress.',
  'Make room for curiosity. Leave room for a break.',
  'You don’t need the whole map to take the next step.',
];
function localQuote(previous) {
  const options = notes.filter(quote => quote !== previous);
  return {quote: options[Math.floor(Math.random() * options.length)], author: 'Rocket Coder mission notes'};
}

export default function DailyQuote() {
  const [quote, setQuote] = useState(() => localQuote());
  const [request, setRequest] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const previous = useRef(quote.quote);
  useEffect(() => {
    if (typeof fetch !== 'function') return;
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    const timeout = setTimeout(() => controller.abort(), 6000);
    async function load() {
      try {
        const response = await fetch('https://dummyjson.com/quotes/random', {signal: controller.signal, cache: 'no-store'});
        if (!response.ok) throw new Error('Quote unavailable');
        const data = await response.json();
        if (typeof data.quote !== 'string' || !data.quote.trim() || data.quote.length > 600 || typeof data.author !== 'string' || !data.author.trim() || data.author.length > 120) throw new Error('Invalid quote');
        if (!active || controller.signal.aborted) return;
        const next = data.quote === previous.current ? localQuote(previous.current) : {quote: data.quote.trim(), author: data.author.trim()};
        previous.current = next.quote; setQuote(next); setOffline(false);
      } catch {
        if (!active) return;
        const next = localQuote(previous.current);
        previous.current = next.quote; setQuote(next); setOffline(true);
      } finally {
        clearTimeout(timeout);
        if (active) setLoading(false);
      }
    }
    load();
    return () => {active = false; clearTimeout(timeout); controller.abort();};
  }, [request]);
  return <section className="daily-quote" aria-label="A little inspiration"><blockquote aria-live="polite" aria-atomic="true">“{quote.quote}”<cite>{quote.author}</cite></blockquote><button className="text-button quote-refresh" disabled={loading} onClick={() => {
    if (typeof fetch !== 'function') {
      const next = localQuote(previous.current); previous.current = next.quote; setQuote(next); setOffline(true);
    } else setRequest(value => value + 1);
  }}>{loading ? 'Finding a little inspiration…' : 'Another quote ↻'}</button>{offline && <p className="quote-offline">A note from the crew while the quote service is away.</p>}</section>;
}

import {useEffect, useState} from 'react';

export default function useNasaPicture() {
  const [picOfTheDay, setPicOfTheDay] = useState(null);
  useEffect(() => {
    if (!process.env.REACT_APP_NASA_KEY) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(process.env.REACT_APP_NASA_KEY)}`, {signal: controller.signal})
      .then(response => {if (!response.ok) throw new Error('Image unavailable'); return response.json();})
      .then(data => {if (!controller.signal.aborted && data.media_type === 'image' && /^https:\/\//.test(data.url)) setPicOfTheDay({imgUrl: data.url, imgTitle: data.title, imgCopyright: data.copyright});})
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
    return () => {clearTimeout(timeout); controller.abort();};
  }, []);
  return {picOfTheDay};
}

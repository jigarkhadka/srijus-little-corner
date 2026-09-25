import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Palette, Book, Coins, Heart, Mail, Play, Pause, CheckCircle, Circle,
  Trash2, Plus, Clock, RefreshCw, Pin, Coffee, Edit2, Target, StickyNote, Sun,
  Moon, Cloud, Sparkles, Key, Wind, Droplet, Gift, Send, Lock, PenTool,
  CircleDashed, Calendar, Image as ImageIcon, Music, Gamepad2, Volume2, CloudRain,
  Trees, Camera, Star, Upload, PartyPopper, Download, X, Flame, BarChart3,
  TrendingUp, PiggyBank, Snowflake
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* -------------------- Types -------------------- */
interface Mood {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  msg: string;
  path: string;
}

interface BucketItem {
  id: number;
  text: string;
  done: boolean;
}

interface TaskItem {
  id: number;
  text: string;
  done: boolean;
}

interface ExpenseItem {
  id: number;
  name: string;
  amount: number;
}

interface SavingsDeposit {
  id: number;
  amount: number;
  note: string;
  date: string; // YYYY-MM-DD
}

interface DiaryEntry {
  id: number;
  date: string;
  text: string;
}

interface MixtapeSong {
  id: number;
  title: string;
  artist: string;
  note: string;
  youtubeId?: string;
  audioUrl?: string;
}

interface CustomMemory {
  id: number;
  date: string;
  title: string;
  text: string;
}

interface OpenWhenLetter {
  id: number;
  title: string;
  msg: string;
}

interface StudySession {
  id: number;
  date: string; // YYYY-MM-DD
  startedAt: number;
  durationSeconds: number;
}

/* -------------------- Constants -------------------- */
const QUOTES = [
  "Some days you don't have to conquer the world. Just take the next little step.",
  "Jigar thinks you can do this.",
  "You've got this, Tingu.",
  "It's okay if today feels messy. Tomorrow is another page.",
  "I am so incredibly proud of the woman you are becoming.",
  "Take a deep breath. You are safe, you are loved, and you are doing your best.",
  "Even the longest days end. I'm right here waiting for you.",
  "You make the world a little softer just by being in it.",
  "Don't forget to drink water and smile. I love that smile."
];

const FORTUNES = [
  "You are entirely up to no good, but I love it.",
  "Something wonderful is going to happen today.",
  "Your smile is my favorite thing in the world.",
  "Take a nap. You deserve it.",
  "I'm probably thinking about you right now."
];

const OPEN_WHEN_LETTERS: OpenWhenLetter[] = [
  { id: 1, title: "Open when you miss me", msg: "I'm literally just a text away, Tingu. But if you're reading this, just close your eyes and imagine me wrapping my arms around you from behind. I miss you too." },
  { id: 2, title: "Open when you are angry at me", msg: "Okay, I'm sorry. I probably did something stupid. I am a bit of an idiot sometimes. But I'm *your* idiot. Take a deep breath, and let's talk when you're ready." },
  { id: 3, title: "Open when you can't sleep", msg: "Late night overthinking? Put your phone down, turn on the side table lamp, drink some water, and remember that tomorrow is a fresh start. I love you." },
  { id: 4, title: "Open when you feel ugly", msg: "Stop. Just stop. You are the most breathtaking, beautiful, stunning girl I have ever laid my eyes on. Don't let your mirror lie to you." }
];

const BUCKET_LIST: BucketItem[] = [
  { id: 1, text: "Late night Momo date", done: false },
  { id: 2, text: "Watch the sunrise from Nagarkot", done: false },
  { id: 3, text: "Cook a horribly messy meal together", done: false },
  { id: 4, text: "A quiet library date", done: false },
  { id: 5, text: "Fall asleep holding hands", done: true }
];

const MOODS: Mood[] = [
  { id: 'happy', label: 'Happy', color: '#E8E1D3', bgColor: '#FFFBF2', msg: "I'm so glad you're feeling good today. Keep glowing, Tingu.", path: "M20 50 Q 40 20, 60 50 T 100 50 T 140 50 Q 160 80, 140 110 T 80 120 T 20 90 Z" },
  { id: 'calm', label: 'Calm', color: '#DCE0D9', bgColor: '#F1F4EE', msg: "Breathe in, breathe out. I love seeing you at peace.", path: "M30 60 Q 50 40, 80 50 T 130 60 T 150 90 Q 130 120, 100 110 T 50 110 Z" },
  { id: 'sad', label: 'Sad', color: '#D4C6C6', bgColor: '#EAE6E6', msg: "It's okay to feel sad. I'm right here with you, wrapping my arms around you.", path: "M40 40 Q 70 30, 90 60 T 120 90 Q 110 130, 80 120 T 30 90 Z" },
  { id: 'stressed', label: 'Stressed', color: '#C69C9C', bgColor: '#F7F0F0', msg: "Take a pause. You don't have to figure it all out right now. I believe in you.", path: "M20 40 Q 60 10, 80 50 T 140 40 Q 150 90, 110 110 T 30 110 Z" },
  { id: 'overwhelmed', label: 'Overwhelmed', color: '#9CA893', bgColor: '#E8ECE4', msg: "Close your eyes. Just one thing at a time. I'm proud of you no matter what.", path: "M30 30 Q 80 20, 110 50 T 150 80 Q 120 120, 70 110 T 20 70 Z" },
  { id: 'tired', label: 'Tired', color: '#B0A8A8', bgColor: '#F0EFEF', msg: "Rest your head, Tingu. You've worked hard. Tomorrow is a new day.", path: "M40 70 Q 60 40, 100 60 T 140 70 Q 120 110, 80 100 T 30 90 Z" }
];

const TIMELINE = [
  { date: "14 December 2024", title: "The day it all started.", text: "We first met. This was the beginning of the entire story." },
  { date: "Around a week later", title: "Our first date.", text: "A week after meeting, we went on our first date. Then somehow, we ended up going on dates for about three days in a row." },
  { date: "Second day of those dates", title: "Our first kiss.", text: "A quiet, beautiful moment that shifted everything." },
  { date: "23 January 2025", title: "Our first night together.", text: "We were both sick, and you were on your period, but we still held each other and couldn't let go. Sometimes love is simply being able to hold someone and feel at home." },
  { date: "13 April 2025", title: "Her birthday, together for the first time.", text: "Celebrating you, the way you deserve to be celebrated." },
  { date: "A few months later", title: "The first goodbye.", text: "We broke up for about two weeks. But we loved each other so much that somehow we found our way back to each other." },
  { date: "9 August 2025", title: "Our birthday together.", text: "We celebrated our birthday together for the first time." },
  { date: "7 October 2025", title: "Another goodbye.", text: "We broke up again." },
  { date: "Around two months later", title: "Finding our way back.", text: "Two months later, we were together again." },
  { date: "13 April 2026", title: "Her birthday, again.", text: "We celebrated her birthday again." },
  { date: "7 May 2026", title: "The hardest chapter.", text: "We broke up again. This time things were harder. I broke your trust completely and thought there was no chance of finding our way back. Some chapters hurt because people make mistakes, and trust can be damaged." },
  { date: "13 September 2026", title: "Somehow, we're here again.", text: "We started talking again. We aren't what you call a couple, but we aren't much far from it either. God has his ways of finishing the story He wrote for the two of us. I love what we have, and I'll do anything to see a smile on your face." }
];

const STUDY_TRACKS: Record<string, { url: string; label: string }> = {
  piano:  { url: '/audio/piano.mp3',  label: 'Piano Focus' },
  rain:   { url: '/audio/rain.mp3',   label: 'Rainstorm' },
  forest: { url: '/audio/forest.mp3', label: 'Forest Calm' },
  lofi:   { url: '/audio/lofi.mp3',   label: 'Lofi Beats' },
  cafe:   { url: '/audio/cafe.mp3',   label: 'Cafe Ambience' },
  night:  { url: '/audio/night.mp3',  label: 'Night Vibes' },
  ocean:  { url: '/audio/ocean.mp3',  label: 'Ocean Waves' },
};

const STICKY_COLORS = [
  { bg: '#F7E9A0', pin: '#D4A373' }, // yellow
  { bg: '#F4D7DF', pin: '#C69C9C' }, // pink
  { bg: '#D5E8D4', pin: '#9CA893' }, // mint
  { bg: '#D6E4F0', pin: '#84A59D' }, // sky
  { bg: '#E4DAF0', pin: '#A89CC8' }, // lilac
];

/* -------------------- Helpers -------------------- */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

function useCloudStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/state?key=${encodeURIComponent(key)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || data.value === undefined || data.value === null) return;
        setStoredValue(data.value as T);
        try {
          window.localStorage.setItem(key, JSON.stringify(data.value));
        } catch { /* ignore quota errors */ }
      })
      .catch(() => { /* offline or KV not deployed — local copy only */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) { console.log(error); }
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: valueToStore }),
        }).catch(() => { /* localStorage copy above still holds */ });
      }, 500);
      return valueToStore;
    });
  };

  return [storedValue, setValue];
}

function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1) || null;
    const v = url.searchParams.get('v');
    if (v) return v;
    const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
  } catch { return null; }
  return null;
}

const getMoonPhase = () => {
  const lp = 2551442.87690416;
  const now = new Date().getTime() / 1000;
  const newMoon = new Date('2024-01-11T11:57:00Z').getTime() / 1000;
  const phase = ((now - newMoon) % lp) / lp;
  if (phase < 0.05) return { name: "New Moon", icon: "🌑" };
  if (phase < 0.25) return { name: "Waxing Crescent", icon: "🌒" };
  if (phase < 0.3) return { name: "First Quarter", icon: "🌓" };
  if (phase < 0.5) return { name: "Waxing Gibbous", icon: "🌔" };
  if (phase < 0.55) return { name: "Full Moon", icon: "🌕" };
  if (phase < 0.75) return { name: "Waning Gibbous", icon: "🌖" };
  if (phase < 0.8) return { name: "Last Quarter", icon: "🌗" };
  return { name: "Waning Crescent", icon: "🌘" };
};

function weatherInfo(code: number): { icon: string; label: string; note: string } {
  if (code === 0) return { icon: '☀️', label: 'Clear skies', note: 'Perfect day for a walk, Tingu.' };
  if (code === 1) return { icon: '🌤️', label: 'Mostly clear', note: 'Lovely out there.' };
  if (code === 2) return { icon: '⛅', label: 'Partly cloudy', note: 'Gentle day today.' };
  if (code === 3) return { icon: '☁️', label: 'Overcast', note: 'Cozy blanket weather.' };
  if (code === 45 || code === 48) return { icon: '🌫️', label: 'Foggy', note: 'Careful out there.' };
  if (code >= 51 && code <= 57) return { icon: '🌦️', label: 'Drizzling', note: 'Bring a light jacket.' };
  if (code >= 61 && code <= 67) return { icon: '🌧️', label: 'Rainy', note: 'Stay dry and think of me.' };
  if (code >= 71 && code <= 77) return { icon: '🌨️', label: 'Snowing', note: 'Bundle up, my love.' };
  if (code >= 80 && code <= 82) return { icon: '🌦️', label: 'Rain showers', note: 'Umbrella day.' };
  if (code >= 85 && code <= 86) return { icon: '🌨️', label: 'Snow showers', note: 'Stay warm.' };
  if (code >= 95) return { icon: '⛈️', label: 'Thunderstorm', note: 'Stay safe inside.' };
  return { icon: '🌡️', label: 'Unknown', note: '' };
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const playTimerAlarm = () => {
  try {
    const AudioCtx: typeof AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [0, 0.45, 0.9].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now + offset);
      osc.frequency.setValueAtTime(1320, now + offset + 0.08);
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.35, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.4);
      osc.start(now + offset);
      osc.stop(now + offset + 0.45);
    });
    if (ctx.state === 'suspended') ctx.resume();
  } catch (e) { console.log('Timer alarm failed:', e); }
};

const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

/* -------------------- Global Audio: NowPlaying + YouTube API loader -------------------- */
export type NowPlaying =
  | { kind: 'file'; url: string; label: string; sublabel?: string }
  | { kind: 'youtube'; videoId: string; label: string; sublabel?: string };

let ytApiPromise: Promise<any> | null = null;
function loadYouTubeApi(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'));
  const w = window as any;
  if (w.YT && w.YT.Player) return Promise.resolve(w.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous();
      resolve(w.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

/* -------------------- Floating Environment -------------------- */
interface Petal {
  id: number; x: number; y: number; size: number; duration: number;
  delay: number; rotation: number; type: 'petal' | 'orb';
}

const FloatingEnvironment: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);
  useEffect(() => {
    const newPetals: Petal[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 10,
      duration: Math.random() * 30 + 30,
      delay: Math.random() * 10,
      rotation: Math.random() * 360,
      type: Math.random() > 0.5 ? 'petal' : 'orb',
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-60">
      {petals.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute ${el.type === 'orb' ? 'rounded-full bg-[#C69C9C]/10 blur-xl' : ''}`}
          style={{ width: el.size, height: el.size, left: `${el.x}%`, top: `${el.y}%` }}
          animate={{
            y: ['10vh', '-110vh'],
            x: [`${el.x}vw`, `${el.x + (Math.random() * 20 - 10)}vw`],
            rotate: [el.rotation, el.rotation + 360],
          }}
          transition={{ duration: el.duration, delay: el.delay, repeat: Infinity, ease: 'linear' }}
        >
          {el.type === 'petal' && (
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#C69C9C] opacity-20">
              <path d="M50 0 C 80 30, 100 70, 50 100 C 0 70, 20 30, 50 0 Z" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};

/* -------------------- Nav Button -------------------- */
interface NavBtnProps { icon: LucideIcon; label: string; isActive: boolean; onClick: () => void; }

const NavBtn: React.FC<NavBtnProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-500 w-14 h-14 md:w-16 md:h-16 relative group ${
      isActive
        ? 'bg-[#C69C9C] text-white shadow-[0_10px_25px_rgba(198,156,156,0.4)] scale-110'
        : 'text-[#826454] hover:bg-[#F0EBE1] hover:text-[#633131]'
    }`}
  >
    {isActive && (
      <motion.div layoutId="nav-indicator" className="absolute inset-0 bg-[#C69C9C] rounded-2xl z-0" />
    )}
    <Icon size={20} strokeWidth={1.5} className="md:w-[22px] md:h-[22px] relative z-10" />
    <span className="text-[9px] md:text-[10px] mt-1 font-sans tracking-wide relative z-10">{label}</span>
  </button>
);

/* -------------------- Opening Sequence -------------------- */
const OpeningSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#F9F6F0]"
      style={{ backgroundImage: noiseSvg }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
        className="text-center px-6 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C69C9C] rounded-full blur-[120px] opacity-20 pointer-events-none" />
        <h1 className="font-serif text-5xl md:text-7xl text-[#2C302E] mb-6 tracking-wide drop-shadow-sm relative z-10">
          Welcome home, Tingu
        </h1>
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ duration: 1.5, delay: 2.5 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[#C69C9C] to-transparent mx-auto mb-6 max-w-[200px]"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 3 }}
          className="font-sans text-sm md:text-lg text-[#826454] italic tracking-wider relative z-10"
        >
          A little corner of the internet that belongs to you.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

/* -------------------- Home Section (with weather) -------------------- */
interface HomeSectionProps {
  setSection: (section: string) => void;
  triggerEasterEgg: () => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ setSection, triggerEasterEgg }) => {
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [greeting, setGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState<React.ReactNode>(null);
  const [showHug, setShowHug] = useState(false);
  const [cookieBroken, setCookieBroken] = useState(false);
  const [fortuneMsg, setFortuneMsg] = useState('Crack me open!');
  const [timeTogether, setTimeTogether] = useState({ days: 0, hrs: 0 });
  const moonPhase = getMoonPhase();
  const [weather, setWeather] = useState<{ temp: number; code: number; location: string } | null>(null);

  const [showPeriodHub, setShowPeriodHub] = useState(false);
  const [lastPeriod, setLastPeriod] = useCloudStorage<string | null>('sriju_last_period', null);
  const [plantLevel, setPlantLevel] = useCloudStorage<number>('sriju_plant_level', 1);
  const [lastWatered, setLastWatered] = useCloudStorage<string | null>('sriju_plant_watered', null);
  const [locketImage, setLocketImage] = useLocalStorage<string | null>('sriju_locket_img', null);
  const [isLocketOpen, setIsLocketOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [spinning, setSpinning] = useState(false);
  const [foodChoice, setFoodChoice] = useState('?');
  const foods = ['Momo', 'Thakali', 'Pizza', 'Chowmein', 'Burger', 'Sadeko WaiWai', 'Laphing'];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
      setGreetingIcon(<Sun size={28} className="text-[#D4A373]" />);
    } else if (hour < 18) {
      setGreeting('Good afternoon');
      setGreetingIcon(<Cloud size={28} className="text-[#A3B18A]" />);
    } else {
      setGreeting('Good evening');
      setGreetingIcon(<Moon size={28} className="text-[#84A59D]" />);
    }

    const calcTime = () => {
      const start = new Date('2024-12-14T00:00:00').getTime();
      const diff = Date.now() - start;
      setTimeTogether({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((diff / (1000 * 60 * 60)) % 24),
      });
    };
    calcTime();
    const timer = setInterval(calcTime, 1000 * 60 * 60);

    // Weather from Open-Meteo (free, no key) — Kathmandu
    const ITAHARI_LAT = 26.6636;
    const ITAHARI_LON = 87.2741;
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${ITAHARI_LAT}&longitude=${ITAHARI_LON}&current=temperature_2m,weather_code&timezone=Asia/Kathmandu`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
            location: 'Itahari',
          });
        }
      })
      .catch(() => { /* offline — no weather, no problem */ });

    return () => clearInterval(timer);
  }, []);

  const crackCookie = () => {
    if (!cookieBroken) {
      setCookieBroken(true);
      setFortuneMsg(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
      setTimeout(() => setCookieBroken(false), 5000);
    }
  };

  const waterPlant = () => {
    const today = new Date().toDateString();
    if (lastWatered !== today) {
      setLastWatered(today);
      setPlantLevel((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLocketImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const spinFood = () => {
    if (spinning) return;
    setSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setFoodChoice(foods[Math.floor(Math.random() * foods.length)]);
      count++;
      if (count > 20) { clearInterval(interval); setSpinning(false); }
    }, 100);
  };

  const nextPeriodDate = lastPeriod ? new Date(new Date(lastPeriod).getTime() + 28 * 24 * 60 * 60 * 1000) : null;
  const daysUntilNext = nextPeriodDate
    ? Math.ceil((nextPeriodDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const wi = weather ? weatherInfo(weather.code) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto min-h-[85vh] px-4 pt-4 pb-24 relative z-10"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="print-hide absolute top-10 right-4 md:right-12 z-50 cursor-pointer flex flex-col items-center group"
        onClick={triggerEasterEgg}
      >
        <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-md border border-[#C69C9C]/30 flex items-center justify-center shadow-[0_0_20px_rgba(198,156,156,0.3)] group-hover:bg-[#C69C9C] transition-colors duration-500">
          <Key size={20} className="text-[#C69C9C] group-hover:text-white transition-colors" />
        </div>
        <p className="font-['Caveat'] text-[#826454] mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Don't touch this...
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8 flex flex-col gap-6">
          <motion.div className="bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-sm flex flex-col justify-center min-h-[160px]">
            <div className="flex items-center gap-4 mb-2">
              {greetingIcon}
              <h2 className="font-serif text-3xl md:text-5xl text-[#2C302E]">{greeting}, Tingu.</h2>
            </div>
            {wi && weather ? (
              <p className="font-sans text-[#826454] text-base md:text-lg pl-12 flex items-start gap-2">
                <span className="text-2xl leading-none">{wi.icon}</span>
                <span>
                  It's <strong className="text-[#633131]">{weather.temp}°C</strong> and {wi.label.toLowerCase()} in {weather.location}. {wi.note}
                </span>
              </p>
            ) : (
              <p className="font-sans text-[#826454] text-base md:text-lg pl-12">
                I built this place just for you. Take your time.
              </p>
            )}
          </motion.div>

          <motion.div
            onClick={() => setQuoteIndex((quoteIndex + 1) % QUOTES.length)}
            className="flex-1 bg-[#FDFBF7] p-10 rounded-[2.5rem] shadow-sm border border-[#E5D5D5] relative group cursor-pointer overflow-hidden min-h-[250px] flex flex-col justify-center"
          >
            <div className="absolute top-6 left-6 text-[#C69C9C]/30">
              <Pin size={28} fill="#C69C9C" strokeWidth={1} />
            </div>
            <div className="h-full flex flex-col justify-center items-center text-center space-y-6 relative z-10">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-serif text-2xl md:text-4xl text-[#633131] leading-relaxed"
                >
                  "{QUOTES[quoteIndex]}"
                </motion.p>
              </AnimatePresence>
              <p className="font-['Caveat'] text-3xl text-[#826454] opacity-90">— Jigar</p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-40 transition-opacity">
              <RefreshCw size={20} className="text-[#826454]" />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={waterPlant}
              className="bg-[#E8ECE4] p-4 rounded-3xl border border-white shadow-sm flex flex-col items-center justify-center cursor-pointer relative overflow-hidden h-32 group"
            >
              <div className="text-4xl mb-2 transition-transform group-hover:scale-110">
                {plantLevel === 1 ? '🌱' : plantLevel === 2 ? '🌿' : plantLevel === 3 ? '🪴' : plantLevel === 4 ? '🪴✨' : '🌳'}
              </div>
              <p className="font-sans text-xs text-[#826454] font-medium text-center">
                {lastWatered === new Date().toDateString() ? 'Happy & Watered' : 'Needs water! (Click)'}
              </p>
              <Droplet
                size={14}
                className={`absolute top-3 right-3 ${
                  lastWatered === new Date().toDateString()
                    ? 'text-[#9CA893]'
                    : 'text-[#826454] opacity-30 animate-bounce'
                }`}
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={spinFood}
              className="bg-[#F5E6E6] p-4 rounded-3xl border border-white shadow-sm flex flex-col items-center justify-center cursor-pointer h-32 text-center group"
            >
              <span className="text-xs uppercase tracking-widest text-[#633131] mb-2">What to eat?</span>
              <motion.div
                animate={spinning ? { rotateX: 360, scale: 1.1 } : {}}
                transition={{ duration: 0.2, repeat: spinning ? Infinity : 0 }}
                className="font-serif text-xl text-[#2C302E] font-bold"
              >
                {foodChoice}
              </motion.div>
            </motion.div>

            <div className="bg-[#2C302E] p-4 rounded-3xl shadow-sm flex flex-col items-center justify-center h-32 text-center relative overflow-hidden col-span-2 md:col-span-2 border border-[#4A4343]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: noiseSvg }} />
              <div className="flex items-center gap-4 relative z-10">
                <span className="text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{moonPhase.icon}</span>
                <div className="text-left">
                  <p className="font-serif text-white text-lg">{moonPhase.name}</p>
                  <p className="font-sans text-[#A3B18A] text-xs mt-1">We are looking at the same moon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowPeriodHub(true)}
            className="bg-gradient-to-br from-[#F5E6E6] to-[#EAE6E6] p-6 rounded-[2rem] border border-white/50 shadow-sm relative overflow-hidden flex flex-col justify-center cursor-pointer h-40 group"
          >
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#C69C9C]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="font-serif text-2xl text-[#633131] mb-1">Comfort Hub</h3>
                <p className="font-sans text-sm text-[#826454]">
                  {daysUntilNext !== null
                    ? daysUntilNext > 0
                      ? `${daysUntilNext} days until next cycle`
                      : 'Cycle might be starting'
                    : 'Tap to set up'}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center shadow-sm">
                <Heart size={20} className="text-[#C69C9C] fill-[#C69C9C]" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/40 p-6 rounded-[2rem] border border-[#E5D5D5] shadow-sm flex flex-col justify-center items-center text-center h-32"
          >
            <h3 className="font-sans text-xs uppercase tracking-widest text-[#826454] mb-2">
              Survived Each Other For
            </h3>
            <div className="font-serif text-4xl text-[#633131] flex items-end gap-2">
              {timeTogether.days}
              <span className="text-xl text-[#826454] mb-1">days</span>
            </div>
          </motion.div>

          <motion.div
            onClick={() => setIsLocketOpen(true)}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-tr from-[#D4A373]/20 to-[#E8E1D3] p-6 rounded-[2rem] border border-white/50 shadow-sm cursor-pointer flex items-center justify-center group h-32 relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-full border-[3px] border-[#C69C9C] bg-[#FDFBF7] flex items-center justify-center shadow-inner relative z-10 overflow-hidden">
              {locketImage ? (
                <img src={locketImage} alt="Locket" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                <Camera size={24} className="text-[#C69C9C]" />
              )}
            </div>
            <p className="absolute bottom-3 font-sans text-[10px] uppercase tracking-widest text-[#826454]">
              Digital Locket
            </p>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          onClick={() => setSection('mood')}
          className="col-span-2 md:col-span-2 bg-[#F5E6E6] p-8 rounded-[2rem] shadow-sm group min-h-[180px] cursor-pointer border border-white relative overflow-hidden"
        >
          <Palette size={32} className="text-[#C69C9C] mb-4" />
          <h3 className="font-serif text-3xl text-[#633131]">Mood & Memories</h3>
          <p className="font-sans text-sm text-[#826454]">Change the room, open the Memory Jar.</p>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setSection('finance')}
          className="bg-[#F0EBE1] p-6 rounded-[2rem] shadow-sm group border border-white cursor-pointer aspect-square flex flex-col items-center justify-center text-center"
        >
          <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center mb-3 group-hover:bg-[#9CA893] transition-colors">
            <Coins size={24} className="text-[#9CA893] group-hover:text-white" />
          </div>
          <h3 className="font-serif text-xl text-[#2C302E]">Rs. Jar</h3>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => setSection('story')}
          className="bg-white/60 p-6 rounded-[2rem] shadow-sm group border border-[#E5D5D5] cursor-pointer aspect-square flex flex-col items-center justify-center text-center"
        >
          <div className="w-14 h-14 rounded-full bg-[#F9F4F4] flex items-center justify-center mb-3 group-hover:bg-[#C69C9C] transition-colors">
            <Heart size={24} className="text-[#C69C9C] group-hover:text-white" />
          </div>
          <h3 className="font-serif text-xl text-[#2C302E]">Our Story</h3>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPeriodHub && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F5E6E6]/95 backdrop-blur-md px-4"
          >
            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] text-center shadow-2xl border border-[#E5D5D5] relative overflow-hidden">
              <button onClick={() => setShowPeriodHub(false)} className="absolute top-6 right-6 text-[#633131] hover:text-black">Close</button>
              <div className="text-5xl mb-6 flex justify-center gap-4">🍫 🧸 🫖</div>
              <h2 className="font-serif text-3xl text-[#633131] mb-2">Tingu's Comfort Hub</h2>
              <div className="bg-[#FDFBF7] p-4 rounded-2xl mb-6 border border-[#E5D5D5] mt-6">
                <p className="font-sans text-sm text-[#826454] mb-2 uppercase tracking-widest">Cycle Tracker</p>
                <div className="flex items-center justify-center gap-4">
                  <input
                    type="date"
                    value={lastPeriod || ''}
                    onChange={(e) => setLastPeriod(e.target.value)}
                    className="bg-white border border-[#C69C9C]/30 rounded-lg p-2 font-sans text-sm outline-none"
                  />
                </div>
                {daysUntilNext !== null && (
                  <p className="font-serif text-lg text-[#633131] mt-3">
                    {daysUntilNext > 0 ? `Next cycle in roughly ${daysUntilNext} days` : 'Take care of yourself today.'}
                  </p>
                )}
              </div>
              <p className="font-sans text-[#826454] text-lg leading-relaxed mb-6">
                I know it hurts right now. Get your hot water bag, eat some chocolate, and rest. You don't have to do anything else today except take care of yourself.
              </p>
              <button
                onClick={() => { setShowPeriodHub(false); setShowHug(true); setTimeout(() => setShowHug(false), 3000); }}
                className="w-full bg-[#C69C9C] text-white py-3 rounded-xl font-sans font-medium hover:bg-[#B58B8B] transition-colors shadow-sm"
              >
                Request Emergency Hug
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLocketOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: -90 }}
              transition={{ type: 'spring', duration: 1 }}
              className="max-w-sm w-full bg-[#E8E1D3] p-4 rounded-[2rem] border-[4px] border-[#D4A373] shadow-2xl relative"
            >
              <button onClick={() => setIsLocketOpen(false)} className="absolute -top-12 right-0 text-white font-sans text-sm">Close</button>
              <div className="aspect-[3/4] bg-[#2C302E] rounded-2xl overflow-hidden relative flex items-center justify-center border-4 border-[#FDFBF7]">
                {locketImage ? (
                  <img src={locketImage} alt="Locket Memory" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 text-[#A3B18A]">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-serif text-lg">Empty Locket</p>
                    <p className="font-sans text-xs mt-2 opacity-70">Upload one special photo to keep here forever.</p>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition-colors"
                >
                  <Camera size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHug && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.5, 1.2, 1.3], rotate: [0, -10, 10, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center"
            >
              <Heart size={150} className="text-[#C69C9C] fill-[#C69C9C]" />
              <h2 className="font-serif text-6xl text-white mt-6 drop-shadow-lg tracking-widest">SQUEEEEEZE!</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* -------------------- Mood Corner -------------------- */
interface MoodCornerProps { currentMood: Mood | null; setAppMood: (mood: Mood) => void; }

const MoodCorner: React.FC<MoodCornerProps> = ({ currentMood, setAppMood }) => {
  const [showBreathing, setShowBreathing] = useState(false);
  const [showMemoryJar, setShowMemoryJar] = useState(false);
  const [memories, setMemories] = useCloudStorage<{ id: number; text: string }[]>('sriju_memories', []);
  const [newMemory, setNewMemory] = useState('');

  const addMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.trim()) return;
    setMemories([...memories, { id: Date.now(), text: newMemory }]);
    setNewMemory('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 relative z-10"
    >
      <div className="absolute top-0 right-4 flex gap-4">
        <button
          onClick={() => setShowBreathing(true)}
          className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full text-[#826454] font-sans text-sm hover:bg-white shadow-sm transition"
        >
          <Wind size={16} /> Breathe
        </button>
      </div>

      <div className="text-center mb-12 mt-12">
        <h2 className="font-serif text-5xl text-[#2C302E] mb-4 drop-shadow-sm">How are you feeling?</h2>
        <p className="font-sans text-[#826454] text-lg">Tap a color. The whole room will listen to you.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 w-full place-items-center mb-16 max-w-3xl">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.15, rotate: Math.random() * 15 - 7.5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setAppMood(mood)}
            className="flex flex-col items-center gap-6 group relative"
          >
            <div className="relative">
              {currentMood?.id === mood.id && (
                <motion.div layoutId="mood-glow" className="absolute -inset-6 bg-white/70 rounded-full blur-2xl" />
              )}
              <svg
                viewBox="0 0 200 150"
                className={`w-28 h-28 md:w-40 md:h-40 drop-shadow-lg transition-all duration-700 relative z-10 ${
                  currentMood?.id === mood.id ? 'scale-110 drop-shadow-2xl' : 'group-hover:scale-105'
                }`}
                style={{ fill: mood.color }}
              >
                <path d={mood.path} />
              </svg>
            </div>
            <span
              className={`font-sans text-sm md:text-base uppercase tracking-widest transition-all duration-500 ${
                currentMood?.id === mood.id ? 'text-[#633131] font-bold tracking-[0.3em]' : 'text-[#826454]'
              }`}
            >
              {mood.label}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentMood && (
          <motion.div
            key={currentMood.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-white/70 backdrop-blur-2xl p-10 md:p-12 rounded-[2.5rem] border border-white max-w-2xl text-center shadow-md relative overflow-hidden mb-12 w-full"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ backgroundColor: currentMood.color }} />
            <p className="font-serif text-2xl md:text-3xl text-[#633131] leading-relaxed relative z-10">"{currentMood.msg}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowMemoryJar(true)}
        className="bg-gradient-to-r from-[#D4A373]/30 to-[#C69C9C]/30 backdrop-blur-md px-8 py-4 rounded-full border border-white shadow-sm flex items-center gap-3 text-[#633131]"
      >
        <Gift size={20} /> <span className="font-serif text-xl">Open the Memory Jar</span>
      </motion.button>

      <AnimatePresence>
        {showBreathing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F6F0]/90 backdrop-blur-sm"
          >
            <button onClick={() => setShowBreathing(false)} className="absolute top-10 right-10 text-[#826454] hover:text-[#2C302E]">Close</button>
            <h2 className="font-serif text-4xl text-[#633131] mb-12">Breathe with me</h2>
            <motion.div
              animate={{ scale: [1, 2, 1], backgroundColor: ['#DCE0D9', '#9CA893', '#DCE0D9'] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(156,168,147,0.5)]"
            />
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-16 font-sans text-xl text-[#826454] tracking-widest uppercase"
            >
              Inhale... Exhale...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMemoryJar && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          >
            <div className="max-w-2xl w-full bg-[#FDFBF7] p-8 md:p-12 rounded-[3rem] border border-[#E5D5D5] shadow-2xl relative flex flex-col items-center">
              <button onClick={() => setShowMemoryJar(false)} className="absolute top-6 right-6 text-[#826454]">Close</button>
              <h2 className="font-serif text-4xl text-[#633131] mb-2">Memory Jar</h2>
              <p className="font-sans text-[#826454] text-sm mb-8">Drop a tiny memory in here to keep forever.</p>
              <div className="relative w-48 h-64 border-4 border-white bg-white/20 rounded-b-[3rem] rounded-t-lg shadow-inner mb-8 overflow-hidden flex flex-wrap-reverse content-start p-4 gap-2">
                <div className="absolute top-0 left-0 w-full h-8 bg-white/40 border-b-4 border-white" />
                {memories.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ y: -200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D4A373] to-[#C69C9C] shadow-[0_0_10px_rgba(198,156,156,0.6)] group relative"
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-white text-[#2C302E] text-xs font-sans p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity">
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </div>
              <form onSubmit={addMemory} className="w-full flex gap-3">
                <input
                  type="text"
                  value={newMemory}
                  onChange={(e) => setNewMemory(e.target.value)}
                  placeholder="Remember when we..."
                  className="flex-1 bg-white border border-[#E5D5D5] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#C69C9C]"
                />
                <button type="submit" className="bg-[#9CA893] text-white px-6 py-3 rounded-xl hover:bg-[#8A9682] transition-colors shadow-sm">
                  Save
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* -------------------- Tic Tac Toe -------------------- */
const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = 'H';
    setBoard(newBoard);
    setIsXNext(false);
  };

  useEffect(() => {
    if (!isXNext && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter((val): val is number => val !== null);
        if (emptyIndices.length > 0) {
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          const newBoard = [...board];
          newBoard[randomIndex] = 'S';
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner, isDraw]);

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="font-['Caveat'] text-4xl text-[#826454] mb-6">Play a quick game!</h3>
      <div className="grid grid-cols-3 gap-2 bg-[#E5D5D5] p-2 rounded-2xl w-64 h-64 shadow-inner">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)} className="bg-white rounded-xl flex items-center justify-center text-4xl hover:bg-[#F9F6F0] transition-colors">
            {cell === 'H' && <Heart className="text-[#C69C9C] fill-[#C69C9C]" size={40} />}
            {cell === 'S' && <Star className="text-[#9CA893] fill-[#9CA893]" size={40} />}
          </button>
        ))}
      </div>
      <div className="mt-6 font-serif text-2xl text-[#633131] h-8">
        {winner === 'H' ? 'You win! ❤️' : winner === 'S' ? 'Jigar-bot wins! ⭐' : isDraw ? "It's a tie!" : ''}
      </div>
      {(winner || isDraw) && (
        <button
          onClick={() => { setBoard(Array(9).fill(null)); setIsXNext(true); }}
          className="mt-4 px-6 py-2 bg-white/50 border border-[#E5D5D5] rounded-full text-[#826454] hover:bg-white transition-colors"
        >
          Play Again
        </button>
      )}
    </div>
  );
};

/* -------------------- Study History Tab -------------------- */
interface StudyHistoryProps {
  sessions: StudySession[];
  onDeleteSession: (id: number) => void;
}

const StudyHistory: React.FC<StudyHistoryProps> = ({ sessions, onDeleteSession }) => {
  const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0);
  const sessionCount = sessions.length;

  // Totals map by date
  const totalsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    sessions.forEach((s) => {
      map[s.date] = (map[s.date] || 0) + s.durationSeconds;
    });
    return map;
  }, [sessions]);

  // Streak (consecutive days with study, ending today or yesterday)
  const streak = useMemo(() => {
    let count = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    // Allow today to be empty without breaking streak (if today hasn't been studied yet)
    const todayKey = todayISO();
    if (!totalsByDate[todayKey]) cursor.setDate(cursor.getDate() - 1);
    while (true) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      if (totalsByDate[key]) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
      } else break;
    }
    return count;
  }, [totalsByDate]);

  // This week & today totals
  const todayTotal = totalsByDate[todayISO()] || 0;
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  let weekTotal = 0;
  Object.entries(totalsByDate).forEach(([date, secs]) => {
    if (new Date(date + 'T00:00:00').getTime() >= weekStart.getTime()) weekTotal += secs;
  });

  // Heatmap — last ~5 weeks aligned to Sunday
  const heatmapWeeks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 34);
    start.setDate(start.getDate() - start.getDay()); // align to Sunday

    const days: { date: string; minutes: number }[] = [];
    const cursor = new Date(start);
    while (cursor <= today) {
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      days.push({ date: key, minutes: Math.round((totalsByDate[key] || 0) / 60) });
      cursor.setDate(cursor.getDate() + 1);
    }
    const weeks: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    return weeks;
  }, [totalsByDate]);

  const heatColor = (min: number) => {
    if (min === 0) return '#E5D5D5';
    if (min <= 15) return '#C9D6C0';
    if (min <= 45) return '#9CA893';
    if (min <= 90) return '#7A8A70';
    if (min <= 180) return '#5C6B54';
    return '#3F4C38';
  };

  const recent = [...sessions].sort((a, b) => b.startedAt - a.startedAt).slice(0, 20);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="font-serif text-3xl text-[#633131] mb-6 text-center">Your Study Journey</h3>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white/70 rounded-2xl p-4 border border-white shadow-sm text-center">
          <Clock size={18} className="text-[#9CA893] mx-auto mb-1" />
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#826454]">Total</p>
          <p className="font-serif text-xl text-[#633131] mt-1">{formatDuration(totalSeconds)}</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-4 border border-white shadow-sm text-center">
          <Flame size={18} className="text-[#D4A373] mx-auto mb-1" />
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#826454]">Streak</p>
          <p className="font-serif text-xl text-[#633131] mt-1">{streak} {streak === 1 ? 'day' : 'days'}</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-4 border border-white shadow-sm text-center">
          <BarChart3 size={18} className="text-[#C69C9C] mx-auto mb-1" />
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#826454]">Today</p>
          <p className="font-serif text-xl text-[#633131] mt-1">{formatDuration(todayTotal)}</p>
        </div>
        <div className="bg-white/70 rounded-2xl p-4 border border-white shadow-sm text-center">
          <TrendingUp size={18} className="text-[#84A59D] mx-auto mb-1" />
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#826454]">This week</p>
          <p className="font-serif text-xl text-[#633131] mt-1">{formatDuration(weekTotal)}</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white/60 rounded-2xl p-5 border border-white shadow-sm mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans text-xs uppercase tracking-widest text-[#826454]">Last 5 weeks</p>
          <p className="font-sans text-[10px] text-[#826454]">sessions: {sessionCount}</p>
        </div>
        <div className="flex flex-col gap-1">
          {heatmapWeeks.map((week, wi) => (
            <div key={wi} className="flex gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date} — ${day.minutes} min`}
                  className="w-5 h-5 md:w-7 md:h-7 rounded-md"
                  style={{ backgroundColor: heatColor(day.minutes) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      <div className="bg-white/60 rounded-2xl p-5 border border-white shadow-sm">
        <p className="font-sans text-xs uppercase tracking-widest text-[#826454] mb-4">Recent sessions</p>
        {recent.length === 0 ? (
          <p className="font-['Caveat'] text-2xl text-[#826454] text-center py-6 opacity-70">
            Nothing yet. Start a focus session and it'll land here.
          </p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-2">
            {recent.map((s) => {
              const when = new Date(s.startedAt);
              const label = when.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              const time = when.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              return (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FDFBF7] border border-[#E5D5D5] group">
                  <div>
                    <p className="font-sans text-sm text-[#2C302E] font-medium">{formatDuration(s.durationSeconds)}</p>
                    <p className="font-sans text-[10px] text-[#826454]">{label} · {time}</p>
                  </div>
                  <button
                    onClick={() => onDeleteSession(s.id)}
                    className="p-2 rounded-full text-[#826454]/30 hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------- Study Corner -------------------- */
interface StudyCornerProps {
  ambientSound: string;
  setAmbientSound: (sound: string) => void;
}

const StudyCorner: React.FC<StudyCornerProps> = ({ ambientSound, setAmbientSound }) => {
  const [tasks, setTasks] = useCloudStorage<TaskItem[]>('sriju_tasks', [
    { id: 1, text: 'Drink a glass of water', done: false },
  ]);
  const [sessions, setSessions] = useCloudStorage<StudySession[]>('sriju_study_sessions', []);
  const [newTask, setNewTask] = useState('');
  const [activeTab, setActiveTab] = useState<'focus' | 'doodle' | 'pop' | 'game' | 'history'>('focus');

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const alarmFiredRef = useRef(false);
  const sessionStartRef = useRef<number | null>(null);

  // Timer tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (isRunning && timeLeft === 0 && !alarmFiredRef.current) {
      alarmFiredRef.current = true;
      setIsRunning(false);
      playTimerAlarm();
      if (mode === 'focus') { setMode('break'); setTimeLeft(5 * 60); }
      else { setMode('focus'); setTimeLeft(25 * 60); }
      setTimeout(() => { alarmFiredRef.current = false; }, 1500);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning, timeLeft, mode]);

  // Auto-track study sessions: log a session whenever focus mode stops (pause, mode change, unmount)
  useEffect(() => {
    if (isRunning && mode === 'focus') {
      sessionStartRef.current = Date.now();
    }
    return () => {
      if (sessionStartRef.current !== null) {
        const start = sessionStartRef.current;
        sessionStartRef.current = null;
        const durationSeconds = Math.round((Date.now() - start) / 1000);
        if (durationSeconds >= 30) {
          const d = new Date(start);
          const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          setSessions((prev) => [...prev, { id: Date.now(), date, startedAt: start, durationSeconds }]);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode]);

  const toggleTask = (id: number) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
    setNewTask('');
  };

  const formatTime = (secs: number) =>
    `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

  const switchMode = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    alarmFiredRef.current = false;
  };

  const deleteSession = (id: number) => setSessions(sessions.filter((s) => s.id !== id));

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (activeTab === 'doodle' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement?.clientWidth ?? 600;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#826454';
        ctx.lineWidth = 3;
      }
    }
  }, [activeTab]);

  const ambientOptions: { id: string; label: string; icon: LucideIcon; color: string }[] = [
    { id: 'piano', label: 'Piano', icon: Music, color: '#633131' },
    { id: 'rain', label: 'Rain', icon: CloudRain, color: '#2C302E' },
    { id: 'forest', label: 'Forest', icon: Trees, color: '#9CA893' },
    { id: 'lofi', label: 'Lofi', icon: Music, color: '#C69C9C' },
    { id: 'cafe', label: 'Cafe', icon: Coffee, color: '#D4A373' },
    { id: 'night', label: 'Night', icon: Moon, color: '#633131' },
    { id: 'ocean', label: 'Ocean', icon: Droplet, color: '#84A59D' },
  ];

  const tabs: { id: typeof activeTab; label: string; icon?: LucideIcon }[] = [
    { id: 'focus', label: 'Focus' },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'doodle', label: 'Doodle', icon: PenTool },
    { id: 'pop', label: 'Bubble Wrap', icon: CircleDashed },
    { id: 'game', label: 'Mini Game', icon: Gamepad2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 py-8 relative z-10"
    >
      <div className="text-center mb-10">
        <h2 className="font-serif text-4xl md:text-5xl text-[#2C302E]">Study Desk</h2>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2 rounded-full font-sans text-sm transition flex items-center gap-2 ${
                  isActive ? 'bg-[#826454] text-white shadow-md' : 'bg-white/50 text-[#826454] hover:bg-white'
                }`}
              >
                {Icon && <Icon size={14} />} {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-sm">
            <h3 className="font-serif text-2xl text-[#633131] mb-6 flex items-center gap-2">
              <Coffee size={24} /> To-Do List
            </h3>
            <div className="space-y-4 mb-6">
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-3 group"
                  >
                    <button onClick={() => toggleTask(task.id)} className="text-[#9CA893] hover:text-[#633131]">
                      <CheckCircle size={20} className={task.done ? 'fill-[#9CA893]/20' : ''} />
                    </button>
                    <span className={`flex-1 font-sans text-sm ${task.done ? 'line-through text-[#826454]/40' : 'text-[#2C302E]'}`}>
                      {task.text}
                    </span>
                    <button
                      onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}
                      className="text-[#826454]/0 group-hover:text-red-400 hover:!text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <form onSubmit={addTask} className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task..."
                className="flex-1 bg-white/50 border border-[#E5D5D5] rounded-xl px-4 py-3 font-sans text-sm outline-none"
              />
              <button type="submit" className="bg-[#C69C9C] text-white p-3 rounded-xl hover:bg-[#B58B8B]">
                <Plus size={20} />
              </button>
            </form>
          </div>

          <div className="bg-[#F5E6E6]/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-sm">
            <h3 className="font-sans uppercase tracking-widest text-xs text-[#826454] mb-4 flex items-center gap-2">
              <Volume2 size={14} /> Zen Sounds
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {ambientOptions.map(({ id, label, icon: Icon, color }) => {
                const isActive = ambientSound === id;
                return (
                  <button
                    key={id}
                    onClick={() => setAmbientSound(id)}
                    className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      isActive ? 'bg-[#C69C9C] text-white shadow-md scale-[1.03]' : 'bg-white/60 hover:bg-white text-[#633131]'
                    }`}
                  >
                    <Icon size={18} style={{ color: isActive ? undefined : color }} />
                    <span className="text-[10px] font-sans">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="lg:col-span-2 bg-[#F9F6F0]/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-[#E5D5D5] shadow-sm min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(#E5D5D5 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        >
          {activeTab === 'focus' && (
            <div className="text-center w-full">
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => switchMode('focus')}
                  className={`font-sans text-sm px-6 py-2 rounded-full transition-colors ${
                    mode === 'focus' ? 'bg-[#9CA893] text-white shadow-md' : 'text-[#826454] hover:bg-white/50'
                  }`}
                >
                  Focus
                </button>
                <button
                  onClick={() => switchMode('break')}
                  className={`font-sans text-sm px-6 py-2 rounded-full transition-colors ${
                    mode === 'break' ? 'bg-[#C69C9C] text-white shadow-md' : 'text-[#826454] hover:bg-white/50'
                  }`}
                >
                  Break
                </button>
              </div>
              <div
                className="w-64 h-64 mx-auto rounded-full border-[8px] flex items-center justify-center transition-colors duration-1000 mb-8"
                style={{ borderColor: mode === 'focus' ? '#9CA893' : '#C69C9C' }}
              >
                <span className="font-serif text-6xl text-[#2C302E]">{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-12 py-4 text-white rounded-full font-sans font-medium text-lg bg-[#826454] hover:bg-[#633131] transition-colors shadow-md"
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <p className="font-sans text-xs text-[#826454] mt-4 opacity-70">
                🔔 Alarm will chime when the timer hits zero. Your focus time is saved automatically.
              </p>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="w-full overflow-y-auto max-h-[550px] custom-scrollbar py-2">
              <StudyHistory sessions={sessions} onDeleteSession={deleteSession} />
            </div>
          )}

          {activeTab === 'doodle' && (
            <div className="w-full h-full flex flex-col cursor-crosshair">
              <div className="flex justify-between items-center mb-4 w-full">
                <h3 className="font-['Caveat'] text-3xl text-[#826454]">Draw something cute...</h3>
                <button
                  onClick={() => {
                    const ctx = canvasRef.current?.getContext('2d');
                    if (ctx && canvasRef.current) {
                      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    }
                  }}
                  className="text-sm font-sans text-[#C69C9C] hover:underline"
                >
                  Clear
                </button>
              </div>
              <canvas
                ref={canvasRef}
                onMouseDown={({ nativeEvent }) => {
                  const ctx = canvasRef.current?.getContext('2d');
                  if (!ctx) return;
                  ctx.beginPath();
                  ctx.moveTo(nativeEvent.offsetX, nativeEvent.offsetY);
                  setIsDrawing(true);
                }}
                onMouseMove={({ nativeEvent }) => {
                  if (!isDrawing) return;
                  const ctx = canvasRef.current?.getContext('2d');
                  if (!ctx) return;
                  ctx.lineTo(nativeEvent.offsetX, nativeEvent.offsetY);
                  ctx.stroke();
                }}
                onMouseUp={() => { canvasRef.current?.getContext('2d')?.closePath(); setIsDrawing(false); }}
                onMouseLeave={() => { canvasRef.current?.getContext('2d')?.closePath(); setIsDrawing(false); }}
                className="w-full h-[400px] bg-white/50 border-2 border-dashed border-[#E5D5D5] rounded-xl"
              />
            </div>
          )}

          {activeTab === 'pop' && (
            <div className="w-full h-full flex flex-col items-center">
              <h3 className="font-['Caveat'] text-3xl text-[#826454] mb-6">Pop to release stress!</h3>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {Array.from({ length: 42 }).map((_, i) => (<BubbleWrap key={i} />))}
              </div>
            </div>
          )}

          {activeTab === 'game' && <TicTacToe />}
        </div>
      </div>
    </motion.div>
  );
};

const BubbleWrap: React.FC = () => {
  const [popped, setPopped] = useState(false);
  return (
    <motion.button
      onClick={() => setPopped(true)}
      animate={popped ? { scale: 0.8, opacity: 0.2 } : { scale: 1, opacity: 1 }}
      className={`w-12 h-12 rounded-full border-2 border-white shadow-inner ${
        popped ? 'bg-transparent' : 'bg-white/80 cursor-pointer relative'
      }`}
    >
      {!popped && <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2 opacity-60" />}
    </motion.button>
  );
};

/* -------------------- Finance Corner (savings-first) -------------------- */
const FinanceCorner: React.FC = () => {
  const [goal, setGoal] = useCloudStorage<number>('sriju_goal_npr', 50000);
  const [deposits, setDeposits] = useCloudStorage<SavingsDeposit[]>('sriju_deposits', []);
  const [expenses, setExpenses] = useCloudStorage<ExpenseItem[]>('sriju_expenses_npr', []);

  const [activeTab, setActiveTab] = useState<'save' | 'spend'>('save');
  const [newDepositAmount, setNewDepositAmount] = useState('');
  const [newDepositNote, setNewDepositNote] = useState('');
  const [newExpName, setNewExpName] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal);
  const [jarWobble, setJarWobble] = useState(false);

  const totalSaved = deposits.reduce((s, d) => s + d.amount, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const progress = Math.min(100, (totalSaved / (goal || 1)) * 100);
  const remaining = Math.max(0, goal - totalSaved);

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weekTotal = deposits
    .filter((d) => new Date(d.date + 'T00:00:00').getTime() >= weekAgo)
    .reduce((s, d) => s + d.amount, 0);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthTotal = deposits
    .filter((d) => new Date(d.date + 'T00:00:00').getTime() >= monthStart.getTime())
    .reduce((s, d) => s + d.amount, 0);

  // Simple pace estimate
  const dailyRate = weekTotal / 7;
  const etaDays = dailyRate > 0 && remaining > 0 ? Math.ceil(remaining / dailyRate) : null;

  const addDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newDepositAmount);
    if (!amt || amt <= 0 || isNaN(amt)) return;
    setDeposits([
      { id: Date.now(), amount: amt, note: newDepositNote.trim() || 'Saved', date: todayISO() },
      ...deposits,
    ]);
    setNewDepositAmount('');
    setNewDepositNote('');
    setJarWobble(true);
    setTimeout(() => setJarWobble(false), 700);
  };

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpName || !newExpAmount || isNaN(Number(newExpAmount))) return;
    setExpenses([
      { id: Date.now(), name: newExpName, amount: parseFloat(newExpAmount) },
      ...expenses,
    ]);
    setNewExpName('');
    setNewExpAmount('');
  };

  const removeDeposit = (id: number) => setDeposits(deposits.filter((d) => d.id !== id));
  const removeExpense = (id: number) => setExpenses(expenses.filter((e) => e.id !== id));

  const saveGoal = () => {
    if (tempGoal > 0) setGoal(tempGoal);
    setIsEditingGoal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 py-12 relative z-10"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-3">
          <PiggyBank className="text-[#C69C9C]" size={32} />
          <h2 className="font-serif text-4xl md:text-5xl text-[#2C302E]">Our Savings Jar</h2>
        </div>
        <p className="font-sans text-[#826454] text-lg">
          Every rupee you save is a little love letter to your future self.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Jar + goal */}
        <div className="lg:col-span-5 flex flex-col items-center bg-white/50 backdrop-blur-xl p-8 rounded-[3rem] border border-white/60 shadow-sm relative overflow-hidden">
          <button
            onClick={() => { setTempGoal(goal); setIsEditingGoal(true); }}
            className="absolute top-5 right-5 p-2 text-[#826454] hover:bg-white/70 rounded-full"
            aria-label="Edit goal"
          >
            <Edit2 size={18} />
          </button>

          <AnimatePresence>
            {isEditingGoal && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-8 rounded-[3rem]"
              >
                <h3 className="font-serif text-2xl mb-6 text-[#633131]">Set Your Saving Goal</h3>
                <div className="flex items-center bg-[#F9F6F0] border border-[#E5D5D5] rounded-xl px-4 w-full max-w-xs mb-4">
                  <span className="text-[#826454] text-sm mr-2">Rs.</span>
                  <input
                    type="number"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(Number(e.target.value))}
                    className="w-full bg-transparent py-3 font-serif text-xl outline-none"
                  />
                </div>
                <div className="flex gap-3 w-full max-w-xs">
                  <button onClick={() => setIsEditingGoal(false)} className="flex-1 py-3 rounded-xl font-sans text-sm text-[#826454] hover:bg-[#F0EBE1]">
                    Cancel
                  </button>
                  <button onClick={saveGoal} className="flex-1 bg-[#9CA893] text-white py-3 rounded-xl font-sans font-medium hover:bg-[#87977E]">
                    Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#826454] mb-4">Goal</p>
          <p className="font-serif text-3xl text-[#633131] mb-6">Rs. {goal.toLocaleString()}</p>

          <motion.div
            animate={jarWobble ? { rotate: [0, -6, 6, -3, 3, 0] } : {}}
            transition={{ duration: 0.7 }}
            className="relative w-56 h-72 mb-6"
          >
            <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-2xl">
              <path
                d="M30 10 L70 10 L70 20 L85 30 L85 140 Q85 150 70 150 L30 150 Q15 150 15 140 L15 30 L30 20 Z"
                fill="rgba(255,255,255,0.5)"
                stroke="#C69C9C"
                strokeWidth="2"
              />
              <rect x="25" y="5" width="50" height="10" rx="3" fill="#826454" />
              <defs>
                <linearGradient id="fill-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B5C7A8" />
                  <stop offset="100%" stopColor="#7A8A70" />
                </linearGradient>
                <clipPath id="jar-clip">
                  <path d="M30 10 L70 10 L70 20 L85 30 L85 140 Q85 150 70 150 L30 150 Q15 150 15 140 L15 30 L30 20 Z" />
                </clipPath>
              </defs>
              <g clipPath="url(#jar-clip)">
                <rect
                  x="0"
                  y={150 - (progress / 100) * 130 - 10}
                  width="100"
                  height="150"
                  fill="url(#fill-grad)"
                  opacity="0.9"
                  className="transition-all duration-1000 ease-in-out"
                />
              </g>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-14">
              <span className="font-sans text-[10px] uppercase tracking-widest text-[#633131] bg-white/70 px-2 rounded-full">Saved</span>
              <span className="font-sans font-bold text-[#2C302E] drop-shadow-md text-2xl mt-1">
                Rs. {totalSaved.toLocaleString()}
              </span>
              <span className="font-serif text-[#633131] text-xs mt-1">{progress.toFixed(0)}% of goal</span>
            </div>
          </motion.div>

          {remaining > 0 ? (
            <p className="font-['Caveat'] text-2xl text-[#633131] text-center">
              Rs. {remaining.toLocaleString()} to go. You've got this, Tingu.
            </p>
          ) : (
            <p className="font-['Caveat'] text-2xl text-[#633131] text-center">
              You reached your goal. I'm so proud of you. ♡
            </p>
          )}

          <div className="grid grid-cols-3 gap-3 w-full mt-6">
            <div className="bg-white/70 rounded-2xl py-3 text-center border border-white">
              <p className="font-sans text-[9px] uppercase tracking-widest text-[#826454]">This week</p>
              <p className="font-serif text-base text-[#633131] mt-1">Rs. {weekTotal.toLocaleString()}</p>
            </div>
            <div className="bg-white/70 rounded-2xl py-3 text-center border border-white">
              <p className="font-sans text-[9px] uppercase tracking-widest text-[#826454]">This month</p>
              <p className="font-serif text-base text-[#633131] mt-1">Rs. {monthTotal.toLocaleString()}</p>
            </div>
            <div className="bg-white/70 rounded-2xl py-3 text-center border border-white">
              <p className="font-sans text-[9px] uppercase tracking-widest text-[#826454]">ETA</p>
              <p className="font-serif text-base text-[#633131] mt-1">
                {etaDays !== null ? `${etaDays}d` : '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Tabs */}
        <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-[3rem] border border-[#E5D5D5] shadow-sm flex flex-col min-h-[560px]">
          <div className="flex bg-[#F0EBE1] rounded-full p-1 mb-6 w-fit">
            <button
              onClick={() => setActiveTab('save')}
              className={`px-5 py-2 rounded-full font-sans text-sm transition ${
                activeTab === 'save' ? 'bg-[#9CA893] text-white shadow-sm' : 'text-[#826454]'
              }`}
            >
              <span className="inline-flex items-center gap-2"><TrendingUp size={14} /> Savings</span>
            </button>
            <button
              onClick={() => setActiveTab('spend')}
              className={`px-5 py-2 rounded-full font-sans text-sm transition ${
                activeTab === 'spend' ? 'bg-[#C69C9C] text-white shadow-sm' : 'text-[#826454]'
              }`}
            >
              <span className="inline-flex items-center gap-2"><Coins size={14} /> Expenses</span>
            </button>
          </div>

          {activeTab === 'save' && (
            <>
              <form onSubmit={addDeposit} className="flex flex-col md:flex-row gap-3 mb-6 bg-[#FDFBF7] p-3 rounded-2xl border border-[#E5D5D5]">
                <div className="flex items-center bg-white border border-[#E5D5D5] rounded-xl px-4 md:w-40">
                  <span className="text-[#826454] text-sm mr-2">Rs.</span>
                  <input
                    type="number"
                    value={newDepositAmount}
                    onChange={(e) => setNewDepositAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent py-2 font-sans text-base outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={newDepositNote}
                  onChange={(e) => setNewDepositNote(e.target.value)}
                  placeholder="Note (optional) — e.g. skipped takeout"
                  className="flex-1 bg-transparent px-4 py-2 font-sans text-sm outline-none"
                />
                <button type="submit" className="bg-[#9CA893] text-white p-3 px-6 rounded-xl hover:bg-[#87977E] font-sans font-medium">
                  <Plus size={18} />
                </button>
              </form>

              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {deposits.length === 0 && (
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="font-['Caveat'] text-2xl text-[#826454] text-center py-10 opacity-70"
                    >
                      Nothing saved yet. Every rupee counts, Tingu.
                    </motion.p>
                  )}
                  {deposits.map((d) => (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-between items-center p-4 hover:bg-[#F9F6F0] bg-white/60 rounded-2xl group border border-transparent hover:border-[#E5D5D5]"
                    >
                      <div>
                        <p className="font-sans text-base text-[#2C302E]">{d.note}</p>
                        <p className="font-sans text-[10px] text-[#826454] mt-0.5">{d.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif text-xl text-[#7A8A70]">+ Rs. {d.amount.toLocaleString()}</span>
                        <button
                          onClick={() => removeDeposit(d.id)}
                          className="p-2 rounded-full text-[#826454]/30 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {activeTab === 'spend' && (
            <>
              <div className="flex justify-between items-end mb-6 border-b border-[#E5D5D5] pb-4">
                <h3 className="font-serif text-2xl text-[#633131]">Expense Log</h3>
                <div className="text-right">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#826454] block">Total spent</span>
                  <span className="font-serif text-xl text-[#2C302E]">Rs. {totalSpent.toLocaleString()}</span>
                </div>
              </div>
              <form onSubmit={addExpense} className="flex gap-3 mb-6 bg-[#FDFBF7] p-3 rounded-2xl border border-[#E5D5D5]">
                <input
                  type="text"
                  value={newExpName}
                  onChange={(e) => setNewExpName(e.target.value)}
                  placeholder="What did you buy?"
                  className="flex-1 bg-transparent px-4 py-2 font-sans text-base outline-none"
                />
                <div className="flex items-center bg-white border border-[#E5D5D5] rounded-xl px-4 w-32">
                  <span className="text-[#826454] text-sm">Rs.</span>
                  <input
                    type="number"
                    value={newExpAmount}
                    onChange={(e) => setNewExpAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-transparent py-2 pl-2 font-sans text-base outline-none"
                  />
                </div>
                <button type="submit" className="bg-[#C69C9C] text-white p-3 px-6 rounded-xl hover:bg-[#B58B8B]">
                  <Plus size={18} />
                </button>
              </form>
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {expenses.map((exp) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-between items-center p-4 hover:bg-[#F9F6F0] bg-white/60 rounded-2xl group border border-transparent hover:border-[#E5D5D5]"
                    >
                      <span className="font-sans text-base text-[#2C302E]">{exp.name}</span>
                      <div className="flex items-center gap-6">
                        <span className="font-serif text-xl text-[#633131]">Rs. {exp.amount.toLocaleString()}</span>
                        <button
                          onClick={() => removeExpense(exp.id)}
                          className="p-2 rounded-full text-[#826454]/30 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* -------------------- Story Timeline -------------------- */
const StoryTimeline: React.FC = () => {
  const [bucketList, setBucketList] = useCloudStorage<BucketItem[]>('sriju_bucket', BUCKET_LIST);
  const toggleBucket = (id: number) =>
    setBucketList(bucketList.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));

  const [customMemories, setCustomMemories] = useCloudStorage<CustomMemory[]>('sriju_new_memories', []);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [memDate, setMemDate] = useState('');
  const [memTitle, setMemTitle] = useState('');
  const [memText, setMemText] = useState('');

  const addMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memTitle.trim() || !memText.trim()) return;
    setCustomMemories([
      ...customMemories,
      {
        id: Date.now(),
        date: memDate.trim() || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        title: memTitle.trim(),
        text: memText.trim(),
      },
    ]);
    setMemDate(''); setMemTitle(''); setMemText(''); setShowAddMemory(false);
  };

  const removeCustomMemory = (id: number) => setCustomMemories(customMemories.filter((m) => m.id !== id));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 py-16 relative z-10"
    >
      <div className="text-center mb-24">
        <h2 className="font-serif text-4xl md:text-6xl text-[#2C302E] mb-6 tracking-wide drop-shadow-sm">
          The Story We Keep Writing
        </h2>
        <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#C69C9C] to-transparent mx-auto" />
      </div>

      <div className="relative border-l-[3px] border-[#C69C9C]/30 ml-6 md:ml-20 space-y-24 mb-32">
        {TIMELINE.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -40, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-150px' }}
            transition={{ duration: 1, type: 'spring' }}
            className="relative pl-10 md:pl-16 group"
          >
            <div className="absolute -left-[11.5px] top-2 w-5 h-5 rounded-full bg-[#FDFBF7] border-[3px] border-[#C69C9C] group-hover:bg-[#C69C9C] group-hover:scale-150 transition-all duration-700" />
            <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-[#E5D5D5] shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-2">
              <span className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#9CA893] block mb-4">{item.date}</span>
              <h3 className="font-serif text-3xl text-[#633131] mb-5">{item.title}</h3>
              <p className="font-sans text-[#4A4343] leading-loose text-base md:text-lg opacity-90">{item.text}</p>
            </div>
          </motion.div>
        ))}

        {customMemories.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -40, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-150px' }}
            transition={{ duration: 1, type: 'spring' }}
            className="relative pl-10 md:pl-16 group"
          >
            <div className="absolute -left-[11.5px] top-2 w-5 h-5 rounded-full bg-[#FDFBF7] border-[3px] border-[#9CA893] group-hover:bg-[#9CA893] group-hover:scale-150 transition-all duration-700" />
            <div className="bg-[#F9FBF7]/70 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-[#DCE6D6] shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-2 relative">
              <button
                onClick={() => removeCustomMemory(item.id)}
                className="absolute top-6 right-6 p-2 rounded-full text-[#826454]/30 hover:text-red-500 hover:bg-white/60 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <span className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#9CA893] block mb-4">{item.date}</span>
              <h3 className="font-serif text-3xl text-[#633131] mb-5">{item.title}</h3>
              <p className="font-sans text-[#4A4343] leading-loose text-base md:text-lg opacity-90">{item.text}</p>
            </div>
          </motion.div>
        ))}

        <div className="print-hide relative pl-10 md:pl-16">
          <div className="absolute -left-[11.5px] top-2 w-5 h-5 rounded-full bg-[#FDFBF7] border-[3px] border-dashed border-[#C69C9C]/60" />
          <button
            onClick={() => setShowAddMemory(true)}
            className="w-full flex items-center justify-center gap-3 p-8 rounded-[2.5rem] border-2 border-dashed border-[#C69C9C]/40 text-[#826454] hover:border-[#C69C9C] hover:text-[#633131] hover:bg-white/40 transition-all font-sans"
          >
            <Plus size={20} /> Add a new memory
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAddMemory && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.form
              onSubmit={addMemory}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FDFBF7] w-full max-w-lg p-8 md:p-10 rounded-[2.5rem] border border-[#E5D5D5] shadow-2xl"
            >
              <h3 className="font-serif text-2xl text-[#633131] mb-6">Add a new memory</h3>
              <div className="space-y-4">
                <input type="text" value={memDate} onChange={(e) => setMemDate(e.target.value)} placeholder="Date (optional — defaults to today)"
                  className="w-full bg-white border border-[#E5D5D5] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#C69C9C]" />
                <input type="text" value={memTitle} onChange={(e) => setMemTitle(e.target.value)} placeholder="Title (e.g. 'Our first road trip')"
                  className="w-full bg-white border border-[#E5D5D5] rounded-xl px-4 py-3 font-sans text-sm outline-none focus:border-[#C69C9C]" required />
                <textarea value={memText} onChange={(e) => setMemText(e.target.value)} placeholder="What happened..."
                  className="w-full h-28 bg-white border border-[#E5D5D5] rounded-xl px-4 py-3 font-sans text-sm outline-none resize-none focus:border-[#C69C9C]" required />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddMemory(false)}
                  className="flex-1 py-3 rounded-xl font-sans text-sm text-[#826454] hover:bg-[#F0EBE1] transition-colors">Cancel</button>
                <button type="submit"
                  className="flex-1 bg-[#9CA893] text-white py-3 rounded-xl font-sans font-medium hover:bg-[#87977E] transition-colors">Save memory</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="max-w-2xl mx-auto bg-[#FDFBF7] p-8 md:p-10 rounded-[3rem] border border-[#E5D5D5] shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#9CA893] rounded-full blur-[100px] opacity-10" />
        <h2 className="font-serif text-3xl text-[#2C302E] mb-2">Our Bucket List</h2>
        <p className="font-sans text-[#826454] mb-8 text-sm">Things we still need to do.</p>
        <div className="space-y-4">
          {bucketList.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleBucket(item.id)}
              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 cursor-pointer transition-colors border border-transparent hover:border-[#E5D5D5]"
            >
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                item.done ? 'bg-[#9CA893] border-[#9CA893]' : 'border-[#C69C9C]'
              }`}>
                {item.done && <CheckCircle size={14} className="text-white" />}
              </div>
              <span className={`font-sans text-base ${item.done ? 'text-[#826454]/50 line-through' : 'text-[#4A4343]'}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* -------------------- Bucket List Section (sticky notes) -------------------- */
const BucketListSection: React.FC = () => {
  const [bucketList, setBucketList] = useCloudStorage<BucketItem[]>('sriju_bucket', BUCKET_LIST);
  const [newItem, setNewItem] = useState('');
  const [adding, setAdding] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const total = bucketList.length;
  const done = bucketList.filter((i) => i.done).length;
  const progress = total ? (done / total) * 100 : 0;
  const allDone = total > 0 && done === total;

  const toggleItem = (id: number) => {
    setBucketList((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const next = { ...i, done: !i.done };
          if (next.done) {
            setCelebrate(true);
            setTimeout(() => setCelebrate(false), 1500);
          }
          return next;
        }
        return i;
      })
    );
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setBucketList([...bucketList, { id: Date.now(), text: newItem.trim(), done: false }]);
    setNewItem('');
    setAdding(false);
  };

  const removeItem = (id: number) => setBucketList(bucketList.filter((i) => i.id !== id));

  const resetAll = () => {
    if (confirm('Start a fresh list? This will uncheck everything.')) {
      setBucketList(bucketList.map((i) => ({ ...i, done: false })));
    }
  };

  // Stable rotation + color per note, derived from id
  const noteStyle = (id: number) => {
    const color = STICKY_COLORS[id % STICKY_COLORS.length];
    const rotation = ((id % 7) - 3) * 1.4;
    return { color, rotation };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 py-16 relative z-10"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <Target className="text-[#C69C9C]" size={36} />
          <h2 className="font-serif text-4xl md:text-6xl text-[#2C302E] tracking-wide">
            Our Bucket List
          </h2>
        </div>
        <p className="font-sans text-[#826454] text-lg italic max-w-2xl mx-auto">
          Little dreams, pinned to a corkboard. Tap one to check it off.
        </p>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] border border-white/60 shadow-sm mb-10">
        <div className="flex justify-between items-end mb-3">
          <span className="font-sans uppercase tracking-widest text-xs text-[#826454]">Progress</span>
          <span className="font-serif text-2xl text-[#633131]">
            {done} <span className="text-[#826454] text-lg">/ {total}</span>
          </span>
        </div>
        <div className="w-full h-3 bg-[#F0EBE1] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C69C9C] to-[#9CA893]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
        {allDone && (
          <p className="font-['Caveat'] text-2xl text-[#633131] text-center mt-4">
            All done. Time to write a new list, my love. ♡
          </p>
        )}
      </div>

      {/* Corkboard */}
      <div
        className="rounded-[2rem] p-6 md:p-10 shadow-inner border-[6px] border-[#8B6F47]"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(0,0,0,0.05) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.05) 0%, transparent 40%), linear-gradient(135deg, #B08A5E 0%, #9A7850 100%)',
          backgroundBlendMode: 'multiply',
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-6">
          {bucketList.map((item) => {
            const { color, rotation } = noteStyle(item.id);
            return (
              <motion.div
                key={item.id}
                initial={false}
                animate={{ rotate: rotation, y: 0, scale: 1 }}
                whileHover={{ rotate: 0, y: -8, scale: 1.05, zIndex: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => toggleItem(item.id)}
                className="relative aspect-square p-4 md:p-5 cursor-pointer shadow-[3px_5px_12px_rgba(0,0,0,0.25)] rounded-sm group select-none"
                style={{
                  backgroundColor: color.bg,
                  backgroundImage:
                    'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 30%, rgba(0,0,0,0.04) 100%)',
                }}
              >
                {/* Pin */}
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-md"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, #fff 0%, ${color.pin} 45%, rgba(0,0,0,0.4) 100%)`,
                  }}
                />

                {/* Text */}
                <p
                  className={`font-['Caveat'] text-xl md:text-2xl leading-tight pr-5 pt-1 break-words transition-all ${
                    item.done ? 'line-through text-[#633131]/50' : 'text-[#3A3020]'
                  }`}
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {item.text}
                </p>

                {/* Delete */}
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                  className="absolute top-1 right-1 p-1 rounded-full text-[#633131]/30 hover:text-red-600 hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Remove note"
                >
                  <X size={12} />
                </button>

                {/* DONE stamp overlay */}
                {item.done && (
                  <motion.div
                    initial={{ scale: 1.5, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: -12 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span
                      className="font-bold text-2xl md:text-3xl tracking-wider px-3 py-1 rounded"
                      style={{
                        color: '#C0392B',
                        border: '3px solid #C0392B',
                        transform: 'rotate(-12deg)',
                        fontFamily: "'Inter', sans-serif",
                        opacity: 0.85,
                      }}
                    >
                      DONE ♡
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Add new note */}
          <motion.div
            initial={false}
            animate={{ rotate: adding ? 0 : 2 }}
            whileHover={{ rotate: 0, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative aspect-square p-4 md:p-5 rounded-sm shadow-[3px_5px_12px_rgba(0,0,0,0.2)]"
            style={{
              backgroundColor: adding ? '#FFFDF0' : 'rgba(255,255,255,0.15)',
              border: '2px dashed rgba(255,255,255,0.6)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full shadow-md"
              style={{ background: 'radial-gradient(circle at 30% 30%, #fff 0%, #D4A373 45%, rgba(0,0,0,0.4) 100%)' }}
            />
            {adding ? (
              <form onSubmit={addItem} className="h-full flex flex-col">
                <textarea
                  autoFocus
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addItem(e as any);
                    }
                    if (e.key === 'Escape') { setAdding(false); setNewItem(''); }
                  }}
                  placeholder="A new little dream..."
                  className="flex-1 bg-transparent resize-none outline-none font-['Caveat'] text-xl text-[#3A3020] placeholder-[#826454]/50"
                />
                <div className="flex justify-end gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => { setAdding(false); setNewItem(''); }}
                    className="p-1.5 rounded-full text-[#826454] hover:bg-black/5"
                  >
                    <X size={14} />
                  </button>
                  <button
                    type="submit"
                    className="p-1.5 rounded-full bg-[#9CA893] text-white hover:bg-[#87977E]"
                  >
                    <CheckCircle size={14} />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setAdding(true)}
                className="w-full h-full flex flex-col items-center justify-center text-white/90 hover:text-white transition-colors"
              >
                <Plus size={36} strokeWidth={1.5} />
                <span className="font-['Caveat'] text-xl mt-1">Add a dream</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {bucketList.length > 0 && (
        <div className="text-center mt-10">
          <button
            onClick={resetAll}
            className="font-sans text-sm text-[#826454] hover:text-[#633131] underline underline-offset-4"
          >
            Reset all notes
          </button>
        </div>
      )}

      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.4, 1], rotate: [0, 15, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="flex flex-col items-center"
            >
              <PartyPopper size={120} className="text-[#C69C9C] drop-shadow-2xl" />
              <p className="font-['Caveat'] text-5xl text-[#633131] mt-4 drop-shadow-lg">Yay!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* -------------------- Letter Section -------------------- */
const LetterSection: React.FC = () => {
  const [activeEnvelope, setActiveEnvelope] = useState<OpenWhenLetter | null>(null);
  const [diaryEntries, setDiaryEntries] = useCloudStorage<DiaryEntry[]>('sriju_diary', []);
  const [newEntry, setNewEntry] = useState('');
  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const saveDiary = () => {
    if (!newEntry.trim()) return;
    setDiaryEntries([{ date: todayStr, text: newEntry, id: Date.now() }, ...diaryEntries]);
    setNewEntry('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center relative z-10"
    >
      <motion.div
        initial={{ rotateX: 10, y: 50 }} animate={{ rotateX: 0, y: 0 }}
        transition={{ duration: 1.5, type: 'spring' }}
        className="bg-[#FDFBF7] p-12 md:p-20 rounded-lg shadow-md border border-[#E5D5D5] relative w-full max-w-3xl transform origin-top bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mb-20"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#D4C6C6] via-[#C69C9C] to-[#9CA893] rounded-t-lg opacity-30" />
        <h2 className="font-serif text-4xl text-[#2C302E] mb-12 border-b-2 border-[#E5D5D5]/50 pb-6 inline-block">For Tingu,</h2>
        <div className="font-serif text-[#4A4343] space-y-10 leading-[2.5] text-xl md:text-2xl">
          <p>I know this really doesn't feel like much.</p>
          <p>I know we have grown really, really far away from each other for this to feel like home again.</p>
          <p>But trust me, Sriju...</p>
          <p>when you come back to the same place every day, it'll one day feel like home again.</p>
          <p className="font-bold text-[#633131] text-3xl italic mt-16 drop-shadow-sm">And you are my home.</p>
        </div>
        <div className="mt-24 text-right">
          <p className="font-['Caveat'] text-5xl text-[#2C302E] rotate-[-5deg] inline-block pr-8">— Jigar</p>
        </div>
      </motion.div>

      <div className="w-full max-w-4xl mx-auto mb-20 bg-white/50 backdrop-blur-md p-10 rounded-[3rem] border border-white shadow-sm flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2 flex flex-col">
          <h2 className="font-serif text-3xl text-[#2C302E] mb-4">Dear Jigar...</h2>
          <p className="font-sans text-[#826454] mb-6">Write back to me, or just write out your thoughts. It stays safely on your device.</p>
          <p className="font-sans text-xs uppercase tracking-widest text-[#9CA893] font-bold mb-2">{todayStr}</p>
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="w-full h-40 bg-[#FDFBF7] border border-[#E5D5D5] rounded-2xl p-4 font-sans text-base outline-none resize-none focus:border-[#C69C9C]"
            placeholder="Today I felt..."
          />
          <button onClick={saveDiary} className="mt-4 bg-[#826454] text-white py-3 rounded-xl font-sans font-medium hover:bg-[#633131] transition-colors">Save Entry</button>
        </div>
        <div className="md:w-1/2 overflow-y-auto max-h-[400px] custom-scrollbar pr-4 space-y-4">
          {diaryEntries.map((entry) => (
            <div key={entry.id} className="bg-white/80 p-5 rounded-2xl border border-[#E5D5D5]">
              <p className="font-sans text-xs uppercase tracking-widest text-[#C69C9C] font-bold mb-3 border-b border-[#E5D5D5] pb-2">{entry.date}</p>
              <p className="font-serif text-[#4A4343] leading-relaxed whitespace-pre-wrap">{entry.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full text-center">
        <h2 className="font-serif text-3xl text-[#2C302E] mb-12 flex items-center justify-center gap-3">
          <Mail className="text-[#C69C9C]" /> "Open When" Letters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          {OPEN_WHEN_LETTERS.map((letter) => (
            <motion.div
              key={letter.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveEnvelope(letter)}
              className="bg-white/60 p-6 rounded-[2rem] border border-[#E5D5D5] shadow-sm cursor-pointer flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden group"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#F5E6E6] rounded-full blur-xl group-hover:bg-[#C69C9C] transition-colors duration-500 opacity-50" />
              <Send size={24} className="text-[#826454] mb-3 group-hover:text-[#633131] transition-colors" />
              <h3 className="font-sans font-medium text-[#2C302E]">{letter.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeEnvelope && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FDFBF7] p-10 md:p-14 rounded-lg max-w-lg w-full shadow-2xl border border-[#E5D5D5] relative text-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"
            >
              <button onClick={() => setActiveEnvelope(null)} className="absolute top-6 right-6 text-[#826454] hover:text-[#2C302E]">Close</button>
              <h3 className="font-serif text-2xl text-[#633131] mb-8 border-b border-[#E5D5D5] pb-4">{activeEnvelope.title}</h3>
              <p className="font-serif text-[#4A4343] text-lg md:text-xl leading-relaxed">{activeEnvelope.msg}</p>
              <p className="font-['Caveat'] text-3xl text-[#2C302E] mt-10 text-right">— Jigar</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* -------------------- Mixtape Panel -------------------- */
interface MixtapePanelProps {
  isOpen: boolean;
  onClose: () => void;
  nowPlaying: NowPlaying | null;
  setNowPlaying: React.Dispatch<React.SetStateAction<NowPlaying | null>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const MixtapePanel: React.FC<MixtapePanelProps> = ({ isOpen, onClose, nowPlaying, setNowPlaying, isPlaying, setIsPlaying }) => {
  const [mixtape, setMixtape] = useCloudStorage<MixtapeSong[]>('sriju_mixtape', [
    { id: 1, title: 'Tum Se Hi', artist: 'Mohit Chauhan', note: 'The song that always plays when I think of you.', youtubeId: undefined },
  ]);
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongNote, setNewSongNote] = useState('');
  const [newSongLink, setNewSongLink] = useState('');

  const isCurrentSong = (song: MixtapeSong) =>
    !!song.youtubeId && nowPlaying?.kind === 'youtube' && nowPlaying.videoId === song.youtubeId;

  const playSong = (song: MixtapeSong) => {
    if (song.youtubeId) {
      if (isCurrentSong(song)) { setIsPlaying((p) => !p); return; }
      setNowPlaying({
        kind: 'youtube', videoId: song.youtubeId, label: song.title,
        sublabel: song.artist && song.artist !== 'Us' ? song.artist : 'Our mixtape',
      });
      setIsPlaying(true);
      return;
    }
    if (song.audioUrl) {
      const isCurrent = nowPlaying?.kind === 'file' && nowPlaying.url === song.audioUrl;
      if (isCurrent) { setIsPlaying((p) => !p); return; }
      setNowPlaying({ kind: 'file', url: song.audioUrl, label: song.title, sublabel: 'Our mixtape' });
      setIsPlaying(true);
    }
  };

  const addSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSongTitle) return;
    const ytId = extractYouTubeId(newSongLink);
    setMixtape([
      ...mixtape,
      {
        id: Date.now(), title: newSongTitle, artist: 'Us', note: newSongNote,
        youtubeId: ytId || undefined,
        audioUrl: !ytId && newSongLink.trim() ? newSongLink.trim() : undefined,
      },
    ]);
    setNewSongTitle(''); setNewSongNote(''); setNewSongLink('');
  };

  const removeSong = (id: number) => setMixtape(mixtape.filter((s) => s.id !== id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#2C302E] z-[115] shadow-2xl border-l border-[#4A4343] overflow-hidden flex flex-col"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: noiseSvg }} />
            <div className="relative z-10 flex flex-col h-full text-[#FDFBF7]">
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/10">
                <div>
                  <h2 className="font-serif text-3xl flex items-center gap-3"><Music className="text-[#C69C9C]" /> Our Mixtape</h2>
                  <p className="font-sans text-[#A3B18A] text-xs mt-1">Songs that belong to us. Tap play — it plays in the corner.</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close mixtape">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-4">
                {mixtape.length === 0 && (
                  <p className="font-['Caveat'] text-2xl text-[#C69C9C] text-center mt-8 opacity-80">No songs yet. Add your first one below.</p>
                )}
                {mixtape.map((song) => (
                  <div key={song.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-sans font-bold text-lg text-white truncate">{song.title}</p>
                        {song.artist && song.artist !== 'Us' && (
                          <p className="font-sans text-xs text-[#A3B18A] mt-0.5">{song.artist}</p>
                        )}
                        <p className="font-['Caveat'] text-xl text-[#C69C9C] mt-2 opacity-90">"{song.note}"</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {(song.youtubeId || song.audioUrl) && (
                          <button
                            onClick={() => playSong(song)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                              isCurrentSong(song) && isPlaying ? 'bg-[#9CA893] text-white' : 'bg-[#C69C9C] text-white hover:bg-[#B58B8B]'
                            }`}
                          >
                            {isCurrentSong(song) && isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                          </button>
                        )}
                        <button
                          onClick={() => removeSong(song.id)}
                          className="p-1.5 rounded-full text-white/30 hover:text-red-400 hover:bg-white/10 transition-all"
                          aria-label="Remove song"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {isCurrentSong(song) && (
                      <p className="font-sans text-[10px] text-[#A3B18A] mt-3 flex items-center gap-1">
                        <Volume2 size={12} /> Playing in the corner player
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 p-6 md:p-8">
                <form onSubmit={addSong} className="flex flex-col gap-2">
                  <input type="text" value={newSongTitle} onChange={(e) => setNewSongTitle(e.target.value)} placeholder="Song name..."
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 font-sans text-sm outline-none text-white focus:border-[#C69C9C] placeholder-white/40" />
                  <input type="text" value={newSongNote} onChange={(e) => setNewSongNote(e.target.value)} placeholder="Why is it our song?"
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 font-sans text-sm outline-none text-white focus:border-[#C69C9C] placeholder-white/40" />
                  <input type="text" value={newSongLink} onChange={(e) => setNewSongLink(e.target.value)} placeholder="YouTube link or direct audio URL (optional)"
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 font-sans text-sm outline-none text-white focus:border-[#C69C9C] placeholder-white/40" />
                  <button type="submit" className="bg-[#C69C9C] text-white py-2 rounded-xl mt-2 font-sans font-medium hover:bg-[#B58B8B] transition-colors">
                    Add to Tape
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* -------------------- Audio Player (global) -------------------- */
interface AudioPlayerProps {
  activeSection: string;
  ambientSound: string;
  nowPlaying: NowPlaying | null;
  setNowPlaying: React.Dispatch<React.SetStateAction<NowPlaying | null>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ activeSection, ambientSound, nowPlaying, setNowPlaying, isPlaying, setIsPlaying }) => {
  const [customTrack, setCustomTrack] = useState<{ url: string; name: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ytHostRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const source: NowPlaying = useMemo(() => {
    if (nowPlaying) return nowPlaying;
    if (customTrack) return { kind: 'file', url: customTrack.url, label: customTrack.name, sublabel: 'Your upload' };
    if (activeSection === 'study') {
      const track = STUDY_TRACKS[ambientSound] || STUDY_TRACKS.piano;
      return { kind: 'file', url: track.url, label: track.label, sublabel: 'Zen sounds' };
    }
    return { kind: 'file', url: '/audio/theme.mp3', label: 'Tum Se Hi', sublabel: 'Our song' };
  }, [nowPlaying, customTrack, activeSection, ambientSound]);

  const sourceKey = source.kind === 'youtube' ? `yt:${source.videoId}` : `file:${source.url}`;

  useEffect(() => {
    const audio = audioRef.current;

    if (source.kind === 'youtube') {
      audio?.pause();
      let cancelled = false;
      loadYouTubeApi()
        .then((YT) => {
          if (cancelled || !ytHostRef.current) return;
          if (!ytPlayerRef.current) {
            ytPlayerRef.current = new YT.Player(ytHostRef.current, {
              videoId: source.videoId,
              playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1, rel: 0, modestbranding: 1 },
              events: {
                onReady: (e: any) => { if (isPlayingRef.current) e.target.playVideo(); },
              },
            });
          } else {
            ytPlayerRef.current.loadVideoById(source.videoId);
            if (!isPlayingRef.current) {
              window.setTimeout(() => {
                try { ytPlayerRef.current?.pauseVideo(); } catch { /* noop */ }
              }, 400);
            }
          }
        })
        .catch(() => { /* offline */ });
      return () => { cancelled = true; };
    }

    try { ytPlayerRef.current?.stopVideo?.(); } catch { /* noop */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey]);

  useEffect(() => {
    if (source.kind === 'youtube') {
      const player = ytPlayerRef.current;
      if (!player?.playVideo) return;
      if (isPlaying) player.playVideo();
      else player.pauseVideo();
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => { /* needs user gesture */ });
    else audio.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, sourceKey]);

  const togglePlay = () => setIsPlaying((p) => !p);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (customTrack) URL.revokeObjectURL(customTrack.url);
    const url = URL.createObjectURL(file);
    setCustomTrack({ url, name: file.name.replace(/\.[^.]+$/, '') });
    setNowPlaying(null);
    setIsPlaying(true);
    e.target.value = '';
  };

  const clearCustom = () => {
    if (customTrack) URL.revokeObjectURL(customTrack.url);
    setCustomTrack(null);
    setIsPlaying(false);
  };

  const stopMixtapeSong = () => { setNowPlaying(null); setIsPlaying(false); };

  return (
    <div className="fixed top-8 left-8 md:left-auto md:right-8 z-[80] bg-white/60 backdrop-blur-xl p-2 rounded-full shadow-sm border border-[#E5D5D5] flex items-center gap-2 md:gap-3 pr-3 md:pr-5 group hover:bg-white/90 transition-colors max-w-[92vw]">
      <audio ref={audioRef} loop src={source.kind === 'file' ? source.url : undefined} />

      <div className="fixed -left-[9999px] top-0 w-[200px] h-[200px] pointer-events-none" aria-hidden="true">
        <div ref={ytHostRef} />
      </div>

      <button
        onClick={togglePlay}
        className="p-3 md:p-4 bg-[#F5E6E6] rounded-full text-[#633131] hover:bg-[#C69C9C] hover:text-white transition-colors flex-shrink-0"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>

      <div className="hidden md:flex flex-col min-w-[100px] max-w-[170px]">
        <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#826454] font-bold truncate">{source.label}</span>
        <span className="text-[10px] font-sans text-[#826454]/70 mt-0.5 truncate">
          {source.kind === 'youtube'
            ? `${isPlaying ? 'Playing' : 'Paused'} · ${source.sublabel || 'YouTube'}`
            : `${isPlaying ? 'Playing' : 'Paused'}${source.sublabel ? ` · ${source.sublabel}` : ''}`}
        </span>
      </div>

      <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleUpload} className="hidden" />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-full bg-[#F0EBE1] text-[#826454] hover:bg-[#C69C9C] hover:text-white transition-colors flex-shrink-0"
        title="Upload your own MP3"
      >
        <Upload size={16} />
      </button>

      {customTrack && (
        <button
          onClick={clearCustom}
          className="p-2 rounded-full bg-[#F0EBE1] text-[#826454] hover:bg-red-400 hover:text-white transition-colors flex-shrink-0"
          title="Remove custom track"
        >
          <Trash2 size={14} />
        </button>
      )}

      {nowPlaying && (
        <button
          onClick={stopMixtapeSong}
          className="p-2 rounded-full bg-[#F0EBE1] text-[#826454] hover:bg-red-400 hover:text-white transition-colors flex-shrink-0"
          title="Stop this song"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

/* -------------------- Easter Egg -------------------- */
const EasterEggTransition: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#2C302E] overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: noiseSvg }} />
      <motion.div
        initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="w-[800px] h-[800px] bg-gradient-to-tr from-[#633131] to-[#C69C9C] rounded-full blur-[100px] opacity-40 absolute"
      />
      <motion.h2
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="font-serif text-5xl md:text-7xl text-[#FDFBF7] relative z-10 tracking-widest text-center px-4"
      >
        The day it all started.
      </motion.h2>
    </motion.div>
  );
};

/* -------------------- App -------------------- */
export default function App() {
  const [hasOpened, setHasOpened] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [appMood, setAppMood] = useState<Mood | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [ambientSound, setAmbientSound] = useState('piano');
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMixtape, setShowMixtape] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-scrollbar::-webkit-scrollbar { width: 6px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #E5D5D5; border-radius: 10px; }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #C69C9C; }
      .hide-scroll::-webkit-scrollbar { display: none; }
      .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      @media print {
        .print-hide { display: none !important; }
        .app-root { background: #FDFBF7 !important; }
        .app-root, .app-root * { box-shadow: none !important; backdrop-filter: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  const bgColor = appMood ? appMood.bgColor : '#F9F6F0';
  const triggerEasterEgg = () => setShowEasterEgg(true);
  const handleEasterEggComplete = () => {
    setShowEasterEgg(false);
    setActiveSection('story');
  };

  const handleSetAmbient = (sound: string) => {
    setNowPlaying(null);
    setAmbientSound(sound);
  };

  return (
    <div
      className="app-root min-h-screen selection:bg-[#C69C9C] selection:text-white relative overflow-x-hidden transition-colors duration-[2000ms] ease-in-out"
      style={{ fontFamily: "'Inter', sans-serif", backgroundColor: bgColor }}
    >
      <div className="absolute inset-0 pointer-events-none mix-blend-multiply print-hide" style={{ backgroundImage: noiseSvg, zIndex: 1 }} />
      <div className="print-hide"><FloatingEnvironment /></div>

      <AnimatePresence>
        {!hasOpened ? (
          <OpeningSequence key="opening" onComplete={() => setHasOpened(true)} />
        ) : showEasterEgg ? (
          <EasterEggTransition key="easter-egg" onComplete={handleEasterEggComplete} />
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="pb-40 relative z-10"
          >
            <div className="print-hide">
              <AudioPlayer
                activeSection={activeSection}
                ambientSound={ambientSound}
                nowPlaying={nowPlaying}
                setNowPlaying={setNowPlaying}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>

            <motion.button
              initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              onClick={() => setShowMixtape(true)}
              className="print-hide fixed top-8 right-4 md:right-auto md:left-8 z-[80] bg-white/60 backdrop-blur-xl p-3 md:p-4 rounded-full shadow-sm border border-[#E5D5D5] flex items-center gap-2 group hover:bg-white/90 transition-colors"
              title="Open Our Mixtape"
            >
              <Music size={18} className="text-[#633131] group-hover:text-[#C69C9C] transition-colors" />
              <span className="hidden md:inline font-sans text-[11px] uppercase tracking-[0.2em] text-[#826454] font-bold">Mixtape</span>
            </motion.button>

            <MixtapePanel
              isOpen={showMixtape}
              onClose={() => setShowMixtape(false)}
              nowPlaying={nowPlaying}
              setNowPlaying={setNowPlaying}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />

            <div className="pt-24 md:pt-20 min-h-[85vh]">
              <AnimatePresence mode="wait">
                {activeSection === 'home' && (
                  <HomeSection key="home" setSection={setActiveSection} triggerEasterEgg={triggerEasterEgg} />
                )}
                {activeSection === 'mood' && (
                  <MoodCorner key="mood" currentMood={appMood} setAppMood={setAppMood} />
                )}
                {activeSection === 'study' && (
                  <StudyCorner key="study" ambientSound={ambientSound} setAmbientSound={handleSetAmbient} />
                )}
                {activeSection === 'finance' && <FinanceCorner key="finance" />}
                {activeSection === 'bucket' && <BucketListSection key="bucket" />}
                {activeSection === 'story' && <StoryTimeline key="story" />}
                {activeSection === 'letter' && <LetterSection key="letter" />}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="print-hide fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] bg-white/70 backdrop-blur-2xl px-4 py-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 flex items-center gap-2 md:gap-4 overflow-x-auto max-w-[95vw] hide-scroll"
            >
              <NavBtn icon={Home} label="Home" isActive={activeSection === 'home'} onClick={() => setActiveSection('home')} />
              <NavBtn icon={Palette} label="Mood" isActive={activeSection === 'mood'} onClick={() => setActiveSection('mood')} />
              <NavBtn icon={Book} label="Study" isActive={activeSection === 'study'} onClick={() => setActiveSection('study')} />
              <NavBtn icon={Coins} label="Finance" isActive={activeSection === 'finance'} onClick={() => setActiveSection('finance')} />
              <NavBtn icon={Target} label="Bucket" isActive={activeSection === 'bucket'} onClick={() => setActiveSection('bucket')} />
              <NavBtn icon={Heart} label="Story" isActive={activeSection === 'story'} onClick={() => setActiveSection('story')} />
              <NavBtn icon={Mail} label="Letter" isActive={activeSection === 'letter'} onClick={() => setActiveSection('letter')} />
              <button
                onClick={() => window.print()}
                className="flex flex-col items-center justify-center p-2 rounded-2xl w-14 h-14 md:w-16 md:h-16 text-[#826454] hover:bg-[#F0EBE1] hover:text-[#633131] transition-all duration-500"
                title="Export what you're viewing as a keepsake PDF"
              >
                <Download size={20} strokeWidth={1.5} className="md:w-[22px] md:h-[22px]" />
                <span className="text-[9px] md:text-[10px] mt-1 font-sans tracking-wide">PDF</span>
              </button>
            </motion.div>

            <div className="text-center py-16 mt-16 relative z-10">
              <p className="font-serif italic text-[#826454] opacity-60 text-lg tracking-wide hover:opacity-100 transition-opacity">
                Made for you, by Jigar ♡
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

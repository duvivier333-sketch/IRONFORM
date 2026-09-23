'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Dumbbell,
  Home,
  Medal,
  Minus,
  Plus,
  RotateCcw,
  Timer,
  TrendingUp,
  UserRound,
} from 'lucide-react';

type View = 'home' | 'workout' | 'rest' | 'book' | 'progress' | 'programs' | 'milestones';

const nav: Array<{ id: View; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'workout', label: 'Train', icon: Dumbbell },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'book', label: 'The Book', icon: BookOpen },
  { id: 'milestones', label: 'Profile', icon: UserRound },
];

const history = [
  ['19 SEP', 'PUSH / A', '2 PR'],
  ['17 SEP', 'PULL / A', '—'],
  ['15 SEP', 'LEGS / A', '1 PR'],
  ['12 SEP', 'PUSH / A', '—'],
  ['10 SEP', 'LEGS / A', '—'],
];

export default function Page() {
  const [view, setView] = useState<View>('home');
  const [weight, setWeight] = useState(100);
  const [reps, setReps] = useState(9);
  const [completed, setCompleted] = useState(false);

  const title = useMemo(() => {
    if (view === 'workout') return 'Bench Press';
    if (view === 'rest') return 'Rest';
    if (view === 'book') return 'The Book';
    if (view === 'progress') return 'Progression';
    if (view === 'programs') return 'Programs';
    if (view === 'milestones') return 'Milestones';
    return 'IRONFORM';
  }, [view]);

  function logSet() {
    setCompleted(true);
    setView('rest');
  }

  return (
    <main className="app-shell">
      <section className="phone">
        <header className="topbar">
          {view !== 'home' ? (
            <button className="icon-button" onClick={() => setView('home')} aria-label="Retour">
              <ArrowLeft size={19} />
            </button>
          ) : (
            <span className="topbar-spacer" />
          )}
          <div className="brand-block">
            <strong>{title}</strong>
            {view === 'workout' && <small>PUSH / A</small>}
          </div>
          <button className="icon-button" aria-label="Réinitialiser"><RotateCcw size={17} /></button>
        </header>

        <div className="screen">
          {view === 'home' && (
            <>
              <section className="hero-card paper-card">
                <div>
                  <p className="eyebrow">FRI 19 SEP 2026</p>
                  <h1>WEEK 03 / 12</h1>
                  <p className="muted">CURRENT PHASE</p>
                  <h2 className="red">BULK</h2>
                  <p className="script">More weight. Stronger tomorrow.</p>
                </div>
                <div className="hero-art" aria-hidden="true">IRON<br />MIND</div>
              </section>

              <section className="stats-grid">
                <article className="paper-card stat"><span>BODYWEIGHT</span><b>82.4 kg</b><small>+1.8 kg since start</small></article>
                <article className="paper-card stat"><span>TODAY'S WORK</span><b>PUSH / A</b><small>6 exercises · 18 work sets</small></article>
              </section>

              <button className="primary" onClick={() => setView('workout')}>START SESSION <ChevronRight size={18} /></button>

              <section className="mini-grid">
                <article><span>Nutrition</span><b>3,240</b><small>KCAL</small></article>
                <article><span>Sleep</span><b>7H42</b><small>GOOD</small></article>
                <article><span>Recovery</span><b className="good">GOOD</b><small>READY</small></article>
              </section>

              <section className="paper-card philosophy">
                <p className="eyebrow">OLD-SCHOOL MINDSET.</p>
                <h3>MODERN METHODOLOGY.</h3>
                <p>Discipline. Consistency. Progression. Freedom.</p>
              </section>
            </>
          )}

          {view === 'workout' && (
            <>
              <div className="tabs"><button className="active">RAMP UP</button><button>WORK SETS</button><button>HISTORY</button></div>
              <section className="paper-card lift-card">
                <div className="lift-icon"><Dumbbell size={42} /></div>
                <p className="muted">WORKING LOAD</p>
                <h1>{weight} KG</h1>
                <div className="set-list">
                  <div><span>1</span><b>Barre × 10</b><Check size={16} /></div>
                  <div><span>2</span><b>60 kg × 6</b><Check size={16} /></div>
                  <div><span>3</span><b>80 kg × 3</b><Check size={16} /></div>
                  <div className="current"><span>4</span><b>90 kg × 1</b><ChevronRight size={16} /></div>
                </div>
              </section>
              <section className="paper-card logging">
                <p className="eyebrow">SET 1 / 3</p>
                <h2>BEAT THE BOOK</h2>
                <p className="muted">LAST SESSION</p><b>100 kg × 8</b>
                <p className="muted">TODAY'S TARGET</p><h1>{weight} kg × {reps}</h1>
                <div className="stepper"><button onClick={() => setWeight(Math.max(20, weight - 2.5))}><Minus /></button><b>{weight} kg</b><button onClick={() => setWeight(weight + 2.5)}><Plus /></button></div>
                <div className="stepper"><button onClick={() => setReps(Math.max(1, reps - 1))}><Minus /></button><b>{reps} reps</b><button onClick={() => setReps(reps + 1)}><Plus /></button></div>
                <div className="rir"><span>RIR</span><button className="active">0</button><button>1</button><button>2</button><button>3+</button></div>
              </section>
              <button className="primary" onClick={logSet}>LOG SET</button>
            </>
          )}

          {view === 'rest' && (
            <>
              <section className="paper-card result-card">
                <p className="eyebrow">SET 1 COMPLETE</p>
                <h1>{weight} kg × {reps}</h1>
                <div className="stamp">BOOK BEATEN</div>
                <b>+1 REP</b>
              </section>
              <section className="rest-panel">
                <p className="eyebrow">REST</p>
                <div className="timer-ring"><Timer size={28} /><b>02:59</b></div>
                <div className="next-set"><span>NEXT SET</span><b>{weight} kg × 8+</b></div>
                <div className="row-actions"><button>+30 SEC</button><button onClick={() => setView('workout')}>SKIP</button></div>
                {completed && <small>THE WORK PAYS OFF.</small>}
              </section>
            </>
          )}

          {view === 'book' && (
            <>
              <div className="tabs"><button className="active">SESSIONS</button><button>PR</button><button>MILESTONES</button></div>
              <section className="paper-card history-card">
                <h2>SEPTEMBER 2026</h2>
                {history.map(([date, session, pr]) => <div className="history-row" key={date}><b>{date}</b><span>{session}</span><em>{pr}</em></div>)}
                <h2>AUGUST 2026</h2>
                {[['31 AUG','LEGS / B','1 PR'],['28 AUG','PULL / B','—'],['26 AUG','PUSH / B','2 PR']].map(([date, session, pr]) => <div className="history-row" key={date}><b>{date}</b><span>{session}</span><em>{pr}</em></div>)}
              </section>
              <button className="secondary" onClick={() => setView('milestones')}>VIEW MILESTONES</button>
            </>
          )}

          {view === 'progress' && (
            <>
              <section className="paper-card chart-card">
                <p className="eyebrow">BENCH PRESS · 1RM ESTIMATED</p>
                <div className="chart">
                  {[72,82,91,102,111,120].map((v, i) => <div className="bar" key={v} style={{height: `${v/1.35}px`}}><span>{i === 5 ? '120 kg' : ''}</span></div>)}
                </div>
                <div className="months"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>SEP</span></div>
              </section>
              <section className="paper-card">
                <h3>BEST PERFORMANCES</h3>
                <div className="history-row"><b>SEP 2026</b><span>120 kg × 6</span><Award size={17} /></div>
                <div className="history-row"><b>JUN 2026</b><span>110 kg × 7</span><span /></div>
                <div className="history-row"><b>MAR 2026</b><span>100 kg × 8</span><span /></div>
                <div className="history-row"><b>JAN 2026</b><span>90 kg × 8</span><span /></div>
              </section>
              <button className="secondary" onClick={() => setView('programs')}>VIEW PROGRAM</button>
            </>
          )}

          {view === 'programs' && (
            <section className="paper-card program-card">
              <p className="eyebrow">CHAPTER 03</p>
              <h1>MASS II</h1>
              <p>12 WEEKS</p>
              <div className="progress-line"><span style={{width:'58%'}} /></div>
              <b>WEEK 07 / 12 · 58%</b>
              <div className="phase done"><Check size={18}/><span><b>Phase I — Foundation</b><small>Weeks 1–4</small></span></div>
              <div className="phase current"><TrendingUp size={18}/><span><b>Phase II — Overload</b><small>Weeks 5–8</small></span></div>
              <div className="phase"><span className="dot"/><span><b>Phase III — Intensification</b><small>Weeks 9–11</small></span></div>
              <div className="phase"><span className="dot"/><span><b>Week 12 — Deload</b><small>Reset. Rebuild.</small></span></div>
            </section>
          )}

          {view === 'milestones' && (
            <section className="paper-card milestones">
              {[
                ['FIRST SESSION','12 JAN 2026'],['FIRST PR','28 JAN 2026'],['100 SESSIONS','19 SEP 2026'],['100 KG BENCH','03 JUN 2026'],['CHAPTER COMPLETE','12 WEEK MASS'],['1 YEAR UNDER THE IRON','12 JAN 2027']
              ].map(([a,b],i)=><div className="milestone" key={a}>{i%2===0?<Medal size={28}/>:<Award size={28}/>}<span><b>{a}</b><small>{b}</small></span></div>)}
            </section>
          )}
        </div>

        <nav className="bottom-nav">
          {nav.map(item => {
            const Icon = item.icon;
            return <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => setView(item.id)}><Icon size={19}/><span>{item.label}</span></button>;
          })}
        </nav>
      </section>
      <aside className="desktop-note">
        <p className="eyebrow">TRAINING LOG FOR A HIGHER STANDARD.</p>
        <h1>IRONFORM</h1>
        <p>Old-school mindset.<br/>Modern methodology.</p>
      </aside>
    </main>
  );
}

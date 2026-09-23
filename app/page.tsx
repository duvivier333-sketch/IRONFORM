'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Award, BarChart3, BookOpen, Check, ChevronRight, Dumbbell, Home,
  Medal, Minus, Plus, RotateCcw, Timer, TrendingUp, UserRound, Zap
} from 'lucide-react';

type View = 'home' | 'workout' | 'book' | 'progress' | 'programs' | 'milestones';
type WorkoutStage = 'ramp' | 'lift' | 'rest' | 'summary';
type WorkSet = { weight:number; reps:number; rir:number; target:number; beaten:boolean; rest:number };

const nav: Array<{ id: View; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'workout', label: 'Train', icon: Dumbbell },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'book', label: 'The Book', icon: BookOpen },
  { id: 'milestones', label: 'Profile', icon: UserRound },
];

const previousSets = [8, 8, 7];
const rampSets = [
  { label:'BAR', weight:20, reps:10 },
  { label:'60 KG', weight:60, reps:6 },
  { label:'80 KG', weight:80, reps:3 },
  { label:'90 KG', weight:90, reps:1 },
];

const historySeed = [
  ['19 SEP', 'PUSH / A', '2 PR'], ['17 SEP', 'PULL / A', '—'], ['15 SEP', 'LEGS / A', '1 PR'],
  ['12 SEP', 'PUSH / A', '—'], ['10 SEP', 'LEGS / A', '—'],
];

function fmt(sec:number){
  const m=Math.floor(sec/60).toString().padStart(2,'0');
  const s=(sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

export default function Page() {
  const [view, setView] = useState<View>('home');
  const [stage, setStage] = useState<WorkoutStage>('ramp');
  const [rampIndex, setRampIndex] = useState(0);
  const [workIndex, setWorkIndex] = useState(0);
  const [weight, setWeight] = useState(100);
  const [reps, setReps] = useState(9);
  const [rir, setRir] = useState(1);
  const [sets, setSets] = useState<WorkSet[]>([]);
  const [rest, setRest] = useState(180);
  const [lastRest, setLastRest] = useState(180);

  const target = useMemo(() => {
    if (workIndex === 0) return previousSets[0] + 1;
    const prev = sets[workIndex - 1];
    if (!prev) return previousSets[workIndex] ?? 8;
    if (prev.reps >= prev.target && prev.rir >= 1) return Math.max(previousSets[workIndex] ?? 8, prev.reps - 1);
    if (prev.reps < prev.target && prev.rir === 0) return Math.max(6, prev.reps + 1);
    return previousSets[workIndex] ?? 8;
  }, [workIndex, sets]);

  useEffect(() => {
    if (stage !== 'rest') return;
    const id = setInterval(() => setRest(v => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (view === 'workout' && stage === 'lift') setReps(target);
  }, [target, view, stage]);

  function startSession(){
    setView('workout'); setStage('ramp'); setRampIndex(0); setWorkIndex(0); setSets([]); setWeight(100); setRir(1);
  }

  function completeRamp(){
    if (rampIndex < rampSets.length - 1) setRampIndex(i=>i+1);
    else { setStage('lift'); setReps(previousSets[0] + 1); }
  }

  function logSet(){
    const beaten = reps > previousSets[workIndex];
    const adaptiveRest = rir === 0 ? 210 : rir >= 3 ? 150 : 180;
    const item:WorkSet = { weight, reps, rir, target, beaten, rest: adaptiveRest };
    const next = [...sets, item];
    setSets(next);
    setLastRest(adaptiveRest);
    if (workIndex >= 2) {
      setStage('summary');
      try { localStorage.setItem('ironform:lastSession', JSON.stringify(next)); } catch {}
    } else {
      setRest(adaptiveRest);
      setStage('rest');
    }
  }

  function nextSet(){ setWorkIndex(i=>i+1); setStage('lift'); setRir(1); }
  function resetWorkout(){ startSession(); }

  const beatenCount = sets.filter(s=>s.beaten).length;
  const totalVolume = sets.reduce((a,s)=>a+s.weight*s.reps,0);

  return (
    <main className="app-shell">
      <section className="phone">
        <header className="topbar">
          {view !== 'home' ? <button className="icon-button" onClick={()=>setView('home')}><ArrowLeft size={19}/></button> : <span/>}
          <div className="brand-block"><strong>{view==='home'?'IRONFORM':view==='workout'?'PUSH / A':view.toUpperCase()}</strong><small>{view==='workout'?'WORKOUT MODE':'BEAT THE BOOK.'}</small></div>
          <button className="icon-button" onClick={resetWorkout}><RotateCcw size={17}/></button>
        </header>

        <div className="screen">
          {view==='home' && <>
            <section className="hero-card paper-card"><div><p className="eyebrow">FRI 19 SEP 2026</p><h1>WEEK 03 / 12</h1><p className="muted">CURRENT PHASE</p><h2 className="red">BULK</h2><p className="script">More weight. Stronger tomorrow.</p></div><div className="hero-art">IRON<br/>MIND</div></section>
            <section className="stats-grid"><article className="paper-card stat"><span>BODYWEIGHT</span><b>82.4 kg</b><small>+1.8 kg since start</small></article><article className="paper-card stat"><span>TODAY'S WORK</span><b>PUSH / A</b><small>Bench focus · 3 work sets</small></article></section>
            <button className="primary" onClick={startSession}>START SESSION <ChevronRight size={18}/></button>
            <section className="paper-card philosophy"><p className="eyebrow">WORKOUT LOOP</p><h3>PREPARE → LIFT → LOG → REST → PROGRESS</h3><p>One clear action at a time.</p></section>
          </>}

          {view==='workout' && stage==='ramp' && <>
            <div className="tabs"><button className="active">RAMP UP</button><button>WORK SETS</button><button>HISTORY</button></div>
            <section className="paper-card lift-card">
              <p className="eyebrow">PREPARE</p><h2>BENCH PRESS</h2><p className="muted">WORKING LOAD</p><h1>100 KG</h1>
              <div className="set-list">{rampSets.map((r,i)=><div key={r.label} className={i===rampIndex?'current':''}><span>{i<rampIndex?<Check size={13}/>:i+1}</span><b>{r.label} × {r.reps}</b>{i<rampIndex?<Check size={16}/>:i===rampIndex?<ChevronRight size={16}/>:<span/>}</div>)}</div>
            </section>
            <section className="paper-card logging"><p className="eyebrow">WHAT DO I DO NOW?</p><h2>{rampSets[rampIndex].label} × {rampSets[rampIndex].reps}</h2><p className="muted">Prepare without creating fatigue.</p></section>
            <button className="primary" onClick={completeRamp}>{rampIndex===rampSets.length-1?'RAMP COMPLETE':'LOG RAMP'} <Check size={18}/></button>
          </>}

          {view==='workout' && stage==='lift' && <>
            <section className="paper-card logging">
              <p className="eyebrow">LIFT · WORK SET {String(workIndex+1).padStart(2,'0')} / 03</p>
              <h2>BEAT THE BOOK</h2>
              <p className="muted">LAST</p><b>100 KG × {previousSets[workIndex]}</b>
              <p className="muted">TODAY'S TARGET</p><h1>{weight} KG × {target}{workIndex>0?'+':''}</h1>
              <div className="coach-strip"><Zap size={16}/><span>NEXT ACTION</span><b>Lift this set, then log the result.</b></div>
            </section>
            <section className="paper-card logging">
              <p className="eyebrow">LOG</p>
              <div className="stepper"><button onClick={()=>setWeight(Math.max(20,weight-2.5))}><Minus/></button><b>{weight} kg</b><button onClick={()=>setWeight(weight+2.5)}><Plus/></button></div>
              <div className="stepper"><button onClick={()=>setReps(Math.max(1,reps-1))}><Minus/></button><b>{reps} reps</b><button onClick={()=>setReps(reps+1)}><Plus/></button></div>
              <div className="rir"><span>RIR</span>{[0,1,2,3].map(v=><button key={v} className={rir===v?'active':''} onClick={()=>setRir(v)}>{v===3?'3+':v}</button>)}</div>
            </section>
            <button className="primary" onClick={logSet}>LOG SET <Check size={18}/></button>
          </>}

          {view==='workout' && stage==='rest' && <>
            <section className="paper-card result-card"><p className="eyebrow">SET {workIndex+1} COMPLETE</p><h1>{sets[sets.length-1]?.weight} kg × {sets[sets.length-1]?.reps}</h1>{sets[sets.length-1]?.beaten?<><div className="stamp">BOOK BEATEN</div><b>+{sets[sets.length-1].reps-previousSets[workIndex]} REP</b></>:<><div className="stamp neutral">LOGGED</div><b>ON TRACK</b></>}</section>
            <section className="rest-panel"><p className="eyebrow">REST · AUTO STARTED</p><div className="timer-ring"><Timer size={28}/><b>{fmt(rest)}</b></div><div className="next-set"><span>NEXT</span><b>BENCH PRESS · SET {workIndex+2} / 03</b><strong>{weight} KG × {targetForNext(workIndex,sets)}+</strong></div>{lastRest!==180&&<p className="rest-reason">{lastRest>180?'+30 SEC · HIGH EFFORT':'-30 SEC · LOW EFFORT'}</p>}<div className="row-actions"><button onClick={()=>setRest(v=>v+30)}>+30 SEC</button><button onClick={nextSet}>{rest===0?'START SET':'READY'}</button></div></section>
          </>}

          {view==='workout' && stage==='summary' && <>
            <section className="paper-card result-card"><p className="eyebrow">SESSION COMPLETE</p><h1>PUSH / A</h1><div className="stamp">DONE</div></section>
            <section className="paper-card summary-grid"><div><span>WORK SETS</span><b>{sets.length}</b></div><div><span>VOLUME</span><b>{totalVolume.toLocaleString()} KG</b></div><div><span>BOOKS BEATEN</span><b>{beatenCount}</b></div><div><span>REST AVG</span><b>{Math.round(sets.reduce((a,s)=>a+s.rest,0)/sets.length/60)} MIN</b></div></section>
            <section className="paper-card"><p className="eyebrow">COACH'S NOTE</p><p>{beatenCount>=2?'Strong session. Progression confirmed. Keep the current load and beat the book again next time.':'Session logged. Keep the load stable and aim to improve reps before adding weight.'}</p></section>
            <button className="primary" onClick={()=>setView('book')}>ADD TO THE BOOK <BookOpen size={18}/></button>
          </>}

          {view==='book' && <><div className="tabs"><button className="active">SESSIONS</button><button>PR</button><button>MILESTONES</button></div><section className="paper-card history-card"><h2>SEPTEMBER 2026</h2>{historySeed.map(([d,s,p])=><div className="history-row" key={d}><b>{d}</b><span>{s}</span><em>{p}</em></div>)}</section></>}

          {view==='progress' && <><section className="paper-card chart-card"><p className="eyebrow">BENCH PRESS · MAIN LIFT</p><div className="chart">{[72,82,91,102,111,120].map((v,i)=><div className="bar" key={v} style={{height:`${v/1.35}px`}}><span>{i===5?'120 kg':''}</span></div>)}</div><div className="months"><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>SEP</span></div></section><button className="secondary" onClick={()=>setView('programs')}>VIEW PROGRAM</button></>}

          {view==='programs' && <section className="paper-card program-card"><p className="eyebrow">CHAPTER 03</p><h1>MASS II</h1><p>12 WEEKS</p><div className="progress-line"><span style={{width:'58%'}}/></div><b>WEEK 07 / 12 · 58%</b><div className="phase done"><Check size={18}/><span><b>Phase I — Foundation</b><small>Weeks 1–4</small></span></div><div className="phase current"><TrendingUp size={18}/><span><b>Phase II — Overload</b><small>Weeks 5–8</small></span></div></section>}

          {view==='milestones' && <section className="paper-card milestones">{[['FIRST SESSION','12 JAN 2026'],['FIRST PR','28 JAN 2026'],['100 SESSIONS','19 SEP 2026'],['100 KG BENCH','03 JUN 2026']].map(([a,b],i)=><div className="milestone" key={a}>{i%2===0?<Medal size={28}/>:<Award size={28}/>}<span><b>{a}</b><small>{b}</small></span></div>)}</section>}
        </div>

        <nav className="bottom-nav">{nav.map(item=>{const Icon=item.icon;return <button key={item.id} className={view===item.id?'active':''} onClick={()=>setView(item.id)}><Icon size={19}/><span>{item.label}</span></button>})}</nav>
      </section>
      <aside className="desktop-note"><p className="eyebrow">TRAINING LOG FOR A HIGHER STANDARD.</p><h1>IRONFORM</h1><p>Old-school mindset.<br/>Modern methodology.</p></aside>
    </main>
  );
}

function targetForNext(workIndex:number, sets:WorkSet[]){
  const last = sets[sets.length-1];
  if (!last) return previousSets[workIndex+1] ?? 8;
  if (last.reps >= last.target && last.rir >= 1) return Math.max(previousSets[workIndex+1] ?? 8, last.reps-1);
  if (last.reps < last.target && last.rir===0) return Math.max(6,last.reps+1);
  return previousSets[workIndex+1] ?? 8;
}

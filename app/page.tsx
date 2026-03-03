'use client';

import Link from 'next/link';
import { useState, useEffect, CSSProperties } from 'react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:          '#07080f',
  surface:     '#0e101c',
  surface2:    '#151825',
  border:      'rgba(255,255,255,0.06)',
  borderHover: 'rgba(255,107,43,0.35)',
  accent:      '#ff6b2b',
  accentSoft:  '#ff8c52',
  green:       '#22d87a',
  text:        '#eef0f8',
  muted:       '#6b7291',
  faint:       'rgba(238,240,248,0.04)',
  fontDisplay: '"Syne", system-ui, sans-serif',
  fontBody:    '"DM Sans", system-ui, sans-serif',
  fontMono:    '"JetBrains Mono", monospace',
};

// ─── Injected <style> ─────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');
  @keyframes mx-float {
    0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)}
  }
  @keyframes mx-up {
    from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)}
  }
  @keyframes mx-pulse {
    0%,100%{opacity:1} 50%{opacity:.35}
  }

  .mx-f1{animation:mx-up .65s .00s ease both}
  .mx-f2{animation:mx-up .65s .12s ease both}
  .mx-f3{animation:mx-up .65s .22s ease both}
  .mx-f4{animation:mx-up .65s .32s ease both}
  .mx-f5{animation:mx-up .65s .44s ease both}
  .mx-float{animation:mx-float 7s ease-in-out infinite}
  .mx-dot{animation:mx-pulse 2s ease-in-out infinite}

  .mx-grad{background:linear-gradient(120deg,#ff6b2b 0%,#ff9d5c 45%,#ffcc80 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

  .mx-card{background:${T.surface};border:1px solid ${T.border};border-radius:18px;transition:border-color .25s,box-shadow .25s,transform .25s}
  .mx-card:hover{border-color:${T.borderHover};box-shadow:0 24px 60px rgba(0,0,0,.45);transform:translateY(-3px)}

  .mx-cat{background:${T.surface};border:1px solid ${T.border};border-radius:16px;padding:22px 14px;text-align:center;cursor:pointer;text-decoration:none;display:block;transition:all .25s}
  .mx-cat:hover{border-color:rgba(255,107,43,.3);background:${T.surface2};transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.4)}

  .mx-primary{position:relative;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-family:${T.fontDisplay};font-weight:700;font-size:14px;letter-spacing:.01em;padding:13px 26px;border-radius:13px;border:none;cursor:pointer;color:#fff;background:linear-gradient(135deg,#ff6b2b,#ff9d5c);transition:box-shadow .25s,transform .2s;text-decoration:none;white-space:nowrap}
  .mx-primary::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent,rgba(255,255,255,.14));opacity:0;transition:opacity .25s}
  .mx-primary:hover{box-shadow:0 8px 32px rgba(255,107,43,.45);transform:translateY(-1px)}
  .mx-primary:hover::after{opacity:1}
  .mx-primary:active{transform:translateY(0)}

  .mx-ghost{display:inline-flex;align-items:center;justify-content:center;font-family:${T.fontDisplay};font-weight:600;font-size:14px;padding:12px 22px;border-radius:13px;border:1px solid ${T.border};cursor:pointer;color:${T.muted};background:transparent;transition:all .2s;text-decoration:none;white-space:nowrap}
  .mx-ghost:hover{border-color:rgba(255,107,43,.35);color:${T.text};background:rgba(255,107,43,.06)}

  .mx-input{width:100%;background:${T.surface2};border:1px solid ${T.border};border-radius:12px;padding:13px 18px;color:${T.text};font-family:${T.fontBody};font-size:15px;outline:none;transition:border-color .2s,box-shadow .2s}
  .mx-input::placeholder{color:${T.muted}}
  .mx-input:focus{border-color:rgba(255,107,43,.5);box-shadow:0 0 0 3px rgba(255,107,43,.1)}

  .mx-nav-a{color:${T.muted};font-size:14px;font-weight:500;text-decoration:none;transition:color .2s}
  .mx-nav-a:hover{color:${T.text}}

  .mx-flink{color:${T.muted};font-size:13px;text-decoration:none;display:block;margin-bottom:10px;transition:color .2s}
  .mx-flink:hover{color:${T.accentSoft}}

  .mx-badge-hot{background:#ff6b2b;color:#fff}
  .mx-badge-new{background:#22d87a;color:#fff}
  .mx-badge-sale{background:#4f8cff;color:#fff}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATS = [
  { name:'Videojuegos', icon:'🎮', count:'2,400+', c:'#4f8cff' },
  { name:'Gift Cards',   icon:'🎁', count:'890+',   c:'#ff6b2b' },
  { name:'Streaming',    icon:'📺', count:'150+',   c:'#e91e8c' },
  { name:'Software',     icon:'💻', count:'680+',   c:'#22d87a' },
  { name:'VPN & Privacidad', icon:'🔒', count:'120+', c:'#f5c518' },
  { name:'Créditos',     icon:'💰', count:'340+',   c:'#a78bfa' },
];

const PRODS = [
  { name:'Xbox Game Pass Ultimate', plat:'Microsoft',  price:'$12.99', old:'$19.99', badge:'HOT',   bc:'mx-badge-hot',  e:'🎮', a:'#107C10' },
  { name:'PlayStation Plus Premium',plat:'Sony',       price:'$17.99', old:'',       badge:'NUEVO', bc:'mx-badge-new',  e:'🕹️', a:'#003791' },
  { name:'Netflix 4K Premium',      plat:'Netflix',    price:'$8.50',  old:'$15.99', badge:'OFERTA',bc:'mx-badge-sale', e:'📺', a:'#e50914' },
  { name:'Spotify Premium 3M',      plat:'Spotify',    price:'$5.99',  old:'',       badge:'',      bc:'',              e:'🎵', a:'#1db954' },
  { name:'Steam Wallet $50',        plat:'Valve',      price:'$48.00', old:'',       badge:'HOT',   bc:'mx-badge-hot',  e:'🎲', a:'#1b2838' },
  { name:'Nintendo eShop $20',      plat:'Nintendo',   price:'$19.50', old:'$20.00', badge:'',      bc:'',              e:'🍄', a:'#e4000f' },
];

const STATS = [
  { v:'250K+',  l:'Clientes activos',  icon:'👥' },
  { v:'98.7%',  l:'Satisfacción',      icon:'⭐' },
  { v:'<2 min', l:'Entrega promedio',  icon:'⚡' },
  { v:'4.2M+',  l:'Códigos vendidos',  icon:'🔑' },
];

const STEPS = [
  { n:'01', icon:'🔍', t:'Elige tu producto',     d:'Explora miles de gift cards, suscripciones y juegos de las mejores plataformas del mundo.' },
  { n:'02', icon:'💳', t:'Paga de forma segura',  d:'Tarjeta, PayPal, criptomonedas y más. Encriptación SSL de extremo a extremo.' },
  { n:'03', icon:'📨', t:'Recibe tu código',       d:'Tu código llega al instante a tu correo y perfil. Listo para activar.' },
];

const REVIEWS = [
  { name:'María García',   h:'@mariadev',  t:'Compré un código de Netflix y lo recibí en 30 segundos. La plataforma más rápida que he usado. ¡Increíble!',                       s:5 },
  { name:'Carlos Mendoza', h:'@carlosh_g', t:'Ya llevo 6 meses comprando aquí. Precios excelentes, entrega inmediata y el soporte responde en minutos.',                         s:5 },
  { name:'Ana Rodríguez',  h:'@anarodz',   t:'Tuve un problema con un código y el soporte lo resolvió de inmediato. Confianza total. Ya no compro en otro lado.',               s:5 },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [email,      setEmail]      = useState('');
  const [subOk,      setSubOk]      = useState(false);
  const [hovered,    setHovered]    = useState<number | null>(null);
  const [mobile,     setMobile]     = useState(false);

  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn(); window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  /* --- common helpers --- */
  const grid = (cols: string): CSSProperties => ({ display:'grid', gridTemplateColumns:cols, gap:18 });
  const row  = (gap=12): CSSProperties => ({ display:'flex', alignItems:'center', gap });
  const col  = (gap=0): CSSProperties  => ({ display:'flex', flexDirection:'column', gap });

  const pageStyle: CSSProperties = {
    background:T.bg, color:T.text, fontFamily:T.fontBody,
    minHeight:'100vh', WebkitFontSmoothing:'antialiased' as const,
  };

  return (
    <div style={pageStyle}>
      <style>{STYLES}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(7,8,15,0.84)', backdropFilter:'blur(24px)',
        WebkitBackdropFilter:'blur(24px)', borderBottom:`1px solid ${T.border}`,
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', ...row(), justifyContent:'space-between', height:64 }}>
          {/* Logo */}
          <Link href="/" style={{ ...row(10), textDecoration:'none' }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#ff6b2b,#ff9d5c)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:'#fff', fontFamily:T.fontDisplay, flexShrink:0 }}>M</div>
            <span style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize:19, color:T.text }}>Mercadox</span>
          </Link>

          {/* Desktop */}
          {!mobile && (
            <div style={row(32)}>
              {['Productos','Categorías','Vendedores','Soporte'].map(l=>(
                <a key={l} href="#" className="mx-nav-a">{l}</a>
              ))}
            </div>
          )}
          {!mobile && (
            <div style={row(10)}>
              <Link href="/login" className="mx-ghost" style={{padding:'10px 20px'}}>Iniciar sesión</Link>
              <Link href="/login" className="mx-primary" style={{padding:'10px 22px'}}>Registrarse →</Link>
            </div>
          )}

          {/* Hamburger */}
          {mobile && (
            <button onClick={()=>setMenuOpen(!menuOpen)} style={{ background:'none', border:'none', cursor:'pointer', ...col(5), padding:8 }}>
              {[0,1,2].map(i=>(
                <span key={i} style={{ display:'block', width:22, height:2, background:T.muted, borderRadius:2, transition:'all .3s',
                  transform: menuOpen&&i===0?'rotate(45deg) translate(4px,5px)': menuOpen&&i===2?'rotate(-45deg) translate(4px,-5px)':'none',
                  opacity: menuOpen&&i===1?0:1,
                }}/>
              ))}
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {mobile && menuOpen && (
          <div style={{ background:T.surface, borderTop:`1px solid ${T.border}`, padding:'16px 20px', ...col(4) }}>
            {['Productos','Categorías','Vendedores','Soporte'].map(l=>(
              <a key={l} href="#" style={{ color:T.muted, fontWeight:500, padding:'10px 0', fontSize:15, textDecoration:'none', borderBottom:`1px solid ${T.border}` }}>{l}</a>
            ))}
            <div style={{ ...col(10), paddingTop:14 }}>
              <Link href="/login" className="mx-ghost" style={{textAlign:'center'}}>Iniciar sesión</Link>
              <Link href="/login" className="mx-primary" style={{textAlign:'center'}}>Registrarse gratis →</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ position:'relative', overflow:'hidden', padding: mobile?'60px 20px 80px':'90px 24px 110px' }}>
        {/* orbs */}
        <div style={{ position:'absolute', top:-200, right:-200, width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,107,43,.13) 0%,transparent 65%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-300, left:-150, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(79,140,255,.07) 0%,transparent 65%)', pointerEvents:'none' }}/>
        {/* grid pattern */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)`, backgroundSize:'60px 60px', pointerEvents:'none' }}/>

        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
          <div style={{ maxWidth:720, margin:'0 auto', textAlign:'center' }}>
            {/* badge */}
            <div className="mx-f1" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,107,43,.08)', border:'1px solid rgba(255,107,43,.2)', borderRadius:99, padding:'6px 16px', marginBottom:30 }}>
              <span className="mx-dot" style={{ width:7, height:7, borderRadius:'50%', background:T.accent, display:'block', flexShrink:0 }}/>
              <span style={{ color:T.accentSoft, fontSize:12, fontWeight:600, letterSpacing:'.03em' }}>+4.2 millones de códigos entregados</span>
            </div>

            <h1 className="mx-f2" style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize: mobile?'2.4rem':'4rem', lineHeight:1.08, marginBottom:22, letterSpacing:'-.02em' }}>
              Códigos digitales.<br/>
              <span className="mx-grad">Entrega inmediata.</span>
            </h1>

            <p className="mx-f3" style={{ color:T.muted, fontSize: mobile?15:17, lineHeight:1.75, marginBottom:38, maxWidth:530, margin:'0 auto 38px' }}>
              El marketplace más rápido y seguro para comprar gift cards, suscripciones y videojuegos. Tu código en segundos.
            </p>

            <div className="mx-f4" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:44 }}>
              <Link href="/login" className="mx-primary" style={{fontSize:15,padding:'14px 30px'}}>Explorar productos →</Link>
              <a href="#categorias" className="mx-ghost" style={{fontSize:15,padding:'14px 28px'}}>Ver categorías</a>
            </div>

            <div className="mx-f5" style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:24 }}>
              {[['✓','Entrega instantánea'],['✓','Pago seguro SSL'],['✓','Garantía de devolución']].map(([icon,text])=>(
                <span key={text} style={{ display:'flex', alignItems:'center', gap:6, color:T.muted, fontSize:13 }}>
                  <span style={{ color:T.green, fontWeight:700 }}>{icon}</span>{text}
                </span>
              ))}
            </div>
          </div>

          {/* ─ Floating hero card ─ */}
          <div className="mx-float" style={{ marginTop:64, display:'flex', justifyContent:'center' }}>
            <div style={{ position:'relative', background:T.surface, border:'1px solid rgba(255,255,255,.08)', borderRadius:22, padding:26, maxWidth:490, width:'100%', boxShadow:'0 50px 100px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.03) inset' }}>
              {/* Glow */}
              <div style={{ position:'absolute', inset:-1, borderRadius:23, background:'linear-gradient(135deg,rgba(255,107,43,.35),rgba(255,107,43,.04),rgba(79,140,255,.18))', opacity:.6, pointerEvents:'none', zIndex:-1 }}/>

              <div style={{ ...row(), justifyContent:'space-between', marginBottom:18 }}>
                <div>
                  <div style={{ fontFamily:T.fontDisplay, fontWeight:700, fontSize:16, marginBottom:4 }}>Xbox Game Pass Ultimate</div>
                  <div style={{ color:T.muted, fontSize:12 }}>3 meses · Todas las plataformas</div>
                </div>
                <span style={{ background:'rgba(255,107,43,.15)', color:T.accent, fontSize:10, fontWeight:800, padding:'4px 10px', borderRadius:8, letterSpacing:'.06em', fontFamily:T.fontDisplay }}>HOT</span>
              </div>

              {/* Code display */}
              <div style={{ background:T.surface2, borderRadius:12, padding:'14px 18px', ...row(), justifyContent:'space-between', marginBottom:18, border:'1px solid rgba(255,107,43,.18)' }}>
                <span style={{ fontFamily:T.fontMono, fontSize:15, letterSpacing:'.18em', color:T.green, fontWeight:600 }}>XXXX-XXXX-XXXX-XXXX</span>
                <button style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)', borderRadius:7, padding:'5px 8px', cursor:'pointer', color:T.muted, fontSize:13 }}>⎘</button>
              </div>

              {/* Platforms */}
              <div style={{ ...row(8), marginBottom:18 }}>
                {['PC','Xbox','Mobile'].map(p=>(
                  <span key={p} style={{ background:T.faint, border:`1px solid ${T.border}`, borderRadius:7, padding:'4px 10px', fontSize:11, color:T.muted, fontWeight:600 }}>{p}</span>
                ))}
              </div>

              <div style={{ ...row(), justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:26, fontWeight:800, fontFamily:T.fontDisplay, lineHeight:1 }}>$12.99</div>
                  <div style={{ color:T.muted, fontSize:11, marginTop:4, ...row(6) }}>
                    <span style={{ textDecoration:'line-through' }}>$19.99</span>
                    <span style={{ color:T.green, fontWeight:700 }}>−35%</span>
                  </div>
                </div>
                <button className="mx-primary" style={{padding:'11px 22px',fontSize:13}}>Comprar ahora</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ padding:'56px 24px', borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns: mobile?'1fr 1fr':'repeat(4,1fr)', gap:24 }}>
          {STATS.map(({v,l,icon})=>(
            <div key={l} style={{ textAlign:'center', padding:'8px 0' }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{icon}</div>
              <div className="mx-grad" style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize: mobile?'1.8rem':'2.2rem', lineHeight:1 }}>{v}</div>
              <div style={{ color:T.muted, fontSize:13, marginTop:6 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section id="categorias" style={{ padding: mobile?'60px 20px':'80px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize: mobile?'1.75rem':'2.2rem', marginBottom:10, letterSpacing:'-.01em' }}>Explora por categoría</h2>
            <p style={{ color:T.muted, fontSize:15 }}>Miles de productos listos para entrega inmediata.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: mobile?'1fr 1fr':'repeat(6,1fr)', gap:14 }}>
            {CATS.map(({name,icon,count,c})=>(
              <a key={name} href="#" className="mx-cat">
                <div style={{ fontSize:34, marginBottom:12 }}>{icon}</div>
                <div style={{ fontFamily:T.fontDisplay, fontWeight:700, fontSize:13, marginBottom:6, color:T.text }}>{name}</div>
                <div style={{ fontSize:11, fontWeight:700, color:c, background:`${c}1a`, borderRadius:6, padding:'3px 8px', display:'inline-block' }}>{count}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section style={{ padding: mobile?'0 20px 60px':'0 24px 80px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ ...row(), justifyContent:'space-between', marginBottom:28 }}>
            <h2 style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize: mobile?'1.5rem':'2rem', letterSpacing:'-.01em' }}>🔥 Más vendidos</h2>
            <a href="#" style={{ color:T.accent, fontSize:13, fontWeight:600, textDecoration:'none' }}>Ver todos →</a>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: mobile?'1fr':'repeat(3,1fr)', gap:18 }}>
            {PRODS.map(({name,plat,price,old,badge,bc,e,a},i)=>(
              <div
                key={name} className="mx-card" style={{ padding:20, cursor:'pointer', position:'relative' }}
                onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
              >
                {/* Image */}
                <div style={{ height:110, borderRadius:12, marginBottom:16, background:`linear-gradient(135deg,${a}28,${a}0a)`, border:`1px solid ${a}20`, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
                  <span style={{ fontSize:42 }}>{e}</span>
                  {badge && <span className={`mx-product-badge ${bc}`} style={{ position:'absolute', top:12, right:12, fontSize:9, fontWeight:800, letterSpacing:'.08em', padding:'4px 9px', borderRadius:7, fontFamily:T.fontDisplay }}>{badge}</span>}
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,.04) 0%,transparent 60%)', opacity: hovered===i?1:0, transition:'opacity .3s' }}/>
                </div>
                <div style={{ fontFamily:T.fontDisplay, fontWeight:700, fontSize:14, marginBottom:4, lineHeight:1.3, color:T.text }}>{name}</div>
                <div style={{ color:T.muted, fontSize:12, marginBottom:16 }}>{plat}</div>
                <div style={{ ...row(), justifyContent:'space-between' }}>
                  <div style={row(6)}>
                    <span style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize:20 }}>{price}</span>
                    {old && <span style={{ color:T.muted, fontSize:11, textDecoration:'line-through' }}>{old}</span>}
                  </div>
                  <button className="mx-primary" style={{padding:'9px 18px',fontSize:12}}>Comprar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: mobile?'60px 20px':'80px 24px', background:T.surface, borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize: mobile?'1.75rem':'2.2rem', marginBottom:10, letterSpacing:'-.01em' }}>Tan simple como 1, 2, 3</h2>
          <p style={{ color:T.muted, marginBottom:54, fontSize:15 }}>Sin complicaciones. Tu código en menos de 2 minutos.</p>
          <div style={{ display:'grid', gridTemplateColumns: mobile?'1fr':'repeat(3,1fr)', gap: mobile?32:0, position:'relative' }}>
            {STEPS.map(({n,icon,t,d},i)=>(
              <div key={n} style={{ padding: mobile?'0':'0 40px', position:'relative' }}>
                {/* connector */}
                {!mobile && i<2 && (
                  <div style={{ position:'absolute', top:26, left:'60%', width:'75%', height:1, background:`linear-gradient(90deg,rgba(255,107,43,.35),transparent)` }}/>
                )}
                <div style={{ width:52, height:52, borderRadius:15, margin:'0 auto 16px', background:'rgba(255,107,43,.1)', border:'1px solid rgba(255,107,43,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{icon}</div>
                <div style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize:10, color:T.accent, letterSpacing:'.1em', marginBottom:8 }}>PASO {n}</div>
                <h3 style={{ fontFamily:T.fontDisplay, fontWeight:700, fontSize:17, marginBottom:10 }}>{t}</h3>
                <p style={{ color:T.muted, fontSize:14, lineHeight:1.75 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section style={{ padding: mobile?'60px 20px':'80px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize: mobile?'1.75rem':'2.2rem', letterSpacing:'-.01em' }}>Lo que dicen nuestros clientes</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: mobile?'1fr':'repeat(3,1fr)', gap:18 }}>
            {REVIEWS.map(({name,h,t,s})=>(
              <div key={name} className="mx-card" style={{ padding:22 }}>
                <div style={{ ...row(2), marginBottom:14 }}>
                  {Array.from({length:s}).map((_,i)=>( <span key={i} style={{ color:'#f5c518', fontSize:14 }}>★</span> ))}
                </div>
                <p style={{ color:T.muted, fontSize:14, lineHeight:1.75, marginBottom:18, fontStyle:'italic' }}>"{t}"</p>
                <div style={row(10)}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${T.accent},#6366f1)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>
                    {name.split(' ').map((w:string)=>w[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600 }}>{name}</div>
                    <div style={{ fontSize:11, color:T.muted }}>{h}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section style={{ padding: mobile?'60px 20px':'80px 24px', background:T.surface, borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ maxWidth:540, margin:'0 auto', textAlign:'center' }}>
          <div style={{ width:52, height:52, borderRadius:15, background:'rgba(255,107,43,.1)', border:'1px solid rgba(255,107,43,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, margin:'0 auto 20px' }}>📬</div>
          <h2 style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize: mobile?'1.6rem':'2rem', marginBottom:12, letterSpacing:'-.01em' }}>Ofertas exclusivas en tu correo</h2>
          <p style={{ color:T.muted, marginBottom:28, fontSize:15 }}>Suscríbete y recibe descuentos de hasta 40% antes que nadie.</p>
          {subOk ? (
            <div style={{ background:'rgba(34,216,122,.08)', border:'1px solid rgba(34,216,122,.25)', borderRadius:14, padding:'16px 24px', color:T.green, fontWeight:600, fontSize:14 }}>
              ✓ ¡Listo! Revisa tu correo para confirmar la suscripción.
            </div>
          ) : (
            <div style={{ display:'flex', gap:10, flexDirection: mobile?'column':'row' }}>
              <input type="email" className="mx-input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@correo.com" style={{flex:1}}/>
              <button className="mx-primary" style={{padding:'13px 22px',fontSize:14}} onClick={()=>email&&setSubOk(true)}>Suscribirme</button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: mobile?'48px 20px':'64px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns: mobile?'1fr 1fr':'1.8fr 1fr 1fr 1fr', gap: mobile?'36px 20px':40, marginBottom:52 }}>
            {/* Brand */}
            <div style={{ gridColumn: mobile?'span 2':'span 1' }}>
              <div style={{ ...row(10), marginBottom:14 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#ff6b2b,#ff9d5c)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:900, color:'#fff', fontFamily:T.fontDisplay }}>M</div>
                <span style={{ fontFamily:T.fontDisplay, fontWeight:800, fontSize:17 }}>Mercadox</span>
              </div>
              <p style={{ color:T.muted, fontSize:13, lineHeight:1.7, maxWidth:230, marginBottom:20 }}>
                El marketplace de códigos digitales más confiable de Latinoamérica.
              </p>
              <div style={row(8)}>
                {['X','D','IG'].map(s=>(
                  <a key={s} href="#" style={{ width:34, height:34, borderRadius:9, background:T.surface2, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.muted, fontSize:11, fontWeight:800, textDecoration:'none' }}>{s}</a>
                ))}
              </div>
            </div>

            {[
              {title:'Producto', links:['Explorar','Categorías','Ofertas','Nuevos']},
              {title:'Empresa',  links:['Sobre nosotros','Blog','Prensa','Carreras']},
              {title:'Soporte',  links:['Centro de ayuda','Contacto','Privacidad','Términos']},
            ].map(({title,links})=>(
              <div key={title}>
                <div style={{ fontFamily:T.fontDisplay, fontWeight:700, fontSize:11, color:T.text, marginBottom:16, letterSpacing:'.06em' }}>{title.toUpperCase()}</div>
                {links.map(l=>(<a key={l} href="#" className="mx-flink">{l}</a>))}
              </div>
            ))}
          </div>

          <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:24, ...row(), justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <p style={{ color:T.muted, fontSize:12 }}>© 2025 Mercadox. Todos los derechos reservados.</p>
            <div style={row(6)}>
              {['Visa','MC','PayPal','BTC'].map(m=>(
                <span key={m} style={{ background:T.surface2, border:`1px solid ${T.border}`, borderRadius:6, padding:'4px 10px', fontSize:10, color:T.muted, fontWeight:700 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
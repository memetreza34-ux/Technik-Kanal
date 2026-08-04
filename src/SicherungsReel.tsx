import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {AlertTriangle, Cable, Flame, Magnet, MessageCircle, Plug, ShieldCheck, Timer, Zap} from 'lucide-react';

export const SICHERUNGS_REEL_TOTAL_FRAMES = 2070;

const palette = {
  background: '#03101f',
  panel: '#081d34',
  panelLight: '#0d2b49',
  blue: '#2ac7ff',
  cyan: '#72e6ff',
  gold: '#ffc857',
  orange: '#ff8c42',
  red: '#ff4d5e',
  white: '#f4fbff',
  muted: '#9fb8ca',
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const ease = Easing.inOut(Easing.cubic);

const range = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {...clamp, easing: ease});

const fade = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, from + 14, to - 14, to], [0, 1, 1, 0], clamp);

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      borderRadius: 38,
      background: 'linear-gradient(145deg, rgba(13,43,73,.96), rgba(4,20,38,.96))',
      border: '2px solid rgba(114,230,255,.22)',
      boxShadow: '0 28px 70px rgba(0,0,0,.38)',
      ...style,
    }}
  >
    {children}
  </div>
);

const Header: React.FC<{kicker: string; title: string; accent?: string}> = ({kicker, title, accent = palette.blue}) => (
  <div style={{position: 'absolute', top: 112, left: 72, right: 72, textAlign: 'center'}}>
    <div style={{fontFamily: 'Arial, sans-serif', fontSize: 27, fontWeight: 900, letterSpacing: 4, color: accent}}>{kicker.toUpperCase()}</div>
    <div style={{marginTop: 14, fontFamily: 'Arial, sans-serif', fontSize: 68, lineHeight: 1.03, fontWeight: 950, color: palette.white}}>{title}</div>
  </div>
);

const Caption: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: 76, right: 165, bottom: 282, display: 'flex', justifyContent: 'center'}}>
    <div style={{maxWidth: 830, padding: '18px 26px 20px', borderRadius: 22, background: 'rgba(3,16,31,.9)', border: '1px solid rgba(114,230,255,.2)', color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 39, lineHeight: 1.16, fontWeight: 850, textAlign: 'center'}}>{children}</div>
  </div>
);

const Breaker: React.FC<{progress: number; label?: string}> = ({progress, label = 'B16'}) => {
  const angle = interpolate(progress, [0, 1], [-18, 34], clamp);
  return (
    <div style={{position: 'relative', width: 320, height: 560, borderRadius: 38, background: 'linear-gradient(145deg,#f7fbff,#c8d6df)', border: '4px solid #90a9b8', boxShadow: `0 35px 90px rgba(0,0,0,.48), 0 0 ${progress * 55}px ${palette.red}66`}}>
      <div style={{position: 'absolute', top: 38, left: 40, color: '#173046', fontFamily: 'Arial, sans-serif', fontWeight: 950, fontSize: 44}}>{label}</div>
      <div style={{position: 'absolute', top: 120, left: 72, width: 176, height: 260, borderRadius: 28, background: '#1b2f3d', boxShadow: 'inset 0 8px 18px rgba(0,0,0,.5)'}}>
        <div style={{position: 'absolute', left: 55, top: 32, width: 66, height: 190, borderRadius: 26, background: 'linear-gradient(180deg,#f9fbfc,#a8bac6)', transformOrigin: '50% 88%', transform: `rotate(${angle}deg)`, boxShadow: '0 10px 18px rgba(0,0,0,.42)'}} />
      </div>
      <div style={{position: 'absolute', left: 42, right: 42, bottom: 48, height: 92, borderRadius: 18, background: '#e9f1f5', border: '2px solid #9fb2bf', display: 'grid', placeItems: 'center', color: progress > .55 ? palette.red : '#1e4e6c', fontFamily: 'Arial, sans-serif', fontSize: 29, fontWeight: 950}}>{progress > .55 ? 'AUSGELÖST' : 'EIN'}</div>
    </div>
  );
};

const CurrentBar: React.FC<{value: number; danger?: boolean}> = ({value, danger = false}) => (
  <div style={{width: 800, height: 88, borderRadius: 50, overflow: 'hidden', background: '#102b43', border: '2px solid rgba(255,255,255,.12)'}}>
    <div style={{height: '100%', width: `${Math.max(4, value * 100)}%`, borderRadius: 50, background: danger ? `linear-gradient(90deg,${palette.orange},${palette.red})` : `linear-gradient(90deg,${palette.blue},${palette.gold},${palette.orange})`, boxShadow: danger ? `0 0 45px ${palette.red}88` : `0 0 30px ${palette.blue}55`}} />
  </div>
);

const Scene: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: fade(frame, from, to)}}>{children}</AbsoluteFill>;
};

export const SicherungsReel: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 24%, #0a3152 0%, ${palette.background} 54%, #010812 100%)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(42,199,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(42,199,255,.035) 1px, transparent 1px)', backgroundSize: '80px 80px'}} />

      <Scene from={0} to={180}>
        <Header kicker="Elektrotechnik klar" title="Warum fliegt die Sicherung raus?" accent={palette.gold} />
        <div style={{position: 'absolute', top: 490, left: 380}}><Breaker progress={range(frame, 65, 125)} /></div>
        <div style={{position: 'absolute', top: 1140, left: 112, width: 370, padding: '24px', borderRadius: 28, background: palette.panel, border: `2px solid ${palette.orange}`, color: palette.orange, textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: 42, fontWeight: 950}}>ÜBERLAST</div>
        <div style={{position: 'absolute', top: 1140, right: 112, width: 370, padding: '24px', borderRadius: 28, background: palette.panel, border: `2px solid ${palette.red}`, color: palette.red, textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: 42, fontWeight: 950}}>KURZSCHLUSS</div>
        <Caption>Meistens gibt es zwei Ursachen: Überlast oder Kurzschluss.</Caption>
      </Scene>

      <Scene from={180} to={390}>
        <Header kicker="Aufgabe" title="Er schützt die Leitung" />
        <Card style={{position: 'absolute', top: 520, left: 130, right: 130, height: 580, display: 'grid', placeItems: 'center'}}>
          <Cable size={190} color={range(frame, 230, 350) > .55 ? palette.red : palette.blue} />
          <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center', color: palette.muted, fontFamily: 'Arial, sans-serif', fontSize: 34, fontWeight: 900}}>LEITUNG WIRD ZU WARM</div>
          <div style={{position: 'absolute', bottom: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><ShieldCheck size={130} color={palette.blue} /></div>
        </Card>
        <Caption>Der Leitungsschutzschalter schützt vor zu hoher Erwärmung.</Caption>
      </Scene>

      <Scene from={390} to={630}>
        <Header kicker="Ursache 1" title="Zu viele Geräte: Überlast" accent={palette.orange} />
        <div style={{position: 'absolute', top: 520, left: 95, right: 95, display: 'flex', justifyContent: 'space-between'}}>
          {['Heizung', 'Wasserkocher', 'Ofen'].map((name, index) => (
            <Card key={name} style={{width: 270, height: 250, display: 'grid', placeItems: 'center', borderColor: frame > 420 + index * 45 ? `${palette.orange}88` : undefined}}>
              <Plug size={74} color={frame > 420 + index * 45 ? palette.orange : palette.blue} />
              <div style={{marginTop: -42, color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 31, fontWeight: 900}}>{name}</div>
            </Card>
          ))}
        </div>
        <div style={{position: 'absolute', top: 880, left: 140}}><CurrentBar value={interpolate(range(frame, 410, 590), [0, 1], [.18, 1], clamp)} /></div>
        <div style={{position: 'absolute', top: 1010, left: 0, right: 0, textAlign: 'center', color: palette.orange, fontFamily: 'Arial, sans-serif', fontSize: 50, fontWeight: 950}}>STROM ZU HOCH</div>
        <Caption>Bei Überlast ist der Strom zu hoch, aber nicht schlagartig extrem.</Caption>
      </Scene>

      <Scene from={630} to={870}>
        <Header kicker="Thermisch" title="Das Bimetall braucht Zeit" accent={palette.orange} />
        <Card style={{position: 'absolute', top: 510, left: 180, right: 180, height: 600}}>
          <div style={{position: 'absolute', top: 88, left: 70, color: palette.muted, fontFamily: 'Arial, sans-serif', fontSize: 31, fontWeight: 900}}>THERMISCHER AUSLÖSER</div>
          <div style={{position: 'absolute', top: 260, left: 100, width: 430, height: 40, borderRadius: 20, background: `linear-gradient(90deg,${palette.blue},${palette.orange})`, transformOrigin: '0 50%', transform: `rotate(${interpolate(range(frame, 650, 830), [0, 1], [0, 28], clamp)}deg)`, boxShadow: `0 0 ${interpolate(range(frame, 650, 830), [0, 1], [12, 60], clamp)}px ${palette.orange}88`}} />
          <Timer size={110} color={palette.gold} style={{position: 'absolute', right: 80, bottom: 85}} />
          <Flame size={95} color={palette.orange} style={{position: 'absolute', left: 100, bottom: 80}} />
        </Card>
        <Caption>Das Bimetall erwärmt sich und löst zeitverzögert aus.</Caption>
      </Scene>

      <Scene from={870} to={1080}>
        <Header kicker="Ursache 2" title="Kurzschluss: Strom steigt sofort" accent={palette.red} />
        <Card style={{position: 'absolute', top: 520, left: 110, right: 110, height: 570}}>
          <div style={{position: 'absolute', left: 80, top: 175, width: 390, height: 50, borderRadius: 30, background: '#d65d4a', transform: `rotate(${interpolate(range(frame, 900, 980), [0, 1], [-8, 8], clamp)}deg)`, transformOrigin: '100% 50%'}} />
          <div style={{position: 'absolute', right: 80, top: 335, width: 390, height: 50, borderRadius: 30, background: '#4d8bd6', transform: `rotate(${interpolate(range(frame, 900, 980), [0, 1], [8, -8], clamp)}deg)`, transformOrigin: '0 50%'}} />
          <Zap size={165} color={palette.gold} style={{position: 'absolute', left: 350, top: 195, filter: `drop-shadow(0 0 ${range(frame, 950, 1000) * 60}px ${palette.red})`, transform: `scale(${interpolate(range(frame, 950, 1000), [0, 1], [.2, 1.15], clamp)})`}} />
        </Card>
        <div style={{position: 'absolute', top: 1150, left: 140}}><CurrentBar value={range(frame, 945, 985)} danger /></div>
        <Caption>Beim Kurzschluss steigt der Strom schlagartig an.</Caption>
      </Scene>

      <Scene from={1080} to={1290}>
        <Header kicker="Magnetisch" title="Der Schnellauslöser trennt" accent={palette.red} />
        <Card style={{position: 'absolute', top: 510, left: 175, right: 175, height: 610}}>
          <Magnet size={170} color={palette.blue} style={{position: 'absolute', left: 90, top: 205, filter: `drop-shadow(0 0 ${range(frame, 1100, 1180) * 45}px ${palette.blue})`}} />
          <div style={{position: 'absolute', right: interpolate(range(frame, 1100, 1180), [0, 1], [90, 230], clamp), top: 245, width: 180, height: 115, borderRadius: 24, background: '#d5e1e8', border: '4px solid #819aaa'}} />
          <div style={{position: 'absolute', right: 70, top: 180, width: 24, height: 250, background: palette.red, transformOrigin: '50% 90%', transform: `rotate(${interpolate(range(frame, 1100, 1180), [0, 1], [0, 25], clamp)}deg)`}} />
          <div style={{position: 'absolute', bottom: 72, left: 0, right: 0, textAlign: 'center', color: palette.red, fontFamily: 'Arial, sans-serif', fontSize: 56, fontWeight: 950}}>FAST SOFORT</div>
        </Card>
        <Caption>Der magnetische Auslöser öffnet den Stromkreis sehr schnell.</Caption>
      </Scene>

      <Scene from={1290} to={1500}>
        <Header kicker="Merksatz" title="Zwei Fehler – zwei Reaktionen" accent={palette.gold} />
        <div style={{position: 'absolute', top: 500, left: 75, right: 75, display: 'flex', justifyContent: 'space-between'}}>
          <Card style={{width: 440, height: 640, padding: '54px 42px', borderColor: `${palette.orange}77`}}>
            <Timer size={84} color={palette.orange} />
            <div style={{marginTop: 32, color: palette.orange, fontFamily: 'Arial, sans-serif', fontSize: 50, fontWeight: 950}}>ÜBERLAST</div>
            <div style={{marginTop: 34, color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 36, lineHeight: 1.18, fontWeight: 850}}>Bimetall wird warm und löst verzögert aus.</div>
            <div style={{marginTop: 70, color: palette.orange, fontFamily: 'Arial, sans-serif', fontSize: 58, fontWeight: 950}}>LANGSAMER</div>
          </Card>
          <Card style={{width: 440, height: 640, padding: '54px 42px', borderColor: `${palette.red}77`}}>
            <Magnet size={84} color={palette.red} />
            <div style={{marginTop: 32, color: palette.red, fontFamily: 'Arial, sans-serif', fontSize: 50, fontWeight: 950}}>KURZSCHLUSS</div>
            <div style={{marginTop: 34, color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 36, lineHeight: 1.18, fontWeight: 850}}>Magnet zieht an und trennt den Stromkreis.</div>
            <div style={{marginTop: 70, color: palette.red, fontFamily: 'Arial, sans-serif', fontSize: 58, fontWeight: 950}}>SEHR SCHNELL</div>
          </Card>
        </div>
        <Caption>Überlast ist meist langsamer, Kurzschluss sehr schnell.</Caption>
      </Scene>

      <Scene from={1500} to={1710}>
        <Header kicker="Richtig reagieren" title="Erst Geräte ausschalten" />
        <div style={{position: 'absolute', top: 530, left: 100, right: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Card style={{width: 360, height: 390, display: 'grid', placeItems: 'center', opacity: interpolate(range(frame, 1510, 1590), [0, 1], [1, .25], clamp), transform: `translateY(${range(frame, 1510, 1590) * 75}px)`}}>
            <Plug size={145} color={palette.blue} />
            <div style={{marginTop: -120, color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 40, fontWeight: 950}}>GERÄTE AUS</div>
          </Card>
          <div style={{color: palette.gold, fontFamily: 'Arial, sans-serif', fontSize: 92, fontWeight: 950}}>→</div>
          <Breaker progress={interpolate(range(frame, 1580, 1660), [0, 1], [1, 0], clamp)} />
        </div>
        <Caption>Geräte ausschalten und den Schalter nur einmal zurücksetzen.</Caption>
      </Scene>

      <Scene from={1710} to={1890}>
        <Header kicker="Grenze" title="Löst er erneut aus?" accent={palette.red} />
        <div style={{position: 'absolute', top: 510, left: 380}}><Breaker progress={range(frame, 1740, 1790)} /></div>
        <Card style={{position: 'absolute', top: 1160, left: 125, right: 125, padding: '34px 40px', display: 'flex', gap: 24, alignItems: 'center', borderColor: palette.red}}>
          <AlertTriangle size={78} color={palette.red} />
          <div style={{color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 39, lineHeight: 1.16, fontWeight: 900}}>Nicht ständig zurücksetzen. Ursache fachgerecht prüfen lassen.</div>
        </Card>
        <Caption>Niemals an spannungsführenden Teilen arbeiten.</Caption>
      </Scene>

      <Scene from={1890} to={2070}>
        <Header kicker="Wichtig" title="Leitungsschutz ist nicht FI" accent={palette.gold} />
        <div style={{position: 'absolute', top: 495, left: 170, right: 170, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{transform: 'scale(.72)'}}><Breaker progress={0} label="LSS" /></div>
          <Card style={{width: 330, height: 560, display: 'grid', placeItems: 'center', background: 'linear-gradient(145deg,#f7fbff,#c8d6df)'}}>
            <div style={{fontFamily: 'Arial, sans-serif', fontSize: 68, fontWeight: 950, color: '#173046'}}>FI</div>
            <ShieldCheck size={145} color={palette.blue} />
            <div style={{fontFamily: 'Arial, sans-serif', fontSize: 31, fontWeight: 900, color: '#173046', textAlign: 'center'}}>ANDERE<br />SCHUTZAUFGABE</div>
          </Card>
        </div>
        <Card style={{position: 'absolute', left: 115, right: 115, bottom: 260, padding: '38px 42px', borderColor: palette.gold, textAlign: 'center'}}>
          <MessageCircle size={62} color={palette.blue} />
          <div style={{marginTop: 14, color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 45, fontWeight: 950}}>Kommentiere</div>
          <div style={{marginTop: 8, color: palette.gold, fontFamily: 'Arial, sans-serif', fontSize: 78, fontWeight: 950, letterSpacing: 2}}>SICHERUNG</div>
          <div style={{marginTop: 16, color: palette.muted, fontFamily: 'Arial, sans-serif', fontSize: 31, fontWeight: 800}}>für den Lernzettel mit beiden Auslösearten</div>
        </Card>
      </Scene>
    </AbsoluteFill>
  );
};

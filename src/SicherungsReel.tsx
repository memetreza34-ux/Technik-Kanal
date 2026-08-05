import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {AlertTriangle, Cable, Magnet, MessageCircle, Plug, ShieldCheck, Timer} from 'lucide-react';
import {
  BreakerTripAnimation,
  CurrentLevelBar,
  MagneticInstantTripAnimation,
  ShortCircuitContactAnimation,
  ThermalBimetalTripAnimation,
} from './animation-library';

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
        <div style={{position: 'absolute', top: 490, left: 380}}>
          <BreakerTripAnimation progress={range(frame, 65, 125)} />
        </div>
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
        <div style={{position: 'absolute', top: 880, left: 140}}>
          <CurrentLevelBar value={interpolate(range(frame, 410, 590), [0, 1], [.18, 1], clamp)} label="Strom im Leiter" valueLabel="steigt" />
        </div>
        <div style={{position: 'absolute', top: 1040, left: 0, right: 0, textAlign: 'center', color: palette.orange, fontFamily: 'Arial, sans-serif', fontSize: 50, fontWeight: 950}}>STROM ZU HOCH</div>
        <Caption>Bei Überlast ist der Strom zu hoch, aber nicht schlagartig extrem.</Caption>
      </Scene>

      <Scene from={630} to={870}>
        <Header kicker="Thermisch" title="Das Bimetall braucht Zeit" accent={palette.orange} />
        <div style={{position: 'absolute', top: 510, left: 180}}>
          <ThermalBimetalTripAnimation progress={range(frame, 650, 830)} width={720} height={600} />
        </div>
        <Caption>Das Bimetall erwärmt sich und löst zeitverzögert aus.</Caption>
      </Scene>

      <Scene from={870} to={1080}>
        <Header kicker="Ursache 2" title="Kurzschluss: Strom steigt sofort" accent={palette.red} />
        <div style={{position: 'absolute', top: 520, left: 110}}>
          <ShortCircuitContactAnimation progress={range(frame, 900, 1000)} />
        </div>
        <div style={{position: 'absolute', top: 1150, left: 140}}>
          <CurrentLevelBar value={range(frame, 945, 985)} danger label="Kurzschlussstrom" valueLabel="sprunghaft" />
        </div>
        <Caption>Beim Kurzschluss steigt der Strom schlagartig an.</Caption>
      </Scene>

      <Scene from={1080} to={1290}>
        <Header kicker="Magnetisch" title="Der Schnellauslöser trennt" accent={palette.red} />
        <div style={{position: 'absolute', top: 510, left: 175}}>
          <MagneticInstantTripAnimation progress={range(frame, 1100, 1180)} />
        </div>
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
          <BreakerTripAnimation progress={interpolate(range(frame, 1580, 1660), [0, 1], [1, 0], clamp)} />
        </div>
        <Caption>Geräte ausschalten und den Schalter nur einmal zurücksetzen.</Caption>
      </Scene>

      <Scene from={1710} to={1890}>
        <Header kicker="Grenze" title="Löst er erneut aus?" accent={palette.red} />
        <div style={{position: 'absolute', top: 510, left: 380}}>
          <BreakerTripAnimation progress={range(frame, 1740, 1790)} />
        </div>
        <Card style={{position: 'absolute', top: 1160, left: 125, right: 125, padding: '34px 40px', display: 'flex', gap: 24, alignItems: 'center', borderColor: palette.red}}>
          <AlertTriangle size={78} color={palette.red} />
          <div style={{color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 39, lineHeight: 1.16, fontWeight: 900}}>Nicht ständig zurücksetzen. Ursache fachgerecht prüfen lassen.</div>
        </Card>
        <Caption>Niemals an spannungsführenden Teilen arbeiten.</Caption>
      </Scene>

      <Scene from={1890} to={2070}>
        <Header kicker="Wichtig" title="Leitungsschutz ist nicht FI" accent={palette.gold} />
        <div style={{position: 'absolute', top: 495, left: 170, right: 170, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <BreakerTripAnimation progress={0} label="LSS" width={230} height={403} />
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

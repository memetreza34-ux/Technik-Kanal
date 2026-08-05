import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {AlertTriangle, Cable, Magnet, MessageCircle, Plug, ShieldCheck, Timer} from 'lucide-react';
import {
  BreakerTripAnimation,
  CurrentLevelBar,
  MagneticInstantTripAnimation,
  ShortCircuitContactAnimation,
  ThermalBimetalTripAnimation,
} from './animation-library';
import runtimeJson from './generated/reel-runtime.json';

type RuntimeScene = {
  id: string;
  title: string;
  fromFrame: number;
  toFrame: number;
  imagePath?: string;
};

type RuntimeCaption = {
  fromFrame: number;
  toFrame: number;
  text: string;
};

type RuntimeSfx = {
  id: string;
  path: string;
  fromFrame: number;
  volume: number;
};

type ReelRuntime = {
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  voiceoverPath?: string;
  scenes: RuntimeScene[];
  captions: RuntimeCaption[];
  sfx: RuntimeSfx[];
};

const runtime = runtimeJson as ReelRuntime;
export const SICHERUNGS_REEL_TOTAL_FRAMES = Math.max(1, runtime.totalFrames);
export const SICHERUNGS_REEL_FPS = runtime.fps || 30;
export const SICHERUNGS_REEL_WIDTH = runtime.width || 1080;
export const SICHERUNGS_REEL_HEIGHT = runtime.height || 1920;

const baseBounds = [0, 180, 390, 630, 870, 1080, 1290, 1500, 1710, 1890, 2070];

const mapBaseFrame = (baseFrame: number) => {
  const lastBaseFrame = baseBounds[baseBounds.length - 1] ?? 2070;
  const clamped = Math.max(baseBounds[0], Math.min(lastBaseFrame, baseFrame));
  const index = Math.min(
    runtime.scenes.length - 1,
    Math.max(0, baseBounds.findIndex((bound, candidate) => candidate < baseBounds.length - 1 && clamped >= bound && clamped <= baseBounds[candidate + 1])),
  );
  const baseFrom = baseBounds[index] ?? 0;
  const baseTo = baseBounds[index + 1] ?? 2070;
  const scene = runtime.scenes[index];
  if (!scene || baseTo <= baseFrom) return Math.round((clamped / 2070) * SICHERUNGS_REEL_TOTAL_FRAMES);
  const progress = (clamped - baseFrom) / (baseTo - baseFrom);
  return Math.round(scene.fromFrame + progress * (scene.toFrame - scene.fromFrame));
};

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

const fade = (frame: number, from: number, to: number) => {
  const transition = Math.min(14, Math.max(3, Math.floor((to - from) / 5)));
  return interpolate(frame, [from, from + transition, to - transition, to], [0, 1, 1, 0], clamp);
};

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
  <div style={{position: 'absolute', top: 112, left: 72, right: 72, textAlign: 'center', zIndex: 5}}>
    <div style={{fontFamily: 'Arial, sans-serif', fontSize: 27, fontWeight: 900, letterSpacing: 4, color: accent}}>{kicker.toUpperCase()}</div>
    <div style={{marginTop: 14, fontFamily: 'Arial, sans-serif', fontSize: 68, lineHeight: 1.03, fontWeight: 950, color: palette.white, textShadow: '0 4px 18px rgba(0,0,0,.8)'}}>{title}</div>
  </div>
);

const Caption: React.FC<{children: React.ReactNode}> = () => null;

const Scene: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: fade(frame, from, to)}}>{children}</AbsoluteFill>;
};

const RuntimeImageLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = runtime.scenes.find((candidate) => frame >= candidate.fromFrame && frame < candidate.toFrame);
  if (!scene?.imagePath) return null;
  const progress = interpolate(frame, [scene.fromFrame, scene.toFrame], [0, 1], clamp);
  const scale = 1.03 + progress * 0.05;
  const translateX = interpolate(progress, [0, 1], [-10, 10]);
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(scene.imagePath)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateX(${translateX}px)`,
          opacity: 0.72,
        }}
      />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(3,16,31,.72) 0%, rgba(3,16,31,.18) 36%, rgba(3,16,31,.38) 65%, rgba(3,16,31,.88) 100%)'}} />
    </AbsoluteFill>
  );
};

const SyncedCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const caption = runtime.captions.find((candidate) => frame >= candidate.fromFrame && frame < candidate.toFrame);
  if (!caption) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: '76%',
        left: 90,
        right: 90,
        transform: 'translateY(-50%)',
        zIndex: 20,
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontSize: 52,
        lineHeight: 1.08,
        fontWeight: 950,
        textAlign: 'center',
        textShadow: '0 4px 5px rgba(0,0,0,1), 0 0 16px rgba(0,0,0,.95)',
      }}
    >
      {caption.text}
    </div>
  );
};

const RuntimeAudio: React.FC = () => (
  <>
    {runtime.voiceoverPath ? <Audio src={staticFile(runtime.voiceoverPath)} volume={1} /> : null}
    {runtime.sfx.map((effect) => (
      <Sequence key={effect.id} from={effect.fromFrame}>
        <Audio src={staticFile(effect.path)} volume={effect.volume} />
      </Sequence>
    ))}
  </>
);

export const SicherungsReel: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 24%, #0a3152 0%, ${palette.background} 54%, #010812 100%)`, overflow: 'hidden'}}>
      <RuntimeAudio />
      <RuntimeImageLayer />
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(42,199,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(42,199,255,.035) 1px, transparent 1px)', backgroundSize: '80px 80px'}} />

      <Scene from={mapBaseFrame(0)} to={mapBaseFrame(180)}>
        <Header kicker="Elektrotechnik klar" title="Warum fliegt die Sicherung raus?" accent={palette.gold} />
        <div style={{position: 'absolute', top: 490, left: 380}}>
          <BreakerTripAnimation progress={range(frame, mapBaseFrame(65), mapBaseFrame(125))} />
        </div>
        <div style={{position: 'absolute', top: 1140, left: 112, width: 370, padding: '24px', borderRadius: 28, background: palette.panel, border: `2px solid ${palette.orange}`, color: palette.orange, textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: 42, fontWeight: 950}}>ÜBERLAST</div>
        <div style={{position: 'absolute', top: 1140, right: 112, width: 370, padding: '24px', borderRadius: 28, background: palette.panel, border: `2px solid ${palette.red}`, color: palette.red, textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: 42, fontWeight: 950}}>KURZSCHLUSS</div>
        <Caption>Meistens gibt es zwei Ursachen: Überlast oder Kurzschluss.</Caption>
      </Scene>

      <Scene from={mapBaseFrame(180)} to={mapBaseFrame(390)}>
        <Header kicker="Aufgabe" title="Er schützt die Leitung" />
        <Card style={{position: 'absolute', top: 520, left: 130, right: 130, height: 580, display: 'grid', placeItems: 'center'}}>
          <Cable size={190} color={range(frame, mapBaseFrame(230), mapBaseFrame(350)) > .55 ? palette.red : palette.blue} />
          <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center', color: palette.muted, fontFamily: 'Arial, sans-serif', fontSize: 34, fontWeight: 900}}>LEITUNG WIRD ZU WARM</div>
          <div style={{position: 'absolute', bottom: 80, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}><ShieldCheck size={130} color={palette.blue} /></div>
        </Card>
        <Caption>Der Leitungsschutzschalter schützt vor zu hoher Erwärmung.</Caption>
      </Scene>

      <Scene from={mapBaseFrame(390)} to={mapBaseFrame(630)}>
        <Header kicker="Ursache 1" title="Zu viele Geräte: Überlast" accent={palette.orange} />
        <div style={{position: 'absolute', top: 520, left: 95, right: 95, display: 'flex', justifyContent: 'space-between'}}>
          {['Heizung', 'Wasserkocher', 'Ofen'].map((name, index) => (
            <Card key={name} style={{width: 270, height: 250, display: 'grid', placeItems: 'center', borderColor: frame > mapBaseFrame(420 + index * 45) ? `${palette.orange}88` : undefined}}>
              <Plug size={74} color={frame > mapBaseFrame(420 + index * 45) ? palette.orange : palette.blue} />
              <div style={{marginTop: -42, color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 31, fontWeight: 900}}>{name}</div>
            </Card>
          ))}
        </div>
        <div style={{position: 'absolute', top: 880, left: 140}}>
          <CurrentLevelBar value={interpolate(range(frame, mapBaseFrame(410), mapBaseFrame(590)), [0, 1], [.18, 1], clamp)} label="Strom im Leiter" valueLabel="steigt" />
        </div>
        <div style={{position: 'absolute', top: 1040, left: 0, right: 0, textAlign: 'center', color: palette.orange, fontFamily: 'Arial, sans-serif', fontSize: 50, fontWeight: 950}}>STROM ZU HOCH</div>
        <Caption>Bei Überlast ist der Strom zu hoch, aber nicht schlagartig extrem.</Caption>
      </Scene>

      <Scene from={mapBaseFrame(630)} to={mapBaseFrame(870)}>
        <Header kicker="Thermisch" title="Das Bimetall braucht Zeit" accent={palette.orange} />
        <div style={{position: 'absolute', top: 510, left: 180}}>
          <ThermalBimetalTripAnimation progress={range(frame, mapBaseFrame(650), mapBaseFrame(830))} width={720} height={600} />
        </div>
        <Caption>Das Bimetall erwärmt sich und löst zeitverzögert aus.</Caption>
      </Scene>

      <Scene from={mapBaseFrame(870)} to={mapBaseFrame(1080)}>
        <Header kicker="Ursache 2" title="Kurzschluss: Strom steigt sofort" accent={palette.red} />
        <div style={{position: 'absolute', top: 520, left: 110}}>
          <ShortCircuitContactAnimation progress={range(frame, mapBaseFrame(900), mapBaseFrame(1000))} />
        </div>
        <div style={{position: 'absolute', top: 1150, left: 140}}>
          <CurrentLevelBar value={range(frame, mapBaseFrame(945), mapBaseFrame(985))} danger label="Kurzschlussstrom" valueLabel="sprunghaft" />
        </div>
        <Caption>Beim Kurzschluss steigt der Strom schlagartig an.</Caption>
      </Scene>

      <Scene from={mapBaseFrame(1080)} to={mapBaseFrame(1290)}>
        <Header kicker="Magnetisch" title="Der Schnellauslöser trennt" accent={palette.red} />
        <div style={{position: 'absolute', top: 510, left: 175}}>
          <MagneticInstantTripAnimation progress={range(frame, mapBaseFrame(1100), mapBaseFrame(1180))} />
        </div>
        <Caption>Der magnetische Auslöser öffnet den Stromkreis sehr schnell.</Caption>
      </Scene>

      <Scene from={mapBaseFrame(1290)} to={mapBaseFrame(1500)}>
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

      <Scene from={mapBaseFrame(1500)} to={mapBaseFrame(1710)}>
        <Header kicker="Richtig reagieren" title="Erst Geräte ausschalten" />
        <div style={{position: 'absolute', top: 530, left: 100, right: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Card style={{width: 360, height: 390, display: 'grid', placeItems: 'center', opacity: interpolate(range(frame, mapBaseFrame(1510), mapBaseFrame(1590)), [0, 1], [1, .25], clamp), transform: `translateY(${range(frame, mapBaseFrame(1510), mapBaseFrame(1590)) * 75}px)`}}>
            <Plug size={145} color={palette.blue} />
            <div style={{marginTop: -120, color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 40, fontWeight: 950}}>GERÄTE AUS</div>
          </Card>
          <div style={{color: palette.gold, fontFamily: 'Arial, sans-serif', fontSize: 92, fontWeight: 950}}>→</div>
          <BreakerTripAnimation progress={interpolate(range(frame, mapBaseFrame(1580), mapBaseFrame(1660)), [0, 1], [1, 0], clamp)} />
        </div>
        <Caption>Geräte ausschalten und den Schalter nur einmal zurücksetzen.</Caption>
      </Scene>

      <Scene from={mapBaseFrame(1710)} to={mapBaseFrame(1890)}>
        <Header kicker="Grenze" title="Löst er erneut aus?" accent={palette.red} />
        <div style={{position: 'absolute', top: 510, left: 380}}>
          <BreakerTripAnimation progress={range(frame, mapBaseFrame(1740), mapBaseFrame(1790))} />
        </div>
        <Card style={{position: 'absolute', top: 1160, left: 125, right: 125, padding: '34px 40px', display: 'flex', gap: 24, alignItems: 'center', borderColor: palette.red}}>
          <AlertTriangle size={78} color={palette.red} />
          <div style={{color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 39, lineHeight: 1.16, fontWeight: 900}}>Nicht ständig zurücksetzen. Ursache fachgerecht prüfen lassen.</div>
        </Card>
        <Caption>Niemals an spannungsführenden Teilen arbeiten.</Caption>
      </Scene>

      <Scene from={mapBaseFrame(1890)} to={mapBaseFrame(2070)}>
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

      <SyncedCaptions />
    </AbsoluteFill>
  );
};

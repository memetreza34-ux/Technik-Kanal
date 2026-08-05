import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ELECTRICAL_COLORS, PremiumElectricalIcon} from '@elektrotechnik/core';
import {AlertTriangle, Cable, CircuitBoard, Gauge, Magnet, ShieldCheck} from 'lucide-react';

const samples = [
  {title: 'Normalzustand', icon: Cable, color: ELECTRICAL_COLORS.current},
  {title: 'Messung', icon: Gauge, color: ELECTRICAL_COLORS.currentSoft},
  {title: 'Schutz', icon: ShieldCheck, color: ELECTRICAL_COLORS.success},
  {title: 'Mechanismus', icon: Magnet, color: ELECTRICAL_COLORS.explanation},
  {title: 'Schaltung', icon: CircuitBoard, color: ELECTRICAL_COLORS.overload},
  {title: 'Fehler', icon: AlertTriangle, color: ELECTRICAL_COLORS.fault},
];

export const ElectricalLayoutGallery: React.FC = () => (
  <AbsoluteFill style={{background: ELECTRICAL_COLORS.background, padding: '90px 70px', fontFamily: 'Arial, sans-serif', color: ELECTRICAL_COLORS.text}}>
    <div style={{fontSize: 58, fontWeight: 950}}>Elektrotechnik Layout Gallery</div>
    <div style={{marginTop: 18, fontSize: 28, color: ELECTRICAL_COLORS.muted}}>Wiederverwendbare Zustände, Icons und Akzentfarben</div>
    <div style={{marginTop: 70, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34}}>
      {samples.map((sample, index) => (
        <div key={sample.title} style={{height: 320, borderRadius: 34, background: 'linear-gradient(145deg, rgba(13,43,73,.96), rgba(4,20,38,.96))', border: `2px solid ${sample.color}55`, display: 'grid', placeItems: 'center', textAlign: 'center'}}>
          <PremiumElectricalIcon icon={sample.icon} color={sample.color} delay={index * 3} />
          <div style={{marginTop: -70, fontSize: 34, fontWeight: 900, color: sample.color}}>{sample.title}</div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);

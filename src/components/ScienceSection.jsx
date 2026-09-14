// ponytail: modular science breakdown section with clinical skin cross-section and bio-active callouts
import React from 'react';
import skinScienceImg from '../assets/skin_science.jpg';

export default function ScienceSection() {
  const sciencePoints = [
    {
      step: '01 / Degradation',
      title: 'Aging skin appearance',
      desc: 'As skin ages, natural fibroblast collagen synthesis decelerates by 1% each year. Environmental oxidation and UV exposure break down the dermal moisture matrix, producing surface creasing.',
      activeTag: 'UV Damage & Collagen Loss'
    },
    {
      step: '02 / Bio-Signaling',
      title: 'Phyto-peptide effect',
      desc: 'Bio-fermented peptide complexes and retinoids trigger the regeneration of healthy new skin cells, stimulating micro-circulation and rebuilding structural elastin density from within.',
      activeTag: 'Peptide Cellular Re-densification'
    },
    {
      step: '03 / Restructuring',
      title: 'Smoother, firmer results',
      desc: 'Multi-depth hyaluronic acid and squalane lock hydration deep into the extracellular matrix, leaving skin visibly smoother, elastic, and fortified against future environmental stress.',
      activeTag: 'Restored Dermal Matrix'
    }
  ];

  return (
    <section className="hims-science-section" id="science-section">
      <div className="science-section-header">
        <span className="science-eyebrow">DERMATOLOGICAL BIOLOGY</span>
        <h2 className="hims-section-title">
          The cellular science behind our anti-aging skin care
        </h2>
      </div>

      <div className="hims-science-diagram-card">
        <img
          src={skinScienceImg}
          alt="Clinical cross-section diagram of skin dermal layers"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="hims-science-grid">
        {sciencePoints.map((item, idx) => (
          <div className="science-grid-card" key={idx}>
            <span className="science-step-num">{item.step}</span>
            <h3 className="science-item-title">{item.title}</h3>
            <p className="science-item-text">{item.desc}</p>
            <div className="science-active-tag">{item.activeTag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

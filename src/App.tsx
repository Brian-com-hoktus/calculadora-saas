import { ChangeEvent, useMemo, useState } from 'react';

type RateTier = {
  min: number;
  max: number;
  price: number;
};

const conversationTiers: RateTier[] = [
  { min: 1, max: 2000, price: 160 },
  { min: 2001, max: 10000, price: 140 },
  { min: 10001, max: 30000, price: 90 },
  { min: 30001, max: 60000, price: 70 },
  { min: 60001, max: 2000000, price: 60 }
];

const backgroundTiers: RateTier[] = [
  { min: 1, max: 500, price: 1500 },
  { min: 501, max: 1000, price: 1300 },
  { min: 1001, max: 5000, price: 1100 },
  { min: 5001, max: 10000, price: 1000 },
  { min: 10001, max: 100000, price: 500 }
];

const documentTiers: RateTier[] = [
  { min: 1, max: 2000, price: 160 },
  { min: 2001, max: 10000, price: 140 },
  { min: 10001, max: 30000, price: 120 },
  { min: 30001, max: 60000, price: 100 },
  { min: 60001, max: 2000000, price: 80 }
];

const contractTiers: RateTier[] = [
  { min: 1, max: 100, price: 1500 },
  { min: 101, max: 500, price: 1300 },
  { min: 501, max: 2500, price: 1100 },
  { min: 2501, max: 10000, price: 1000 },
  { min: 10001, max: 100000, price: 600 }
];

const getRateForQuantity = (tiers: RateTier[], quantity: number) => {
  const tier = tiers.find((tierItem) => quantity >= tierItem.min && quantity <= tierItem.max);
  return tier ? tier.price : tiers[tiers.length - 1].price;
};

const formatCLP = (value: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
};

function App() {
  const [people, setPeople] = useState(5);

  const results = useMemo(() => {
    const conversations = Math.max(1, people * 20);
    const advanced = Math.round(conversations * 0.4);
    const documentPages = advanced * 12;
    const contracts = people;

    const conversationPrice = getRateForQuantity(conversationTiers, conversations);
    const backgroundPrice = getRateForQuantity(backgroundTiers, advanced);
    const documentPrice = getRateForQuantity(documentTiers, documentPages);
    const contractPrice = getRateForQuantity(contractTiers, contracts);

    const total =
      conversations * conversationPrice +
      advanced * backgroundPrice +
      documentPages * documentPrice +
      contracts * contractPrice;

    return {
      conversations,
      advanced,
      documentPages,
      contracts,
      total
    };
  }, [people]);

  const metrics = [
    { label: 'Conversaciones', value: results.conversations },
    { label: 'Revisiones', value: results.advanced },
    { label: 'Documentos', value: results.documentPages },
    { label: 'Contratos', value: results.contracts }
  ];

  return (
    <div className="app-shell">
      <header className="hero hero-landing">
        <div className="hero-copy">
          <span className="eyebrow">Hoktus</span>
          <h1>Tu operación de reclutamiento en tiempo real</h1>
          <p>
            Ajusta cuántas personas quieres contratar y obtén una proyección instantánea del volumen que requiere tu proceso.
          </p>

          <div className="hero-meta">
            <div>
              <strong>{people.toLocaleString('es-CL')}</strong>
              <span>Personas</span>
            </div>
            <div>
              <strong>{formatCLP(results.total)}</strong>
              <span>Estimación</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-dot" />
            <div className="visual-graph">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="visual-footer">
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </header>

      <main className="content-grid landing-grid">
        <section className="controls-card landing-card">
          <div className="field-group">
            <label htmlFor="people">Personas a contratar</label>
            <input
              id="people"
              type="range"
              min="1"
              max="200"
              step="1"
              value={people}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setPeople(Number(event.target.value))}
            />
            <div className="range-value">{people.toLocaleString('es-CL')} personas</div>
          </div>

          <div className="summary-metrics landing-metrics">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value.toLocaleString('es-CL')}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="result-card landing-card total-card">
          <div className="result-header">
            <span>Estimación de operación</span>
            <strong>{formatCLP(results.total)}</strong>
          </div>
          <p className="result-note">Proyección sin detalle de costos, directo desde la lógica de volumen.</p>
          <div className="pill-grid">
            <div>
              <strong>{results.conversations.toLocaleString('es-CL')}</strong>
              <span>Conversaciones</span>
            </div>
            <div>
              <strong>{results.documentPages.toLocaleString('es-CL')}</strong>
              <span>Páginas de documentos</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

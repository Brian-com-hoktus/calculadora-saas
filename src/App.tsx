import { ChangeEvent, useMemo, useState } from 'react';

type RateTier = {
  min: number;
  max: number;
  price: number;
};

const conversationTiers: RateTier[] = [
  { min: 1, max: 2000, price: 140 },
  { min: 2001, max: 10000, price: 120 },
  { min: 10001, max: 30000, price: 80 },
  { min: 30001, max: 60000, price: 60 },
  { min: 60001, max: 2000000, price: 50 }
];

const backgroundTiers: RateTier[] = [
  { min: 1, max: 500, price: 1400 },
  { min: 501, max: 1000, price: 1200 },
  { min: 1001, max: 5000, price: 1000 },
  { min: 5001, max: 10000, price: 900 },
  { min: 10001, max: 100000, price: 500 }
];

const documentTiers: RateTier[] = [
  { min: 1, max: 2000, price: 120 },
  { min: 2001, max: 10000, price: 110 },
  { min: 10001, max: 30000, price: 100 },
  { min: 30001, max: 60000, price: 80 },
  { min: 60001, max: 2000000, price: 60 }
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
  const [billing, setBilling] = useState<'Mensual' | 'Semestral' | 'Anual'>('Mensual');

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

    const discountRate = billing === 'Semestral' ? 0.1 : billing === 'Anual' ? 0.2 : 0;
    const discountedTotal = Math.round(total * (1 - discountRate));

    const plan =
      total <= 500000
        ? 'Basic'
        : total <= 3000000
        ? 'Pro'
        : total <= 10000000
        ? 'Max'
        : 'Enterprise';

    return {
      conversations,
      advanced,
      documentPages,
      contracts,
      total,
      discountedTotal,
      discountRate,
      plan,
      costPerPerson: Math.round(discountedTotal / people)
    };
  }, [people, billing]);

  return (
    <div className="app-shell">
      <header className="hero hero-landing">
        <div className="hero-copy">
          <span className="eyebrow">Hoktus</span>
          <h1>Tu operación de reclutamiento en tiempo real</h1>
          <p>
            Ajusta cuántas personas quieres contratar y obtén el costo por contratado al instante.
          </p>

          <div className="hero-meta">
            <div>
              <strong>{people.toLocaleString('es-CL')}</strong>
              <span>Personas</span>
            </div>
            <div>
              <strong>{formatCLP(results.costPerPerson)}</strong>
              <span>Costo por persona</span>
            </div>
            <div>
              <strong>{formatCLP(results.discountedTotal)}</strong>
              <span>Total del plan</span>
            </div>
            <div>
              <strong>{results.plan}</strong>
              <span>Plan estimado</span>
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
            <div className="person-input-row">
              <input
                id="people"
                type="number"
                min="1"
                max="10000"
                value={people}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setPeople(Math.max(1, Math.min(10000, Number(event.target.value))))}
              />
              <span className="person-input-label">personas</span>
            </div>
            <input
              type="range"
              min="1"
              max="10000"
              step="1"
              value={people}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setPeople(Number(event.target.value))}
            />
          </div>

          <div className="billing-card">
            <span>Facturación</span>
            <div className="billing-options">
              {(['Mensual', 'Semestral', 'Anual'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={billing === option ? 'billing-button active' : 'billing-button'}
                  onClick={() => setBilling(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <p className="result-note">
            Calculamos el costo por persona y el costo total del plan según la nueva escala y las tasas históricas.
          </p>
        </section>

        <section className="result-card landing-card total-card">
          <div className="result-header">
            <span>Tarifa por contratado</span>
            <strong>{formatCLP(results.costPerPerson)}</strong>
          </div>
          <p className="result-note">Esta cifra refleja el costo dividido entre las personas contratadas, sin desglose de operaciones.</p>

          {results.discountRate > 0 ? (
            <div className="discount-summary">
              <div>
                <span>Precio base</span>
                <strong>{formatCLP(results.total)}</strong>
              </div>
              <div>
                <span>Descuento {Math.round(results.discountRate * 100)}%</span>
                <strong>{formatCLP(results.total - results.discountedTotal)}</strong>
              </div>
              <div>
                <span>Total con descuento</span>
                <strong>{formatCLP(results.discountedTotal)}</strong>
              </div>
            </div>
          ) : (
            <div className="discount-summary">
              <span>Sin descuento</span>
              <strong>{formatCLP(results.total)}</strong>
            </div>
          )}

          <div className="summary-metrics landing-metrics">
            <div>
              <span>Conversaciones</span>
              <strong>{results.conversations.toLocaleString('es-CL')}</strong>
            </div>
            <div>
              <span>Revisiones de antecedentes</span>
              <strong>{results.advanced.toLocaleString('es-CL')}</strong>
            </div>
            <div>
              <span>Revi AI de documentos</span>
              <strong>{results.documentPages.toLocaleString('es-CL')}</strong>
            </div>
            <div>
              <span>Contratos enviados</span>
              <strong>{results.contracts.toLocaleString('es-CL')}</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

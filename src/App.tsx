import { ChangeEvent, useMemo, useState } from 'react';

type Plan = 'Basic' | 'Pro' | 'Max' | 'Enterprise';

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

const planData: Record<Plan, { label: string; description: string; baseFee: number; discount: number }> = {
  Basic: {
    label: 'Básico',
    description: 'Ideal para proyectos pequeños y primeros pilotos.',
    baseFee: 0,
    discount: 0
  },
  Pro: {
    label: 'Pro',
    description: 'Perfecto para equipos que exigen más análisis y soporte.',
    baseFee: 50000,
    discount: 0.05
  },
  Max: {
    label: 'Max',
    description: 'Para operaciones de alto volumen con mayor optimización.',
    baseFee: 120000,
    discount: 0.1
  },
  Enterprise: {
    label: 'Enterprise',
    description: 'Plan personalizado con soporte dedicado y acuerdos SLA.',
    baseFee: 250000,
    discount: 0.15
  }
};

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
  const [plan, setPlan] = useState<Plan>('Pro');
  const [conversations, setConversations] = useState(2000);
  const planOptions = Object.keys(planData) as Plan[];

  const results = useMemo(() => {
    const recruited = Math.round(conversations * 0.05);
    const advanced = Math.round(conversations * 0.4);
    const documentPages = advanced * 12;
    const contracts = recruited;

    const conversationPrice = getRateForQuantity(conversationTiers, conversations);
    const backgroundPrice = getRateForQuantity(backgroundTiers, advanced);
    const documentPrice = getRateForQuantity(documentTiers, documentPages);
    const contractPrice = getRateForQuantity(contractTiers, contracts);

    const conversationCost = conversations * conversationPrice;
    const backgroundCost = advanced * backgroundPrice;
    const documentCost = documentPages * documentPrice;
    const contractCost = contracts * contractPrice;

    const subtotal = conversationCost + backgroundCost + documentCost + contractCost;
    const planInfo = planData[plan];
    const discount = subtotal * planInfo.discount;
    const total = planInfo.baseFee + subtotal - discount;

    return {
      recruited,
      advanced,
      documentPages,
      contracts,
      conversationPrice,
      backgroundPrice,
      documentPrice,
      contractPrice,
      conversationCost,
      backgroundCost,
      documentCost,
      contractCost,
      subtotal,
      discount,
      total,
      baseFee: planInfo.baseFee
    };
  }, [conversations, plan]);

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <span className="eyebrow">Calculadora SaaS</span>
          <h1>Precio automático según volumen y uso</h1>
          <p>
            Ajusta el número de conversaciones y descubre el costo estimado de cada componente: conversaciones,
            revisiones de antecedentes, documentos y contratos.
          </p>
        </div>
        <div className="plan-card">
          <strong>{planData[plan].label}</strong>
          <p>{planData[plan].description}</p>
          <p>
            Tarifa base: <strong>{formatCLP(planData[plan].baseFee)}</strong>
          </p>
          <p>Descuento: {Math.round(planData[plan].discount * 100)}%</p>
        </div>
      </header>

      <main className="content-grid">
        <section className="controls-card">
          <div className="field-group">
            <label htmlFor="plan">Selecciona un plan</label>
            <select
              id="plan"
              value={plan}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => setPlan(event.target.value as Plan)}
            >
              {planOptions.map((option) => (
                <option key={option} value={option}>
                  {planData[option].label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="conversations">Conversaciones mensuales</label>
            <input
              id="conversations"
              type="range"
              min="100"
              max="200000"
              step="100"
              value={conversations}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setConversations(Number(event.target.value))}
            />
            <div className="range-value">{conversations.toLocaleString('es-CL')} conversaciones</div>
          </div>

          <div className="summary-metrics">
            <div>
              <span>Reclutamiento (5%)</span>
              <strong>{results.recruited.toLocaleString('es-CL')} personas</strong>
            </div>
            <div>
              <span>Avances a revisión (40%)</span>
              <strong>{results.advanced.toLocaleString('es-CL')} personas</strong>
            </div>
            <div>
              <span>Páginas de documentos</span>
              <strong>{results.documentPages.toLocaleString('es-CL')} páginas</strong>
            </div>
            <div>
              <span>Contratos</span>
              <strong>{results.contracts.toLocaleString('es-CL')} envíos</strong>
            </div>
          </div>
        </section>

        <section className="result-card">
          <h2>Detalle de costos</h2>
          <div className="cost-row">
            <div>
              <span>Conversaciones</span>
              <small>{conversations.toLocaleString('es-CL')} × {formatCLP(results.conversationPrice)}</small>
            </div>
            <strong>{formatCLP(results.conversationCost)}</strong>
          </div>
          <div className="cost-row">
            <div>
              <span>Revisión de antecedentes</span>
              <small>{results.advanced.toLocaleString('es-CL')} × {formatCLP(results.backgroundPrice)}</small>
            </div>
            <strong>{formatCLP(results.backgroundCost)}</strong>
          </div>
          <div className="cost-row">
            <div>
              <span>Revi AI (documentos)</span>
              <small>{results.documentPages.toLocaleString('es-CL')} × {formatCLP(results.documentPrice)}</small>
            </div>
            <strong>{formatCLP(results.documentCost)}</strong>
          </div>
          <div className="cost-row">
            <div>
              <span>Contratos con firma</span>
              <small>{results.contracts.toLocaleString('es-CL')} × {formatCLP(results.contractPrice)}</small>
            </div>
            <strong>{formatCLP(results.contractCost)}</strong>
          </div>

          <div className="divider" />

          <div className="cost-row small">
            <span>Subtotal</span>
            <strong>{formatCLP(results.subtotal)}</strong>
          </div>
          <div className="cost-row small">
            <span>Tarifa base del plan</span>
            <strong>{formatCLP(results.baseFee)}</strong>
          </div>
          <div className="cost-row small">
            <span>Descuento de plan</span>
            <strong>-{formatCLP(results.discount)}</strong>
          </div>

          <div className="total-row">
            <span>Total estimado</span>
            <strong>{formatCLP(results.total)}</strong>
          </div>
        </section>
      </main>

      <section className="info-section">
        <h2>Cómo funciona</h2>
        <p>
          La calculadora usa tus conversaciones mensuales para estimar automáticamente el volumen de reclutamiento,
          revisiones de antecedentes, páginas de documentos y contratos. Los precios se ajustan en tramos para cada
          componente, de modo que el costo por unidad baja al aumentar el volumen.
        </p>
        <div className="tier-grid">
          <div>
            <strong>Conversaciones</strong>
            <p>1-2.000: $160</p>
            <p>2.001-10.000: $140</p>
            <p>10.001-30.000: $90</p>
            <p>30.001-60.000: $70</p>
            <p>60.001+: $60</p>
          </div>
          <div>
            <strong>Antecedentes</strong>
            <p>1-500: $1.500</p>
            <p>501-1.000: $1.300</p>
            <p>1.001-5.000: $1.100</p>
            <p>5.001-10.000: $1.000</p>
            <p>10.001+: $500</p>
          </div>
          <div>
            <strong>Documentos</strong>
            <p>1-2.000: $160</p>
            <p>2.001-10.000: $140</p>
            <p>10.001-30.000: $120</p>
            <p>30.001-60.000: $100</p>
            <p>60.001+: $80</p>
          </div>
          <div>
            <strong>Contratos</strong>
            <p>1-100: $1.500</p>
            <p>101-500: $1.300</p>
            <p>501-2.500: $1.100</p>
            <p>2.501-10.000: $1.000</p>
            <p>10.001+: $600</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;

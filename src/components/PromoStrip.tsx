interface PromoCardConfig {
  title: string;
  ctaLabel: string;
  imageUrl?: string;
  onClick: () => void;
}

interface PromoStripProps {
  cards: PromoCardConfig[];
}

export default function PromoStrip({ cards }: PromoStripProps) {
  return (
    <div className="promo-strip">
      {cards.map((card) => (
        <button
          key={card.title}
          className="promo-card"
          onClick={card.onClick}
          aria-label={card.ctaLabel}
        >
          {card.imageUrl && (
            <img className="promo-card-image" src={card.imageUrl} alt="" />
          )}
          <div className="promo-card-overlay" />
          <div className="promo-card-content">
            <p className="promo-card-title">{card.title}</p>
            <span className="promo-card-cta">{card.ctaLabel}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

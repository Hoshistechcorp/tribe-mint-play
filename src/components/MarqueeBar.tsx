const items = [
  "🍽️ RESTAURANTS",
  "🏨 HOTELS",
  "🍸 LOUNGES",
  "🎵 CLUBS",
  "🎪 EVENTS",
  "🎁 GIFT CARDS",
  "✈️ TRAVEL",
  "⚽ SPORTS",
  "📚 COURSES",
];

const MarqueeBar = () => {
  const content = items.join(" · ");

  return (
    <div className="bg-military border-y-2 border-lime/30 py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="text-lime text-sm font-extrabold font-heading tracking-[0.15em] uppercase mx-4"
          >
            {content} ·{" "}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeBar;

const cards = [
  {
    title: "Personality-Matched Pods",
    body: "Every member is matched to a pod of 4-6 people based on their assessment results. Same operating style. Different enough to challenge you. Similar enough to understand you. These aren't random strangers — they're the people you didn't know you were looking for.",
  },
  {
    title: "The Feed",
    body: "Share wins. Ask questions. Post reflections. The feed surfaces what the community is actually working on — not what people want you to think they're working on. Everyone here has skin in the game. That changes the quality of every conversation.",
  },
  {
    title: "Five Coach Touchpoints",
    body: "Initial coaching call. Weekly Q&A content. Reset group. Achievement group. Monthly community call. I show up five ways every month — each one designed to hit different. The community and the system carry the standard between those moments.",
  },
];

export default function RoomSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            The right room changes everything.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            You're not missing motivation. You're missing people who understand what you're building — and will ask the hard question when nobody else will.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5 mb-10">
          {cards.map((card) => (
            <div key={card.title} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-base font-bold text-primary mb-3">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto rounded-xl border border-border bg-card p-6 md:p-8 text-center">
          <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
            Most people aren't lacking for people in their life. They're lacking someone to bounce ideas off of. Someone who gets what they're building, what they're risking, what keeps them up at night. Everyone around them either says 'you got this' or doesn't understand the question.
          </p>
          <p className="mt-4 text-lg font-display font-bold text-gradient-gold italic">
            That's who's in this room.
          </p>
        </div>
      </div>
    </section>
  );
}

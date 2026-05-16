import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useParams, Navigate } from "react-router-dom";

type LegalPage = {
  title: string;
  body: React.ReactNode;
};

const pages: Record<string, LegalPage> = {
  terms: {
    title: "Terms of Service",
    body: (
      <>
        <p>By using Terrible Coaching, you agree to these terms. Terrible Coaching is a coaching, accountability, and execution program. It is not therapy, counseling, medical care, crisis care, diagnosis, or treatment.</p>
        <p>Membership grants access to the system, your matched pod, your coach within the limits of your track, and program content. Misuse of the platform — including harassment of other members, dishonest reporting, or abuse of staff — may result in removal without refund.</p>
        <p>You are responsible for the decisions you make as a result of coaching. Outcomes are not guaranteed. The program provides structure, feedback, accountability, and community.</p>
      </>
    ),
  },
  privacy: {
    title: "Privacy Policy",
    body: (
      <>
        <p>We collect the information you submit through the application, your check-ins, and your evidence submissions. We use this information to coach you, match you to a pod, and operate the program.</p>
        <p>Your pod sees your completion percentage, streak, and commitment ratio by default. Your pod does not see your private evidence, personal notes, or direct messages unless you choose to share them.</p>
        <p>We do not sell your personal information. We use industry-standard practices to secure your data.</p>
      </>
    ),
  },
  disclaimer: {
    title: "Coaching Disclaimer",
    body: (
      <>
        <p>Terrible Coaching is not therapy, counseling, medical care, crisis care, diagnosis, or treatment. Coaching is focused on goals, accountability, behavior tracking, and execution.</p>
        <p>If you are in crisis or need mental health care, contact a licensed professional or emergency service. In the US, you can dial or text 988 for the Suicide &amp; Crisis Lifeline.</p>
        <p>Nothing in this program should be construed as professional medical, psychological, legal, or financial advice. Always consult a qualified professional for those needs.</p>
      </>
    ),
  },
  subscription: {
    title: "Subscription & Fee Terms",
    body: (
      <>
        <p><strong>Recurring monthly billing.</strong> Your selected track renews monthly until you cancel. You may cancel before your next billing cycle to avoid future subscription charges.</p>
        <p><strong>Refunds.</strong> Payments are non-refundable after your initial coaching call has been completed. Cancellation stops future billing but does not refund completed services.</p>
        <p><strong>$75 Commitment Breach Fee.</strong> This fee may apply when you miss a required check-in, fail to submit required evidence, ghost the system, or break a controllable commitment you agreed to. Missing an outcome target is different from breaching a controllable commitment — honest failure gets reviewed, avoidance gets reset.</p>
        <p><strong>Waivers.</strong> The coach may waive the fee at their discretion when life genuinely happens. Repeated breaches without legitimate reason may result in removal from the program.</p>
        <p><strong>Reset Call enrollment.</strong> When a Commitment Breach Fee applies, you may be automatically enrolled in the monthly Reset Call.</p>
      </>
    ),
  },
  community: {
    title: "Community Guidelines",
    body: (
      <>
        <p>This community is built on honesty, accountability, and respect. You agreed to be told the truth — extend the same to your pod.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>No harassment, slurs, or personal attacks.</li>
          <li>No selling, pitching, or recruiting members for outside services without permission.</li>
          <li>Do not share another member's private evidence, notes, or messages outside the platform.</li>
          <li>Bad-faith participation — fabricated evidence, ghosting your pod, gaming the system — is grounds for removal without refund.</li>
        </ul>
        <p>The standard you keep is the standard the room keeps.</p>
      </>
    ),
  },
};

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? pages[slug] : null;
  if (!page) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-3xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">{page.title}</h1>
          <div className="prose prose-invert max-w-none space-y-5 text-sm md:text-base text-muted-foreground leading-relaxed">
            {page.body}
          </div>
          <p className="mt-12 text-xs text-muted-foreground/60">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}. This is the working version of our policies for the founding cohort.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="cta-section">
      <div className="cta-badge">Start learning your way.</div>
      <h2 className="text-3xl font-bold">
        🤖 Build Your Personalized AI Tutor
      </h2>
      <p>
        Choose a specialization, voice, & personality — and start mastering
        English through natural voice conversations tailored to your learning
        style.
      </p>
      <Image src="images/cta.svg" alt="cta" width={362} height={232} />
      <button className="btn-primary">
        <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
        <Link href="/tutors/new">
          <p>🚀 Create AI Tutor</p>
        </Link>
      </button>
    </section>
  );
};
export default Cta;

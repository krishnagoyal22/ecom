import Link from "next/link";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function SignupPage() {
  return (
    <div className="auth-wrapper">
      <div className="auth-grid fade-in">
        <section className="card auth-showcase">
          <span className="eyebrow">Join KottiarCatalog</span>
          <h1>Create your account.</h1>
          <p>
            Create an account to browse Kottiar bangle collections and save the
            designs you want to revisit.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <span className="badge badge-warm">Fast</span>
              <div>
                <strong>Simple access</strong>
                <p>Use Google to start browsing the catalog.</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="badge">Fresh</span>
              <div>
                <strong>Bangle discovery</strong>
                <p>
                  Search and collection sections make designs easier to scan.
                </p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span
                className="badge"
                style={{
                  background: "rgba(221, 94, 137, 0.12)",
                  borderColor: "rgba(221, 94, 137, 0.18)",
                  color: "#a93961",
                }}
              >
                Warm
              </span>
              <div>
                <strong>Focused presentation</strong>
                <p>The interface keeps the attention on Kottiar creations.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="card auth-form">
          <div className="auth-form-header">
            <span className="eyebrow">Create profile</span>
            <h2>Sign up</h2>
            <p>Register with Google and head straight into KottiarCatalog.</p>
          </div>

          <GoogleAuthButton />

          <p className="auth-footnote">
            Already registered? <Link href="/login">Log in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

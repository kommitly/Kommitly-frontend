import React from "react";
import { useNavigate } from "react-router-dom";


export default function Blog() {
const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex justify-center px-6 py-16">
      <article className="w-full max-w-3xl">
        {/* Header */}
        <header className="mb-12">
          <p className="text-sm uppercase tracking-widest text-neutral-400 mb-4">
            Personal • Building in public
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Betting on Myself <span className="text-neutral-400">(and the AI Helping Me Do It)</span>
          </h1>
          <div className="flex items-center gap-3 text-sm text-neutral-400">
            <span>By Shanon</span>
            <span>•</span>
            <span>Kommitly</span>
          </div>
        </header>

        {/* Blog content */}
        <section className="space-y-8 text-lg leading-relaxed text-neutral-200">
          <p>
            I didn’t grow up with a safety net. No connections. No one telling me,
            “You’ll be fine even if this fails.” Most of the time, it felt like if
            I messed up, that was it. So I learned early how to survive, but not
            always how to believe in myself.
          </p>

          <p>
            I was the quiet kid. The one who didn’t speak English well. The one
            people underestimated without even trying to know. I got lucky in one
            way though: I was smart. And when that’s all you have, you hold onto
            it tightly. I promised myself my background wouldn’t be the thing
            that defined how far I’d go.
          </p>

          <p>
            Now I’m in London, about to move to Scotland for a master’s in Big Data
            Technologies, with an engineering background and a head full of ideas.
            I don’t want to climb the corporate ladder. I want to build things. I
            want to build companies. I don’t know exactly how yet, but I know I
            will. And right now, I’m betting on myself harder than I ever have.
          </p>

          <hr className="border-neutral-800 my-10" />

          <p>
            The part people don’t talk about enough is how hard it is to stay
            consistent when you’re carrying self-doubt, pressure, and big dreams
            all at once. I’ve struggled with procrastination. With laziness. With
            starting strong and disappearing when things get overwhelming. That
            doesn’t mean I lack potential, it just means I’m human.
          </p>

          <p>
            At some point, I realized motivation wasn’t coming to save me. I
            needed structure. Something that would check in on me when I felt
            like slipping back into old patterns. That’s how Kommitly started,
            not as a startup idea, but as something I genuinely needed.
          </p>

          <p className="text-neutral-300">
            Kommitly is the AI accountability partner helping me show up, even on
            days when belief is low. I’m not building it because I have everything
            figured out. I’m building it while figuring things out.
          </p>
        </section>

        {/* Footer CTA */}
        <footer className="mt-16 pt-8 border-t border-neutral-800">
          <p className="text-neutral-400 text-sm mb-4">
            This is part of my series <span className="italic">Betting on Myself</span>.
          </p>
         <div className="flex flex-col sm:flex-row gap-4">
<button className="rounded-2xl bg-neutral-100 text-neutral-950 px-6 py-3 text-sm font-medium hover:bg-neutral-200 transition cursor-pointer"
onClick={() => navigate("/registration?tab=login")}
>
Go to dashboard →
</button>



</div>
        </footer>
      </article>
    </main>
  );
}

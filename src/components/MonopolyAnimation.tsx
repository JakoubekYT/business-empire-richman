import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useGameStore } from "../store/gameStore";

export function MonopolyAnimation() {
  const { currentRankLevel } = useGameStore();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Trigger only when reaching level 13 (RichMan) for the first time in session
    if (currentRankLevel === 13 && !dismissed) {
      setShow(true);
      
      // Fire multiple confetti bursts
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [currentRankLevel, dismissed]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-700">
        <div className="relative inline-block">
          <div className="text-8-xl mb-4 animate-bounce">🔱</div>
          <div className="absolute -inset-4 bg-amber-500/20 blur-2xl rounded-full -z-1" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200 animate-pulse">
            MONOPOLY
          </h1>
          <p className="text-amber-500 font-bold tracking-[0.3em] text-sm">ACHIEVEMENT UNLOCKED</p>
        </div>

        <div className="bg-slate-900/50 border border-amber-500/30 p-8 rounded-3xl space-y-4 shadow-2xl shadow-amber-500/10">
          <h2 className="text-2xl font-bold text-white">The World is Yours</h2>
          <p className="text-slate-400 leading-relaxed">
            You have achieved the ultimate rank of <span className="text-amber-400 font-bold">RichMan</span>. 
            With $100 Trillion in assets, you are no longer just an investor—you are the economy.
          </p>
        </div>

        <button
          onClick={() => { setShow(false); setDismissed(true); }}
          className="px-12 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black rounded-full shadow-xl shadow-amber-950/20 transition-all hover:scale-105 active:scale-95"
        >
          CONTINUE THE EMPIRE
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

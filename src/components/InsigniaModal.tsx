import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { RANKS } from '../data/gameData';
import { formatMoney } from '../utils/format';

export const InsigniaModal: React.FC = () => {
  const { currentRankLevel } = useGameStore();
  const [show, setShow] = useState(false);
  const [displayedRank, setDisplayedRank] = useState(currentRankLevel);

  useEffect(() => {
    if (currentRankLevel > displayedRank) {
      setShow(true);
      // We'll update the displayed rank when the modal closes or immediately
    }
  }, [currentRankLevel, displayedRank]);

  const currentRank = RANKS.find(r => r.level === currentRankLevel);
  if (!currentRank || !show) return null;

  const nextRank = RANKS.find(r => r.level === currentRankLevel + 1);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Confetti effect placeholder */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div style={{
              fontSize: 100,
              marginBottom: 20,
              filter: 'drop-shadow(0 0 20px rgba(245,197,24,0.5))'
            }}>
              {currentRank.icon}
            </div>
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 16, color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}
          >
            Rank Unlocked
          </motion.h2>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: 32, fontWeight: 900, marginBottom: 20, color: '#fff' }}
          >
            {currentRank.name}
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 40px',
              marginBottom: 40,
            }}
          >
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Next Rank Goal:</div>
            {nextRank ? (
              <>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--accent-green)' }}>
                  Net Worth: {formatMoney(nextRank.reqNetWorth)}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-secondary)' }}>
                  Inc/hr: {formatMoney(nextRank.reqHourlyIncome)}
                </div>
              </>
            ) : (
              <div style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>MAXIMUM RANK ATTAINED</div>
            )}
          </motion.div>

          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="btn btn-gold"
            style={{ padding: '16px 48px', fontSize: 16, fontWeight: 800 }}
            onClick={() => {
              setShow(false);
              setDisplayedRank(currentRankLevel);
            }}
          >
            COLLECT INSIGNIA
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

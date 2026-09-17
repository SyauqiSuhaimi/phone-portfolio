import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GRAVITY = 0.5;
const JUMP_SPEED = -10;
const PIPE_SPEED = 3;
const PIPE_WIDTH = 60;
const PIPE_GAP = 160;
const FROG_SIZE = 40;

export default function JumpyFrog() {
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">(
    "start",
  );
  const [frogPos, setFrogPos] = useState(250);
  const [frogVelocity, setFrogVelocity] = useState(0);
  const [pipes, setPipes] = useState<{ x: number; topHeight: number }[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("jumpyFrogHighScore");
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  const jump = useCallback(() => {
    if (gameState === "start") {
      setGameState("playing");
      setFrogVelocity(JUMP_SPEED);
    } else if (gameState === "playing") {
      setFrogVelocity(JUMP_SPEED);
    } else if (gameState === "gameover") {
      // Reset
      setGameState("start");
      setFrogPos(250);
      setFrogVelocity(0);
      setPipes([]);
      setScore(0);
    }
  }, [gameState]);

  const updateGame = useCallback(
    (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }
      // We can use deltaTime if we want frame rate independence,
      // but a fixed step is simpler for a mini-game.
      // const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (gameState !== "playing") return;

      const containerHeight = containerRef.current?.clientHeight || 600;

      // Update Frog
      setFrogPos((pos) => pos + frogVelocity);
      setFrogVelocity((v) => v + GRAVITY);

      // Update Pipes
      setPipes((currentPipes) => {
        let newPipes = currentPipes
          .map((p) => ({ ...p, x: p.x - PIPE_SPEED }))
          .filter((p) => p.x + PIPE_WIDTH > 0);

        const containerWidth = containerRef.current?.clientWidth || 400;
        const PIPE_DISTANCE = 250; // Horizontal distance between pipes

        // Add new pipe
        if (newPipes.length === 0) {
          const minHeight = 50;
          const maxHeight = containerHeight - PIPE_GAP - minHeight;
          const topHeight = Math.floor(
            Math.random() * (maxHeight - minHeight + 1) + minHeight,
          );
          // First pipe starts far off-screen
          newPipes.push({ x: containerWidth + 200, topHeight });
        } else {
          const lastPipe = newPipes[newPipes.length - 1];
          if (lastPipe.x <= containerWidth + 200 - PIPE_DISTANCE) {
            const minHeight = 50;
            const maxHeight = containerHeight - PIPE_GAP - minHeight;
            const topHeight = Math.floor(
              Math.random() * (maxHeight - minHeight + 1) + minHeight,
            );
            newPipes.push({ x: lastPipe.x + PIPE_DISTANCE, topHeight });
          }
        }

        return newPipes;
      });

      // Collision & Logic check in next frame's start to ensure state is committed,
      // but easier to check with local variables here.
    },
    [frogVelocity, gameState],
  );

  // Separate effect for collision and score to read fresh state without complex deps in updateGame
  useEffect(() => {
    if (gameState !== "playing") return;

    const containerHeight = containerRef.current?.clientHeight || 600;
    const frogRect = {
      left: 50,
      right: 50 + FROG_SIZE,
      top: frogPos,
      bottom: frogPos + FROG_SIZE,
    };

    // Floor / Ceiling collision
    if (frogRect.bottom > containerHeight || frogRect.top < 0) {
      setGameState("gameover");
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("jumpyFrogHighScore", score.toString());
      }
    }

    // Pipe collision
    let crossedPipe = false;
    for (let p of pipes) {
      const pipeRects = [
        // Top pipe
        { left: p.x, right: p.x + PIPE_WIDTH, top: 0, bottom: p.topHeight },
        // Bottom pipe
        {
          left: p.x,
          right: p.x + PIPE_WIDTH,
          top: p.topHeight + PIPE_GAP,
          bottom: containerHeight,
        },
      ];

      for (let pr of pipeRects) {
        if (
          frogRect.right > pr.left &&
          frogRect.left < pr.right &&
          frogRect.bottom > pr.top &&
          frogRect.top < pr.bottom
        ) {
          setGameState("gameover");
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("jumpyFrogHighScore", score.toString());
          }
        }
      }

      // Score
      if (p.x === 50) {
        crossedPipe = true;
      }
    }

    if (crossedPipe) {
      setScore((s) => s + 1);
    }
  }, [frogPos, pipes, gameState, score, highScore]);

  useEffect(() => {
    if (gameState === "playing") {
      requestRef.current = requestAnimationFrame((time) => {
        updateGame(time);
      });
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateGame, gameState]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-sky-200 dark:bg-sky-900 select-none touch-none cursor-pointer"
      onPointerDown={jump}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20 flex justify-around">
        <div className="w-16 h-16 bg-white rounded-full translate-y-10 blur-xl" />
        <div className="w-24 h-24 bg-white rounded-full translate-y-16 blur-2xl" />
      </div>

      {/* Pipes */}
      {pipes.map((p, i) => (
        <div key={i}>
          {/* Top Pipe */}
          <div
            className="absolute bg-green-500 dark:bg-green-700 border-2 border-green-600 dark:border-green-800"
            style={{
              left: p.x,
              top: 0,
              width: PIPE_WIDTH,
              height: p.topHeight,
            }}
          />
          {/* Bottom Pipe */}
          <div
            className="absolute bg-green-500 dark:bg-green-700 border-2 border-green-600 dark:border-green-800"
            style={{
              left: p.x,
              bottom: 0,
              width: PIPE_WIDTH,
              height: `calc(100% - ${p.topHeight + PIPE_GAP}px)`,
            }}
          />
        </div>
      ))}

      {/* Frog */}
      <div
        className="absolute text-4xl flex items-center justify-center transform transition-transform"
        style={{
          left: 50,
          top: frogPos,
          width: FROG_SIZE,
          height: FROG_SIZE,
          rotate: `${frogVelocity * 3}deg`,
        }}
      >
        🐸
      </div>

      {/* Score */}
      <div className="absolute top-10 w-full text-center pointer-events-none z-10">
        <h1 className="text-5xl font-black text-white drop-shadow-lg stroke-black stroke-2">
          {score}
        </h1>
      </div>

      {/* Start / Game Over Screens */}
      <AnimatePresence>
        {gameState === "start" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20"
          >
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl text-center">
              <h2 className="text-3xl font-bold mb-4 dark:text-white">
                Jumpy Frog
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Tap to jump, avoid the pipes!
              </p>
              <p className="text-sm font-semibold text-sky-500 mb-2">
                High Score: {highScore}
              </p>
              <button
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold shadow-md transition-transform active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  jump();
                }}
              >
                Play Now
              </button>
            </div>
          </motion.div>
        )}

        {gameState === "gameover" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20"
          >
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl text-center">
              <h2 className="text-3xl font-bold text-red-500 mb-2">
                Game Over!
              </h2>
              <div className="flex justify-center gap-6 mb-6 mt-4">
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Score
                  </p>
                  <p className="text-3xl font-black dark:text-white">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Best
                  </p>
                  <p className="text-3xl font-black dark:text-white">
                    {highScore}
                  </p>
                </div>
              </div>
              <button
                className="w-full py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold shadow-md transition-transform active:scale-95"
                onClick={(e) => {
                  e.stopPropagation();
                  jump();
                }}
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

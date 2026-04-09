import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import wordList from "../../data/words.json";

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

type GameStatus = "playing" | "won" | "lost";
type LetterResult = "correct" | "present" | "absent" | "empty";

export default function Wordle() {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [status, setStatus] = useState<GameStatus>("playing");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const startNewGame = useCallback(() => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setTargetWord(randomWord.toUpperCase());
    setGuesses([]);
    setCurrentGuess("");
    setStatus("playing");
    setToastMessage(null);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("wordle-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.targetWord && Array.isArray(parsed.guesses)) {
          setTargetWord(parsed.targetWord);
          setGuesses(parsed.guesses);
          setCurrentGuess(parsed.currentGuess || "");
          setStatus(parsed.status || "playing");
          setIsLoaded(true);
          return;
        }
      } catch (e) {
        // failed to parse, fallback to new game
      }
    }
    startNewGame();
    setIsLoaded(true);
  }, [startNewGame]);

  useEffect(() => {
    if (isLoaded && targetWord) {
      localStorage.setItem(
        "wordle-state",
        JSON.stringify({
          targetWord,
          guesses,
          currentGuess,
          status,
        }),
      );
    }
  }, [targetWord, guesses, currentGuess, status, isLoaded]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const onKeyPress = useCallback(
    (key: string) => {
      if (status !== "playing") return;

      if (key === "ENTER") {
        if (currentGuess.length !== WORD_LENGTH) {
          showToast("Not enough letters");
          return;
        }
        if (!wordList.some((w) => w.toUpperCase() === currentGuess)) {
          showToast("Not in word list");
          return;
        }

        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess("");

        if (currentGuess === targetWord) {
          setStatus("won");
          showToast("You won!");
        } else if (newGuesses.length >= MAX_GUESSES) {
          setStatus("lost");
          showToast(targetWord);
        }
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else {
        if (currentGuess.length < WORD_LENGTH) {
          setCurrentGuess((prev) => prev + key);
        }
      }
    },
    [currentGuess, guesses, status, targetWord],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") {
        onKeyPress("ENTER");
      } else if (e.key === "Backspace") {
        onKeyPress("BACKSPACE");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        onKeyPress(e.key.toUpperCase());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onKeyPress]);

  // Compute used keyboard letters statuses
  const keyStatuses: Record<string, LetterResult> = {};
  guesses.forEach((guess) => {
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = guess[i];
      if (keyStatuses[letter] === "correct") continue;

      if (targetWord[i] === letter) {
        keyStatuses[letter] = "correct";
      } else if (targetWord.includes(letter)) {
        keyStatuses[letter] = "present";
      } else {
        keyStatuses[letter] = "absent";
      }
    }
  });

  if (!isLoaded) return null; // Prevent hydration mismatch

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#121213] text-black dark:text-white transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={startNewGame}
          className="p-2 transition-colors text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-300"
        >
          Restart
        </button>
      </header>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-20 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded font-bold z-50 shadow-md"
          >
            {toastMessage}
          </motion.div>
        )}

        <div className="grid grid-rows-6 gap-2 w-full max-w-[350px]">
          {Array.from({ length: MAX_GUESSES }).map((_, rowIndex) => {
            const isCurrentRow = rowIndex === guesses.length;
            const guess = isCurrentRow
              ? currentGuess
              : (guesses[rowIndex] ?? "");

            // Check letters for past guesses
            const results: LetterResult[] = Array(5).fill("empty");
            if (!isCurrentRow && guesses[rowIndex]) {
              const targetLetters = targetWord.split("");
              // First pass: find correct letters
              for (let i = 0; i < WORD_LENGTH; i++) {
                if (guess[i] === targetWord[i]) {
                  results[i] = "correct";
                  targetLetters[i] = ""; // consume letter
                }
              }
              // Second pass: find present letters
              for (let i = 0; i < WORD_LENGTH; i++) {
                if (
                  results[i] !== "correct" &&
                  targetLetters.includes(guess[i])
                ) {
                  results[i] = "present";
                  targetLetters[targetLetters.indexOf(guess[i])] = "";
                } else if (results[i] !== "correct") {
                  results[i] = "absent";
                }
              }
            }

            return (
              <div key={rowIndex} className="grid grid-cols-5 gap-2">
                {Array.from({ length: WORD_LENGTH }).map((_, colIndex) => {
                  const letter = guess[colIndex] ?? "";
                  const result = results[colIndex];

                  let bgClass =
                    "bg-transparent border-gray-300 dark:border-gray-600 text-black dark:text-white";
                  if (result === "correct")
                    bgClass = "bg-[#538d4e] border-[#538d4e] text-white";
                  else if (result === "present")
                    bgClass = "bg-[#b59f3b] border-[#b59f3b] text-white";
                  else if (result === "absent")
                    bgClass =
                      "bg-gray-500 border-gray-500 dark:bg-[#3a3a3c] dark:border-[#3a3a3c] text-white";
                  else if (letter)
                    bgClass =
                      "bg-transparent border-gray-500 dark:border-gray-400 text-black dark:text-white"; // typing

                  return (
                    <motion.div
                      key={colIndex}
                      initial={isCurrentRow && letter ? { scale: 0.8 } : false}
                      animate={isCurrentRow && letter ? { scale: 1 } : false}
                      className={`flex items-center justify-center aspect-square border-2 font-bold text-2xl uppercase select-none transition-colors duration-500 ${bgClass}`}
                    >
                      {letter}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard */}
      <div className="w-full max-w-[500px] mx-auto p-2 pb-6 flex flex-col gap-2">
        {[
          ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
          ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
          ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
        ].map((row, i) => (
          <div key={i} className="flex justify-center gap-1.5">
            {row.map((key) => {
              const status = keyStatuses[key];
              let keyClass =
                "bg-gray-200 dark:bg-[#818384] text-black dark:text-white";
              if (status === "correct") keyClass = "bg-[#538d4e] text-white";
              else if (status === "present")
                keyClass = "bg-[#b59f3b] text-white";
              else if (status === "absent")
                keyClass = "bg-gray-400 dark:bg-[#3a3a3c] text-white";

              const isAction = key === "ENTER" || key === "BACKSPACE";
              return (
                <button
                  key={key}
                  onClick={() => onKeyPress(key)}
                  className={`${keyClass} font-bold rounded flex items-center justify-center transition-colors active:scale-95 select-none ${
                    isAction ? "px-3 text-xs sm:text-sm" : "w-8 sm:w-10"
                  } h-14`}
                >
                  {key === "BACKSPACE" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      className="fill-current"
                    >
                      <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z" />
                    </svg>
                  ) : (
                    key
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

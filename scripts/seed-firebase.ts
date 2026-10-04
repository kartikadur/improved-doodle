import { v4 as uuidv4 } from 'uuid';
import type { Event } from '../src/schema/event.js'
import { storeEvent } from '../src/store/event.js'

/**
 * Generates a random UUID string.
 */
function randomUserId(): string {
  return uuidv4();
}

/**
 * Generates a random level event.
 */
function generateLevelEvent(): Event {
  const levels = [1, 2, 3, 4, 5];
  const reasons = ["fail", "complete", "quit"] as const;

  return {
    eventId: "level",
    userId: randomUserId(),
    data: {
      level: levels[Math.floor(Math.random() * levels.length)]!,
      durationMs: Math.floor(Math.random() * 5 * 60 * 1000) + 10000, // 10s to 5min
      occurredAt: Date.now(),
      progress: Math.random(),
      reason: reasons[Math.floor(Math.random() * reasons.length)]!,
      score: Math.floor(Math.random() * 1000),
    },
  };
}

/**
 * Generates a random game event.
 */
function generateGameEvent(): Event {
  const reasons = ["fail", "complete", "quit"] as const;

  return {
    eventId: "game",
    userId: randomUserId(),
    data: {
      reason: reasons[Math.floor(Math.random() * reasons.length)]!,
      score: Math.floor(Math.random() * 10000),
      bestScore: Math.floor(Math.random() * 10000),
      level: Math.floor(Math.random() * 10) + 1,
      bestLevel: Math.floor(Math.random() * 10) + 1,
      occurredAt: Date.now(),
    },
  };
}

/**
 * Seeds Firestore with 1000 level events and 1000 game events.
 * Run with: npx ts-node scripts/seed-events.ts
 */
async function seedEvents() {
  console.log("🌱 Starting to seed events...");
  const start = Date.now();

  let levelCount = 0;
  let gameCount = 0;
  let errors = 0;

  // Level events
  for (let i = 0; i < 100; i++) {
    try {
      const event = generateLevelEvent();
      await storeEvent(event);
      levelCount++;

      if ((i + 1) % 100 === 0) {
        console.log(`  ✓ Level events: ${i + 1}/100`);
      }
    } catch (err) {
      console.error(`  ✗ Level event ${i + 1} failed:`, err);
      errors++;
    }
  }

  // Game events
  for (let i = 0; i < 100; i++) {
    try {
      const event = generateGameEvent();
      await storeEvent(event);
      gameCount++;

      if ((i + 1) % 100 === 0) {
        console.log(`  ✓ Game events: ${i + 1}/100`);
      }
    } catch (err) {
      console.error(`  ✗ Game event ${i + 1} failed:`, err);
      errors++;
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log("\n✅ Seeding complete!");
  console.log(`   Level events: ${levelCount}/100`);
  console.log(`   Game events: ${gameCount}/100`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Time: ${elapsed}s`);

  process.exit(errors > 0 ? 1 : 0);
}

seedEvents().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
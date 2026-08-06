import { seededRandom, pick, range, dailySeedKey } from "../seed";
import type { FrontDeskEntry, FrontDeskStage, FrontDeskSummary } from "./types";

const STAGES: FrontDeskStage[] = ["EXPECTED_ARRIVAL", "READY_FOR_CHECKIN", "IN_HOUSE", "EXPECTED_DEPARTURE", "CHECKED_OUT"];
const FIRST_NAMES = ["Amara", "Kenji", "Sofia", "Lucas", "Priya", "Mateo", "Elena", "Noah", "Fatima", "Owen"];
const LAST_NAMES = ["Silva", "Nakata", "Rossi", "Kim", "Patel", "Novak", "Bauer", "Diallo", "Chen", "Foster"];

export function getFrontDeskSummary(branchId: string): FrontDeskSummary {
  const rand = seededRandom(dailySeedKey(branchId, "front-desk"));
  const entryCount = range(rand, 12, 26);

  const entries: FrontDeskEntry[] = Array.from({ length: entryCount }, (_, i) => {
    const stage = pick(rand, STAGES);
    const hour = range(rand, 6, 22);
    return {
      id: `fd-${i}`,
      guestName: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`,
      roomNumber: `${range(rand, 1, 6)}${String(range(rand, 1, 24)).padStart(2, "0")}`,
      stage,
      scheduledTime: `${String(hour).padStart(2, "0")}:${pick(rand, ["00", "15", "30", "45"])}`,
      partySize: range(rand, 1, 4),
      vip: rand() > 0.85,
      notes: rand() > 0.7 ? pick(rand, ["Late arrival requested", "Early check-in requested", "Room upgrade pending", "Airport transfer booked"]) : null,
    };
  });

  return {
    entries,
    arrivalsToday: entries.filter((e) => e.stage === "EXPECTED_ARRIVAL" || e.stage === "READY_FOR_CHECKIN").length,
    departuresToday: entries.filter((e) => e.stage === "EXPECTED_DEPARTURE" || e.stage === "CHECKED_OUT").length,
    inHouse: entries.filter((e) => e.stage === "IN_HOUSE").length,
  };
}

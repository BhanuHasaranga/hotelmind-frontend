export type FrontDeskStage = "EXPECTED_ARRIVAL" | "READY_FOR_CHECKIN" | "IN_HOUSE" | "EXPECTED_DEPARTURE" | "CHECKED_OUT";

export interface FrontDeskEntry {
  id: string;
  guestName: string;
  roomNumber: string;
  stage: FrontDeskStage;
  scheduledTime: string;
  partySize: number;
  vip: boolean;
  notes: string | null;
}

export interface FrontDeskSummary {
  entries: FrontDeskEntry[];
  arrivalsToday: number;
  departuresToday: number;
  inHouse: number;
}

import { Injectable } from '@angular/core';

export type IntelMovementKeys = "enemy_attack" | "friendly_attack" | "attack_on_conquest" | "support" | "spy" | "wisdom"

@Injectable()
export class IndexerOverviewService {
  public INTEL_MOVEMENT_TYPES: Record<IntelMovementKeys, string> = {
    "enemy_attack": "Enemy attack",
    "friendly_attack": "Friendly attack",
    "attack_on_conquest": "Conquest attack",
    "support": "Support",
    "spy": "Spy",
    "wisdom": "Wisdom"
  } as const
}

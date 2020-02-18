import { Injectable } from "@angular/core";

declare const ga: Function;

@Injectable()
export class GoogleAnalyticsEventsService {
  public emitEvent(eventCategory: string, eventAction: string, eventLabel: string, eventValue: number) {
    ga("send", "event", {
      eventCategory,
      eventAction,
      eventLabel,
      eventValue
    });
  }
}

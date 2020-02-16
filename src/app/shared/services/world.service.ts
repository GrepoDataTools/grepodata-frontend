import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class WorldService {
  servers = [
    "ar",
    "br",
    "cz",
    "de",
    "dk",
    "en",
    "es",
    "fi",
    "fr",
    "gr",
    "hu",
    "it",
    "nl",
    "no",
    "pl",
    "pt",
    "ro",
    "ru",
    "se",
    "sk",
    "tr",
    "us"
  ];

  constructor(private http: HttpClient, private localStorage: LocalStorageService) {}

  getDefaultServer() {

  }
}

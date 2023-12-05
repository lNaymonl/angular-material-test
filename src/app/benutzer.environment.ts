import { Injectable } from "@angular/core";

@Injectable()
export class oBenutzer {
    public Einstellunglesen(einstellung: string): Promise<string> {
        return new Promise<string>((resolve) => {resolve("")});
    }

    public async Einstellungspeichern(einstellung: string, wert: string) {
        await new Promise<void>((resolve) => resolve());
    }
}
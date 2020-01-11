import { Injectable } from '@angular/core';
import themes from 'src/assets/theme/theme.json';

export interface ThemeModel {
  displayName: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Plain ol' js here
  private rootElement: HTMLElement;
  private current: string = 'default';

  public get currentTheme(): string {
    return this.current;
  }

  public set currentTheme(value: string) {
    try {
      this.applyTheme(value);
    } catch (err) {
      console.log(err); // This should never fail, really
    }
  }

  public get availableThemes(): ThemeModel[] {
    return Object.keys(themes).map((theme: string) => ({
      name: theme,
      displayName: themes[theme].displayName || theme
    }));
  }

  constructor() {
    this.rootElement = document.documentElement;
    this.applyTheme('default');
    console.log(JSON.stringify(this.availableThemes));
  }

  private applyTheme(name: string) {
    const theme: any = themes[name];
    if (!theme || !theme.variables) {
      throw new Error(`Theme '${name}' is undefined or invalid!`);
    }

    this.current = name;
    Object.keys(theme.variables).forEach((variable: string) => {
      const value: string = theme.variables[variable];
      this.rootElement.style.setProperty(variable, value);
    });
  }
}

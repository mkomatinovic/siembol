import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppConfigService } from '@app/config';


@Injectable({
  providedIn: 'root',
})
export class UrlHistoryService {
    private readonly max_size: number;
    private readonly HISTORY_KEY: string;

    constructor(private router: Router,
                private appService: AppConfigService) {
        this.HISTORY_KEY = "siembol_history-" + this.appService.environment;
        this.max_size = this.appService.historyMaxSize;
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) { 
                let history = this.add(event.url, this.getHistoryPreviousUrls());
                localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
            };
        });
    }
        
    
    private add(item: string, history: string[]): string[] {
        if (this.appService.isHomePath(item) || this.appService.authenticationService.isCallbackUrl(item)) {
            return history;
        }
        history.push(item);
        return this.crop(this.removeOldestDuplicates(history));
    }

    private removeOldestDuplicates(history: string[]): string[] {
        return history.filter((value, index) => history.lastIndexOf(value) === index);
    }

    private crop(history: string[]): string[] {
        while (history.length > this.max_size) {
            history.shift();
        }
        return history
    }

    public getHistoryPreviousUrls(): string[] {
        const history = localStorage.getItem(this.HISTORY_KEY);
        return history? JSON.parse(history) : [];
    }    
}
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalR';
import { Observable } from 'rxjs';
import { Basis } from '../../shared/models/basis';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  baseUrl = 'http://localhost:5177/';

  hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.baseUrl + 'basis')
    .build();

  startConnection(): Observable<void> {
    return new Observable<void>((observer) => {
      this.hubConnection
        .start()
        .then(() => {
          console.log('Connection established with SignalR hub');
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.log('Error connecting to SignalR hub:', error);
          observer.error(error);
        });
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private socket: WebSocket;
  private messageSubject = new Subject<any>();

  constructor(private http: HttpClient) {
    this.connectWebSocket();
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/message`, { message, user: 'U1', date: new Date().toISOString() });
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  private connectWebSocket() {
    this.socket = new WebSocket(environment.wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageSubject.next(data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      // Intenta reconectar después de un breve retraso
      setTimeout(() => this.connectWebSocket(), 5000);
    };
  }
}

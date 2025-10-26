import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutomationService {
  private apiUrl = 'http://localhost:3000/api';
  private wsUrl = 'ws://localhost:8081';
  private logSubject = new Subject<any>();
  private websocket: WebSocket | null = null;

  constructor(private http: HttpClient) {}

  connectWebSocket(): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      return;
    }

    this.websocket = new WebSocket(this.wsUrl);
    
    this.websocket.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.websocket.onmessage = (event) => {
      try {
        const log = JSON.parse(event.data);
        this.logSubject.next(log);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    this.websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnectWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  getRules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rules`);
  }

  saveRule(rule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rules`, rule);
  }

  updateRule(fileName: string, rule: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/rules/${fileName}`, rule);
  }

  deleteRule(fileName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rules/${fileName}`);
  }

  runRule(fileName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/run/${fileName}`, {});
  }

  stopRule(fileName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/stop/${fileName}`, {});
  }

  stopAllRules(): Observable<any> {
    return this.http.post(`${this.apiUrl}/stop-all`, {});
  }

  getRunningRules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/running`);
  }

  getLogs(): Observable<any> {
    return this.logSubject.asObservable();
  }

  getScreenshots(ruleName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/screenshots/${ruleName}`);
  }

  getExecutionHistory(ruleName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history/${ruleName}`);
  }

  validateRule(rule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate`, rule);
  }

  getActionTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/templates/actions`);
  }

  getCommonSelectors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/templates/selectors`);
  }
}

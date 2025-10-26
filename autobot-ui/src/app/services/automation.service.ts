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

  // Connect to WebSocket for real-time logs
  connectWebSocket(): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      return; // Already connected
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

  // Disconnect WebSocket
  disconnectWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  // Get all available rules
  getRules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rules`);
  }

  // Save a new rule
  saveRule(rule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rules`, rule);
  }

  // Update an existing rule
  updateRule(fileName: string, rule: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/rules/${fileName}`, rule);
  }

  // Delete a rule
  deleteRule(fileName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rules/${fileName}`);
  }

  // Run a specific rule
  runRule(fileName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/run/${fileName}`, {});
  }

  // Stop running automation
  stopAutomation(): Observable<any> {
    return this.http.post(`${this.apiUrl}/stop`, {});
  }

  // Get real-time logs
  getLogs(): Observable<any> {
    return this.logSubject.asObservable();
  }

  // Get screenshots for a rule run
  getScreenshots(ruleName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/screenshots/${ruleName}`);
  }

  // Get rule execution history
  getExecutionHistory(ruleName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history/${ruleName}`);
  }

  // Validate a rule before saving
  validateRule(rule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate`, rule);
  }

  // Get available actions and their properties
  getActionTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/templates/actions`);
  }

  // Get common selectors for suggestions
  getCommonSelectors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/templates/selectors`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutomationService {
  private apiUrl = environment.apiUrl;
  private wsUrl = environment.wsUrl;
  private logSubject = new Subject<any>();
  private websocket: WebSocket | null = null;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = environment.wsMaxReconnectAttempts;
  private reconnectInterval = environment.wsReconnectInterval;

  constructor(private http: HttpClient) {}

  connectWebSocket(): void {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      return;
    }

    if (!environment.enableWebSocket) {
      console.warn('WebSocket is disabled in current environment');
      return;
    }

    this.websocket = new WebSocket(this.wsUrl);
    
    this.websocket.onopen = () => {
      console.log('WebSocket connected');
      this.connectionStatus.next(true);
      this.reconnectAttempts = 0;
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
      this.connectionStatus.next(false);
      this.attemptReconnect();
    };
    
    this.websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.connectionStatus.next(false);
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket();
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnectWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      this.connectionStatus.next(false);
    }
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
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

  // Environment-specific methods
  getEnvironmentInfo(): any {
    return {
      environment: environment.environment,
      production: environment.production,
      version: environment.projectVersion,
      apiUrl: environment.apiUrl,
      wsUrl: environment.wsUrl,
      enableLogging: environment.enableLogging,
      enableScreenshots: environment.enableScreenshots,
      enableWebSocket: environment.enableWebSocket,
      debugMode: environment.enableDebugMode
    };
  }

  isDebugMode(): boolean {
    return environment.enableDebugMode;
  }

  getLogLevel(): string {
    return environment.logLevel;
  }

  getMaxConcurrentAutomations(): number {
    return environment.maxConcurrentAutomations;
  }

  getAutoRefreshInterval(): number {
    return environment.autoRefreshInterval;
  }

  getLogMaxLines(): number {
    return environment.logMaxLines;
  }
}
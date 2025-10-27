// Angular Environment Service - Reads from .env file
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private config: any = {};

  constructor(private http: HttpClient) {
    this.loadConfig();
  }

  private loadConfig() {
    // Load configuration from API endpoint that reads .env
    this.http.get('/api/config').subscribe({
      next: (config) => {
        this.config = config;
      },
      error: (error) => {
        console.warn('Failed to load environment config, using defaults:', error);
        this.config = this.getDefaultConfig();
      }
    });
  }

  private getDefaultConfig() {
    return {
      production: false,
      environment: 'development',
      apiUrl: 'http://localhost:3000/api',
      wsUrl: 'ws://localhost:8081',
      logLevel: 'debug',
      enableDebugMode: true,
      showConsoleLogs: true,
      enableSourceMaps: true,
      enableHotReload: true,
      enableDevTools: true,
      defaultPageSize: 10,
      autoRefreshInterval: 5000,
      logMaxLines: 1000,
      maxConcurrentAutomations: 5,
      apiTimeout: 30000,
      wsReconnectInterval: 5000,
      wsMaxReconnectAttempts: 5,
      fileUploadTimeout: 60000,
      enableCompression: false,
      externalApiUrl: '',
      externalApiKey: '',
      buildVersion: '1.0.0-dev',
      gitCommit: 'dev-build'
    };
  }

  get(key: string): any {
    return this.config[key];
  }

  getAll(): any {
    return this.config;
  }

  isProduction(): boolean {
    return this.config.production === true;
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isStaging(): boolean {
    return this.config.environment === 'staging';
  }

  isTest(): boolean {
    return this.config.environment === 'test';
  }
}
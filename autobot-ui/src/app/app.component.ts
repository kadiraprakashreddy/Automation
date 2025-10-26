import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="container">
      <header class="card">
        <h1>🚀 Automation Rule Builder</h1>
        <p>Create and manage automation rules with a visual interface</p>
      </header>
      
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
    
    p {
      color: #666;
      font-size: 16px;
    }
  `]
})
export class AppComponent {
  title = 'autobot-ui';
}
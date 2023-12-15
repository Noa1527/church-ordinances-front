import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  countdown = 5; // Vous pouvez ajuster ce nombre à vos besoins
  countdownMapping: { [k: string]: string } = {
    '=0': 'Redirection...',
    '=1': 'Dans une seconde',
    'other': 'Dans # secondes'
  };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.logout();
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }
}
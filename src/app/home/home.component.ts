import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  service = inject(AuthService);
  logout() {
    console.log("Logout")
    this.service.logout()
  }
  refresh() {
    this.service.refreshToken().subscribe(e => {
      console.log('refresh token ', e)
    });
  }
}

import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private service: AuthService, private _route: Router) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required)
  })

  get formControl() { return this.loginForm.controls; }

  loginCheck() {
    if (this.loginForm.invalid) { return }
    localStorage.clear()
    this.service.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe(res => {
      this.service.getCurrentUser().subscribe((user) => {
        console.log(user);
        this._route.navigate(['/home'])
      });
    });
  }






}

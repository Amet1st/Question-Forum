import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/guard/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
  
export class AppComponent implements OnInit{

  constructor(
    public au: AuthService
  ) { }

  ngOnInit(): void {
    alert(this.au.isLoggedIn);
  }
  
}

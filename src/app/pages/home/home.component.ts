import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Output() isLogout = new EventEmitter<void>() 

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.signOut();
    this.isLogout.emit();
  }

}

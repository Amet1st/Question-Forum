import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
  
export class AppComponent implements OnInit{

  constructor(
    public firebaseDatabase: AngularFireDatabase,
    public authService: AuthService
  ) { }

  ngOnInit(): void {

  }
  
}

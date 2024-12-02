import { Component, OnInit } from '@angular/core';

import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  testUser = {
    username: 'test321',
    password: '1244'
  }

  constructor(private alertCtrl: AlertController, private navCtrl: NavController) { }

  ngOnInit() {
  }


  fillTestUser() {
    this.username = 'test321';
    this.password = this.testUser.password;
  }

}

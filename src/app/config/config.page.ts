import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  selectedColor: string = 'default';
  isDarkMode: boolean = false;

  availableColors = [
    {name: 'Predeterminado', value: 'default'},
    {name: 'Rojo', value: 'red'},
    {name: 'Azul', value: 'blue'},
    {name: 'Verde', value: 'green'},
    {name: 'Amarillo', value: 'yellow'},
    {name: 'Rosado', value: 'pink'},
    {name: 'Naranja', value: 'orange'},
    {name: 'Morado', value: 'purple'},
  ];

  constructor(private storage: Storage, private platform: Platform) { }

  async ngOnInit() {

    await this.storage.create();
    await this.loadSettings();
  }

  async loadSettings() {
    this.selectedColor = (await this.storage.get('color')) || 'default';
    this.isDarkMode = (await this.storage.get('darkMode')) || false;

    this.applySettings();
  }

  applySettings() {
    this.changeColor();
    this.toggleDarkMode();
  }


  async changeColor() {
    document.body.classList.remove('red', 'blue', 'green', 'yellow', 'pink', 'orange', 'purple');
    if (this.selectedColor !== 'default') {
      document.body.classList.add(this.selectedColor);
    }

    await this.storage.set('color', this.selectedColor);
  }

  async toggleDarkMode() {
    document.body.classList.toggle('dark', this.isDarkMode);
    await this.storage.set('darkMode', this.isDarkMode);
  }

}

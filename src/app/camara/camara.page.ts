import { Component, OnInit } from '@angular/core';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
})
export class CamaraPage implements OnInit {

  photo: string | undefined;

  constructor() { }

  ngOnInit() {
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.photo = image.dataUrl;
    } catch (error) {
      console.error('Ocurrió un error al tomar una foto', error);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';


@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.page.html',
  styleUrls: ['./indicadores.page.scss'],
})
export class IndicadoresPage implements OnInit {
  items: any[] = [];
  isLoading: boolean = true;
  error: boolean = false;

  constructor(private alertCtrl: AlertController, private apiService: ApiService) { }

  ngOnInit() {

    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.error = false;
    this.apiService.getValue().subscribe(
      (data) => {
        this.items = Object.keys(data)
          .filter(key => typeof data[key] === 'object')
          .map((key) => ({ codigo: key, ...data[key] }));

        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los datos', error);
        this.error = true;
        this.isLoading = false;
      }
    );
  }


  refresh(event: any) {
    this.loadData();
    event.target.complete();
  }


  async newIndicatorAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Nuevo indicador',
      inputs: [
        {name: 'codigo',
          type: 'text',
          placeholder: 'Ingresa el código del indicador'
        },
        {name: 'nombre',
          type: 'text',
          placeholder: 'Ingresa el nombre del indicador'
        },
        {name: 'valor',
          type: 'number',
          placeholder: 'Ingresa el valor del indicador'
        },
        {name: 'unidad_medida',
          type: 'text',
          placeholder: 'Ingresa una unidad de medida'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Crear',
          handler: (data) => {
            this.createIndicator(data);
          }
        }
      ]
    });

    await alert.present();
  }


  createIndicator(data: any) {
    const newIndicator = {
      codigo: data.codigo,
      nombre: data.nombre,
      valor: data.valor,
      unidad_medida: data.unidad_medida,
      fecha: new Date().toISOString()
    };

    this.apiService.postValue(newIndicator).subscribe(
      (response) => {
        if(response.success) {
          this.items.unshift(newIndicator);
        }
      },
      (error) => {
        console.error('Error al crear un indicador - ', error);
      }
    );
  }


  async updateIndicatorAlert(items: any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar indicador',
      inputs: [
        {name: 'nombre',
          type: 'text',
          value: items.nombre,
          placeholder: 'Ingresa el nombre del indicador'
        },
        {name: 'valor',
          type: 'number',
          value: items.valor,
          placeholder: 'Ingresa el valor del indicador'
        },
        {name: 'unidad_medida',
          type: 'text',
          value: items.unidad_medida,
          placeholder: 'Ingresa una unidad de medida'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Actualizar',
          handler: (data) => {
            this.updateIndicator(data, items);
          }
        }
      ]
    });

    await alert.present();
  }


  updateIndicator(codigo: string, data: any) {
    const updatedIndicator = {
      codigo: codigo,
      nombre: data.nombre,
      valor: data.valor,
      unidad_medida: data.unidad_medida,
      fecha: new Date().toISOString()
    };

    this.apiService.putValue(updatedIndicator).subscribe(
      (response) => {
        if (response.success) {
          const index = this.items.findIndex(item => item.codigo === codigo);

          if (index !== -1) {
            this.items[index] = updatedIndicator;
          }
        }
      },
      (error) => {
        console.error('Error al actualizar un indicador - ', error);
      }
    );
  }


  async deleteConfirmation(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar el indicador ${item.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteIndicator(item.codigo);
          }
        }
      ]
    });

    await alert.present();
  }


  deleteIndicator(codigo: string) {
    this.apiService.deleteValue(codigo).subscribe(
      (response) => {
        if (response.success) {
          this.items = this.items.filter(item => item.codigo !== codigo);
        }
      },
      (error) => {
        console.error('Error al eliminar el indicador:', error);
      }
    );
  }


}

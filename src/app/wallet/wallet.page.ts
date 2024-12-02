import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  balance: number = 0;
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  currentSegment: string = 'all';
  headerText: string = 'Todas las transacciones';

  constructor(private router: Router, private navCtrl: NavController, private alertCtrl: AlertController, private toastCtrl: ToastController) { }

  ngOnInit() {

    this.loadData();
  }


  loadData() {
    const balanceString = localStorage.getItem('balance');
    const transactionString = localStorage.getItem('transactions');

    this.balance = balanceString ? parseFloat(balanceString) : 0;
    if (isNaN(this.balance)) {
      this.balance = 0;

      localStorage.setItem('balance', '0');
    }

    try {
      this.transactions = JSON.parse(transactionString || '[]');
      if (!Array.isArray(this.transactions)) {
        throw new Error('Formato de transacciones no válido');
      }
    } catch (error) {
      console.error('Error al cargar transacciones', error);
      
      this.transactions = [];
      localStorage.setItem('transactions', JSON.stringify([]));
    }

    this.segmentChanged();
  }

  segmentChanged() {
    if (this.currentSegment === 'all') {
      this.filteredTransactions = this.transactions;
      this.headerText = 'Todas las transacciones';
    } else if (this.currentSegment === 'ingreso') {
      this.filteredTransactions = this.transactions.filter(t => t.type === 'ingreso');
      this.headerText = 'Solo ingresos';
    } else if (this.currentSegment === 'gasto') {
      this.filteredTransactions = this.transactions.filter(t => t.type === 'gasto');
      this.headerText = 'Solo gastos';
    }
  }


  goToAddTransaction(type?: string) {
    this.navCtrl.navigateForward('/agregar', {
      queryParams: {
        type: type
      }
    });
  }
  

  addTransaction(type: string, amount: number, description: string) {
    const newTransaction = {
      type: type,
      amount: amount,
      description: description,
      date: new Date().toISOString(),
    };

    this.transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(this.transactions));

    this.balance += (type === 'ingreso' ? amount : -amount);
    localStorage.setItem('balance', this.balance.toString());
  }

  async deleteTransaction(transaction: any, index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar transacción',
      message: '¿Estás seguro que quieres eliminar esta transacción?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.transactions.splice(index, 1);

            if (transaction.type === 'ingreso') {
              this.balance -= transaction.amount;
            } else {
              this.balance += transaction.amount;
            }

            localStorage.setItem('transactions', JSON.stringify(this.transactions));
            localStorage.setItem('balance', this.balance.toString());

            this.segmentChanged();

            this.presentToast('Transacción eliminada');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });

    toast.present();
  }

}

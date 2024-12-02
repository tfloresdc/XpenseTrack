import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  transactionType: string = 'ingreso';
  amount: number = 0;
  description: string = '';
  date: string = new Date().toISOString();
  selectedIcon: string = 'cash-outline';

  availableIcons: string[] = [
    'cash-outline', 'cart-outline', 'wallet-outline', 'restaurant-outline',
    'card-outline', 'bar-chart-outline', 'car-outline', 'home-outline',
    'medical-outline', 'gift-outline', 'book-outline', 'briefcase-outline',
    'airplane-outline', 'bulb-outline', 'cafe-outline', 'calculator-outline',
    'build-outline', 'school-outline', 'fitness-outline', 'game-controller-outline',
    'heart-outline', 'headset-outline', 'hammer-outline', 'paw-outline',
  ]

  constructor(private navCtrl: NavController, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.transactionType = params['type'];
      }
    });
  }

  selectIcon(icon: string) {
    this.selectedIcon = icon;
  }

  addTransaction() {
    const newTransaction = {
      type: this.transactionType,
      amount: this.amount,
      description: this.description,
      date: new Date(this.date).toISOString(),
      icon: this.selectedIcon,
    };

    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    let balance = parseFloat(localStorage.getItem('balance') || '0');
    if (this.transactionType === 'ingreso') {
      balance += this.amount;
    } else {
      balance -= this.amount;
    }

    localStorage.setItem('balance', balance.toString());
    this.navCtrl.navigateBack('/wallet');
  }

}

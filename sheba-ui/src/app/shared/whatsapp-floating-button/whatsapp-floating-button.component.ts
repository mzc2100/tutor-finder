import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-floating-button',
  standalone: true,
  templateUrl: './whatsapp-floating-button.component.html',
  styleUrls: ['./whatsapp-floating-button.component.scss']
})
export class WhatsappFloatingButtonComponent {
  whatsappNumber = '8801626719163'; // Bangladesh country code + phone number
  
  openWhatsAppChat() {
    const message = 'Hello! I am interested in your services.';
    const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}
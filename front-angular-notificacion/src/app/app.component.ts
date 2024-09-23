import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Push Notificacion';
  messages: any[] = [];
  private subscription: Subscription;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.subscription = this.messageService.getMessages().subscribe(
      message => {
        this.messages.push(message);
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  sendMessage() {
    const message = `Hello, this is a test message sent at ${new Date().toLocaleTimeString()}`;
    this.messageService.sendMessage(message).subscribe(
      response => {
        console.log('Message sent successfully', response);
      },
      error => {
        console.error('Error sending message', error);
      }
    );
  }
}

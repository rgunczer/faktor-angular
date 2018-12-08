import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Commands } from '../_models/commands.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Output() message: EventEmitter<number> = new EventEmitter();
  @Input() loadingQuestions;
  @Input() loadingAnswers;
  @Input() quiz;

  onGetQuestions() {
    this.message.emit(Commands.GetQuestions);
  }

  onSend() {
    this.message.emit(Commands.Send);
  }

  onBegin() {
    this.message.emit(Commands.Begin);
  }

  onStop() {
    this.message.emit(Commands.Stop);
  }

}

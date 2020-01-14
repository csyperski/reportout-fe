import {Component, Input, OnInit} from "@angular/core";



@Component({
  selector: 'ro-nada',
  templateUrl: './nada.component.html',
  styleUrls: ['./nada.component.scss']
})
export class NadaComponent implements OnInit {

  theWord = '';

  @Input()
  display: boolean;

  @Input('msg')
  additionalMessage: string;

  private nadaWords: string[] = [
    'nada',
    'nothing',
    'nope',
    'Please disperse, nothing to see here',
    'move along',
    'nothing of interest',
    'no results',
    ':(',
    'try again',
    'sorry'
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.theWord = this.nadaWords[Math.floor(Math.random() * this.nadaWords.length)];
  }

}

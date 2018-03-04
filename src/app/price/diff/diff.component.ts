import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.scss']
})
export class DiffComponent implements OnInit {

  @Input()
  diff: number;

  constructor() { }

  ngOnInit() {
  }

}

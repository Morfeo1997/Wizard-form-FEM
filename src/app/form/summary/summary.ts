import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrls: ['./summary.css']
})
export class ThankYouComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

}
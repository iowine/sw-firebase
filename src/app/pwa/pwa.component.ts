import { Component, OnInit } from '@angular/core';
import { PwaService } from '../pwa.service';

@Component({
  selector: 'app-pwa',
  templateUrl: './pwa.component.html',
  styleUrls: ['./pwa.component.sass']
})
export class PwaComponent implements OnInit {

  Pwa: PwaService

  constructor(private pwaService: PwaService) {
    this.Pwa = pwaService
  }

  ngOnInit() {

  }

  update() {
    window.location.reload()
  }

  installPwa() {
    this.Pwa.promptEvent.prompt();
  }


}

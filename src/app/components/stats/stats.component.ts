import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  // Component objects and variables
  public slippiData: any;
  public selectedOptions: any;

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.slippiData = JSON.parse(localStorage.getItem('slippiData'));
    this.selectedOptions = JSON.parse(localStorage.getItem('selectedOptions'));

    this.storageService.changes.subscribe(storage => {
      switch (storage.key) {
        case 'slippiData':
          this.slippiData = storage.value;
          break;
        case 'selectedOptions':
          this.selectedOptions = storage.value;
          break;
      }
    });
  }

  getPlayerWins(playerNum: number) {
    return this.slippiData.games.reduce(((numWon, curVal) => {
      return curVal.players[playerNum].gameResult === 'winner' ? numWon + 1 : numWon;
    }), 0);
  }
}

import {AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {OrganizationsService} from '../shared/services/organizations.service';
import {Observable} from 'rxjs';
import {OrganizationSumm} from '../shared/interfaces';
import {ChartsModule} from 'angular-bootstrap-md';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements OnInit, AfterViewInit {

  organization: OrganizationSumm[] = []

  abackgroundColor: Array<string> = [
    '#F7464A',
    '#46BFBD',
    '#FDB45C',
    '#949FB1',
    '#4D5360',
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ]

  ahoverBackgroundColor: Array<string> = [
    '#FF5A5E',
    '#5AD3D1',
    '#FFC870',
    '#A8B3C5',
    '#616774',
    'rgba(255,99,132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ]

  chartType: string = 'pie';
  chartDatasets: Array<any> = [
    { data: [] }
  ];
  chartLabels: Array<any> = [];
  chartColors: Array<any> = [
    {
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderWidth: 2,
    }
  ];
  chartOptions: any = {
    responsive: true
  };

  constructor(private organizationService: OrganizationsService) { }

  ngOnInit(): void {
      this.organizationService.getAllOrganizationSumm().subscribe(
          org => {
              this.organization = org
          }
      )


  }

  ngAfterViewInit(): void {
      this.updateDatasetsAndLabels()
  }

    updateDatasetsAndLabels() {
      let dataSets: Array<number> = []
      let cLabels: Array<string> = []
      let tbackgroundColor: Array<string> = []
      let thoverBackgroundColor: Array<string> = []

      for(let i = 0; i < this.organization.length; i++) {
          dataSets.push(this.organization[i].summa)
          cLabels.push(this.organization[i].name)
          tbackgroundColor.push(this.abackgroundColor[i])
          thoverBackgroundColor.push(this.ahoverBackgroundColor[i])
      }

      this.chartDatasets  = [ { data: dataSets } ]
      this.chartLabels = cLabels
      this.chartColors = [{backgroundColor: tbackgroundColor, hoverBackgroundColor: thoverBackgroundColor, borderWidth: 2}]
    }

  chartClicked(e: any): void { }
  chartHovered(e: any): void { }
}

import { Component, inject, OnInit } from '@angular/core';
import { SignalrService } from '../../core/services/signalr.service';
import { Basis } from '../../shared/models/basis';
import * as Highcharts from 'highcharts/highstock';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-basis-chart',
  imports: [HighchartsChartModule],
  templateUrl: './basis-chart.component.html',
  styleUrl: './basis-chart.component.css',
})
export class BasisChartComponent implements OnInit {
  singalRService = inject(SignalrService);
  basisRateSeries: number[][] = [];
  chartOptions: Highcharts.Options = {
    series: [
      {
        data: this.basisRateSeries,
        type: 'line',
      },
    ],
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Date',
      },
      gridLineWidth: 1,
      minPadding: 0.2,
      maxPadding: 0.2,
    },
    yAxis: {
      title: {
        text: 'Value',
      },
      minPadding: 0.2,
      maxPadding: 0.2,
      plotLines: [
        {
          value: 0,
          width: 1,
          color: '#808080',
        },
      ],
    },
  }; // required
  Highcharts: typeof Highcharts = Highcharts; // required
  chartRef?: Highcharts.Chart = undefined;
  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chartRef = chart;
  };

  handleUpdate(basis_tick: number[]) {
    if (this.chartRef) {
      const today = new Date();
      this.chartRef.series[0].addPoint([
        basis_tick[0] - today.getTimezoneOffset() * 60 * 1000,
        basis_tick[1],
      ]);
    }
  }

  ngOnInit(): void {
    this.singalRService.startConnection().subscribe(() => {
      this.singalRService.hubConnection.stream('SendBasisData', 500).subscribe({
        // should be abstracted out
        next: (basis: Basis) => {
          this.basisRateSeries.push([basis.timestamp, basis.basisRate]);
          this.handleUpdate([basis.timestamp, basis.basisRate]);
        },
        complete: () => {
          console.log('stream finished');
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
    });
  }
}

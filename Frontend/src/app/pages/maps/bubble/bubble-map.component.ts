import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { NbThemeService } from '@nebular/theme';
import { registerMap } from 'echarts';

@Component({
  selector: 'ngx-bubble-map',
  styleUrls: ['./bubble-map.component.scss'],
  template: `
    <nb-card>
      <nb-card-header>Bubble Maps</nb-card-header>
      <div echarts [options]="options" class="echarts"></div>
    </nb-card>
  `,
})
export class BubbleMapComponent implements OnDestroy {

  latlong: any = {};
  mapData: any[];
  mapData2: any[];
  max = -Infinity;
  min = Infinity;
  options: any;

  bubbleTheme: any;
  geoColors: any[];

  private alive = true;

  constructor(private theme: NbThemeService,
              private http: HttpClient) {

    combineLatest([
      this.http.get('assets/map/world.json'),
      this.theme.getJsTheme(),
    ])
      .pipe(takeWhile(() => this.alive))
      .subscribe(([map, config]: [any, any]) => {

        registerMap('world', map);

        const colors = config.variables;
        this.bubbleTheme = config.variables.bubbleMap;
        this.geoColors = [colors.primary, colors.info, colors.success, colors.warning, colors.danger];
        
        interval(2000)
          .pipe(takeWhile(() => this.alive))
          .subscribe(() => {
            this.getAirTrafficInfo()
            .subscribe((res: any) => { 
              console.log('json: ', res);
              this.mapData = res['planes'];
              this.mapData2 = res['airports'];
  
                // this.mapData = [
                //   { 'latitude': 10, 'longitude': 10, 'name': 'plane x 1', 'value': 30, 'color': color1, symbolRotate: 45, symbol: 'arrow' },
                //   { 'latitude': 20, 'longitude': 20, 'name': 'plane x 2', 'value': 30, 'color': color1, symbolRotate: 10, symbol: 'arrow' },
                //   { 'latitude': 30, 'longitude': 30, 'name': 'airport x', 'value': 80, 'color': color1, symbolRotate: 60, symbol: 'triangle'},
                //   { 'latitude': 40, 'longitude': 40, 'name': 'plane y 1', 'value': 30, 'color': color2, symbolRotate: 20, symbol: 'arrow' },
                //   { 'latitude': 50, 'longitude': 50, 'name': 'airport y', 'value': 80, 'color': color2, symbolRotate: 10, symbol: 'triangle' }
                // ];
  
                // this.mapData2 = [
                //   { 'latitude': 60, 'longitude': 10, 'name': 'plane x 1', 'value': 30, 'color': color3 },
                //   { 'latitude': 60, 'longitude': 20, 'name': 'plane x 2', 'value': 30, 'color': color3 },
                //   { 'latitude': 60, 'longitude': 30, 'name': 'airport x', 'value': 80, 'color': color3 },
                //   { 'latitude': 60, 'longitude': 40, 'name': 'plane y 1', 'value': 30, 'color': color4 },
                //   { 'latitude': 60, 'longitude': 50, 'name': 'airport y', 'value': 80, 'color': color4 }        
                // ];
  
                console.log('mapdata ', this.mapData);
                console.log('mapdata2 ', this.mapData2);
  
                this.mapData.forEach((itemOpt) => {
                  if (itemOpt.value > this.max) {
                    this.max = itemOpt.value;
                  }
                  if (itemOpt.value < this.min) {
                    this.min = itemOpt.value;
                  }
                });
  
                this.options = {
                  title: {
                    text: 'World Population (2011)',
                    left: 'center',
                    top: '16px',
                    textStyle: {
                      color: this.bubbleTheme.titleColor,
                    },
                  },
                  tooltip: {
                    trigger: 'item',
                    formatter: params => {
                      return `${params.name}: ${params.value[2]}`;
                    },
                  },
                  visualMap: {
                    show: false,
                    min: 0,
                    max: this.max,
                    inRange: {
                      symbolSize: [3, 30]//,
                      //symbol: 'triangle' // overrides each individual item style
                      //symbol: 'arrow'
                    },
                  },
                  geo: {
                    name: 'World Population (2010)',
                    type: 'map',
                    map: 'world',
                    roam: true,
                    label: {
                      emphasis: {
                        show: false,
                      },
                    },
                    itemStyle: {
                      normal: {
                        areaColor: this.bubbleTheme.areaColor,
                        borderColor: this.bubbleTheme.areaBorderColor,
                      },
                      emphasis: {
                        areaColor: this.bubbleTheme.areaHoverColor,
                      },
                    },
                    zoom: 1.1,
                  },
                  series: [
                    {
                      type: 'scatter',
                      coordinateSystem: 'geo',
                      data: this.mapData.map(itemOpt => {
                        return {
                          name: itemOpt.name,
                          symbol: itemOpt.symbol,
                          symbolRotate: itemOpt.symbolRotate,
                          value: [
                            itemOpt.longitude,
                            itemOpt.latitude,
                            //itemOpt.value
                            30
                          ],
                          itemStyle: {
                            normal: {
                              color: itemOpt.color
                            },
                          }
                        };
                      }),
                    },
                    {
                      type: 'graph',
                      coordinateSystem: 'geo',
                      data: this.mapData2.map(itemOpt => {
                        return {
                          name: itemOpt.name,
                          symbol: itemOpt.symbol,
                          symbolRotate: itemOpt.symbolRotate,
                          value: [
                            itemOpt.longitude,
                            itemOpt.latitude,
                            // itemOpt.value,
                            80
                          ],
                          itemStyle: {
                            normal: {
                              color: itemOpt.color,
                            },
                          }
                        };
                      }),
                    }
                  ],
                };
            });
          });
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  private getAirTrafficInfo(){
    return this.http.get('https://localhost:44389/api/MockAirTrafficInfo');
  }
}

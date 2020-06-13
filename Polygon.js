module.exports = class Polygon {
  constructor(arrayPolygon) {
    this.arrayPolygon = arrayPolygon;
    let count = arrayPolygon.length;
    for (let i = 0; i++; i < count) {
      if (i > 0) {
        if (arrayPolygon[i][0] < this.minLng) {
          this.minLng = arrayPolygon[i][0];
          continue;
        }
        if (arrayPolygon[i][1] < this.minLat) {
          this.minLat = arrayPolygon[i][1];
          continue;
        }
        if (arrayPolygon[i][0] > this.maxLng) {
          this.maxLng = arrayPolygon[i][0];
          continue;
        }
        if (arrayPolygon[i][1] > this.maxLat) {
          this.maxLat = arrayPolygon[i][1];
          continue;
        }
      } else {
        this.minLng = arrayPolygon[i][0];
        this.minLat = arrayPolygon[i][1];
        this.maxLng = arrayPolygon[i][0];
        this.maxLat = arrayPolygon[i][1];
      }
    }
  }
  containPoint(lng, lat, strict = false) {
    if (lng < this.minLng || lat < this.minLat || lng > this.maxLng || lat > this.maxLat) {
      return false;
    } else {
      return this.isPointWithInPolygon(lng, lat, this.arrayPolygon, strict);
    }
  }

  isPointWithInPolygon(lng, lat, polygon, strict = false) {
    let crossings = 0;
    let polygonPointsCount = polygon.length;
    if (polygon[0][0] == lng && polygon[0][1] == lat) {
      // 要判断的点在多边形的第一个顶点上
      if (strict) {
        return false;
      } else {
        return true;
      }
    }
    for (let i = 0; i < polygonPointsCount - 1; i++) {
      if (polygon[i + 1][0] == lng && polygon[i + 1][1] == lat) {
        // 要判断的点在多边形的其中一个顶点上
        if (strict) {
          return false;
        } else {
          return true;
        }
      }
      if (polygon[i][0] == polygon[i + 1][0]) {
        if (lng == polygon[i][0]) {
          // 要判断的点在多边形的一条垂直竖边上
          if (strict) {
            return false;
          } else {
            return true;
          }
        } else {
          continue;
        }
      }
      // x点一个在左边，一个在右边
      let cond1 = polygon[i][0] <= lng && lng < polygon[i + 1][0];
      let cond2 = polygon[i + 1][0] <= lng && lng < polygon[i][0];
      if (cond1 || cond2) {
        // 斜率 double solpe = (y[i+1]-y[i])/(x[i+1]-x[i])
        let slope = (polygon[i + 1][1] - polygon[i][1]) / (polygon[i + 1][0] - polygon[i][0]);
        // 相邻两个点的连线在被判断点的上方
        if (strict) {
          if (lat < slope * (lng - polygon[i][0]) + polygon[i][1]) {
            crossings++;
          }
        } else {
          if (lat <= slope * (lng - polygon[i][0]) + polygon[i][1]) {
            crossings++;
          }
        }
      }
    }
    return crossings % 2 != 0;
  }
};

// src/index.ts
import { GeoPackageAPI } from "@ngageoint/geopackage";
var dotCount = function(e) {
  var result = 0, i = 0;
  for (i; i < e.length; i++) if (e[i] == ".") result++;
  return result;
};
var GADMclient = {
  getNames: async (country, level, parents, gpkg) => {
    if (typeof gpkg !== "undefined" && typeof gpkg === "string") {
      GeoPackageAPI.open(gpkg).then(async (geoPackage) => {
        var tables = geoPackage.getFeatureTables();
        const featureDao = tables.indexOf("gadm_410") !== -1 ? geoPackage.getFeatureDao("gadm_410") : tables.indexOf("ADM_ADM_" + level) !== -1 ? geoPackage.getFeatureDao("ADM_ADM_" + level) : null;
        if (featureDao !== null) {
          var query = "GID_0 == '" + country + "'";
          if (typeof parents !== "undefined") {
            const parentLevel = level - 1;
            for (var i2 in parents) {
              if (dotCount(parents[i2]) !== parentLevel) {
                throw new Error("Invalid parent codes provided.");
              }
              query += " AND GID_" + parentLevel + " == '" + parents[i2] + "'";
            }
          }
          const iterator = featureDao.queryForAll(query);
          let features = [];
          for (const row of iterator) {
            features.push(row);
          }
          features = features.map(({ geom, ...rest }) => rest);
          return features;
        } else {
          throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
        }
      });
    } else {
      const remoteResponse = await fetch(`https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_${level}.json`);
      const contentType = remoteResponse.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const resData = await remoteResponse.json();
        let data = [];
        if (typeof parents !== "undefined") {
          const parentLevel = level - 1;
          for (var i in parents) {
            if (dotCount(parents[i]) !== parentLevel) {
              throw new Error("Invalid parent codes provided.");
            }
          }
        } else {
        }
        return [];
      } else {
        throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
      }
    }
  },
  getGeometry: async (country, level, parents, gpkg) => {
    if (typeof gpkg !== "undefined" && typeof gpkg === "string") {
      GeoPackageAPI.open(gpkg).then(async (geoPackage) => {
        var tables = geoPackage.getFeatureTables();
        console.log(tables);
        const featureDao = tables.indexOf("gadm_410") !== -1 ? geoPackage.getFeatureDao("gadm_410") : tables.indexOf("ADM_ADM_" + level) !== -1 ? geoPackage.getFeatureDao("ADM_ADM_" + level) : null;
        if (featureDao !== null) {
          var query = "GID_0 == '" + country + "'";
          if (typeof parents !== "undefined") {
            const parentLevel = level - 1;
            for (var i2 in parents) {
              if (dotCount(parents[i2]) !== parentLevel) {
                throw new Error("Invalid parent codes provided.");
              }
              query += " AND GID_" + parentLevel + " == '" + parents[i2] + "'";
            }
          }
          const iterator = featureDao.queryForAll(query);
          for (const row of iterator) {
            const feature = featureDao.getRow(row);
            const geometry = feature.geometry;
            console.log(geometry);
          }
        } else {
          throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
        }
      });
    } else {
      console.log("test");
      const remoteResponse = await fetch(`https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_${level}.json`);
      const contentType = remoteResponse.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const resData = await remoteResponse.json();
        let data = null;
        if (typeof parents !== "undefined") {
          const parentLevel = level - 1;
          for (var i in parents) {
            if (dotCount(parents[i]) !== parentLevel) {
              throw new Error("Invalid parent codes provided.");
            }
          }
          data = resData["features"].filter(function(adm) {
            return parents.indexOf(adm["properties"][`GID_${parentLevel}`]) >= 0;
          });
        } else {
          data = resData["features"];
        }
        if (data.length) {
          return data.map((adm) => {
            const nameRaw = adm["properties"][`NAME_${level}`].replace(/([A-Z])/g, "$1");
            const name = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1);
            const typeRaw = adm["properties"][`ENGTYPE_${level}`].replace(/([A-Z])/g, "$1");
            const type = typeRaw.charAt(0).toUpperCase() + typeRaw.slice(1);
            return {
              "GID": adm["properties"][`GID_${level}`],
              "NAME": name,
              "TYPE": type
            };
          });
        } else {
          throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
        }
      } else {
        throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
      }
    }
  },
  getFeatures: async (country, level, parents) => {
    let data = null;
    const response = await fetch(`https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_${level}.json`);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const resData = await response.json();
      if (typeof parents !== "undefined") {
        const parentLevel = level - 1;
        for (var i in parents) {
          if (dotCount(parents[i]) !== parentLevel) {
            throw new Error("Invalid parent codes provided.");
          }
        }
        data = resData["features"].filter(function(adm) {
          return parents.indexOf(adm["properties"][`GID_${parentLevel}`]) >= 0;
        });
      } else {
        data = resData["features"];
      }
      if (data.length) {
        return data;
      } else {
        Promise.reject(new Error("No GADM data available for this request. Please check the provided country code or admin level."));
      }
    } else {
      Promise.reject(new Error("No GADM data available for this request. Please check the provided country code or admin level."));
    }
  }
};
GADMclient.getNames("BRA", 2, []);
var src_default = GADMclient;
export {
  src_default as default
};

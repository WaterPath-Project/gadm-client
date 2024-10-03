// src/index.ts
var dotCount = function(e) {
  var result = 0, i = 0;
  for (i; i < e.length; i++) if (e[i] == ".") result++;
  return result;
};
var GADMclient = {
  getNames: async (country, level, parents) => {
    const response = await fetch(`https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_${level}.json`);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const resData = await response.json();
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
  },
  getFeatures: async (country, level, parents) => {
    const response = await fetch(`https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_${level}.json`);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const resData = await response.json();
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
        return data;
      } else {
        throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
      }
    } else {
      throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
    }
  }
};
var src_default = GADMclient;
export {
  src_default as default
};

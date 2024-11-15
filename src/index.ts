// var fs = require('fs');
import {GeoPackageAPI, GeoPackage} from '@ngageoint/geopackage';

type JSONPrimitive = string | number | boolean | null | undefined;

type GADMgeometry = JSONPrimitive | GADMgeometry[] | {
    [key: string]: GADMgeometry;
};

type NotAssignableToJson = 
    | bigint 
    | symbol 
    | Function;

type JSONCompatible<T> = unknown extends T ? never : {
    [P in keyof T]: 
        T[P] extends GADMgeometry ? T[P] : 
        T[P] extends NotAssignableToJson ? never : 
        JSONCompatible<T[P]>;
};

const dotCount=function(e:string) { 
    var result = 0, i = 0;
    for(i;i<e.length;i++)if(e[i]=='.')result++;
    return result;
  };

const GADMclient = { 
  getNames : async (country: string, level: number, parents?: string[], gpkg?: string): Promise<GADMgeometry> => {
      
    if (typeof gpkg !== 'undefined' && typeof gpkg === 'string') {
        
        GeoPackageAPI.open(gpkg).then(async (geoPackage:GeoPackage) => {

            var tables = geoPackage.getFeatureTables();
            // console.log(tables);
            const featureDao = (tables.indexOf('gadm_410') !== -1 ) ? geoPackage.getFeatureDao('gadm_410'): (tables.indexOf('ADM_ADM_'+level) !== -1 ) ? geoPackage.getFeatureDao('ADM_ADM_'+level) : null;
            if (featureDao !== null) {
                var query = "GID_0 == '"+country+"'";
                if (typeof parents !== 'undefined') {
                    const parentLevel = level - 1;
                    for (var i in parents) {
                        if (dotCount(parents[i])!== parentLevel) {
                            throw new Error("Invalid parent codes provided.")
                            // Promise.reject(new Error('Invalid parent codes provided.'))
                        }
                        query += " AND GID_"+parentLevel+" == '"+parents[i]+"'";
                    }
                }
                const iterator = featureDao.queryForAll(query)

                let features = [];
                for(const row of iterator) {
                    features.push(row)
                }
                features = features.map(({geom, ...rest}) => rest)
                return features;
            }
            else {
                throw new Error("No GADM data available for this request. Please check the provided country code or admin level.")
            }
        })
    }
    else {
        const remoteResponse = await fetch(`https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_${level}.json`)
        const contentType = remoteResponse.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const resData:any = await remoteResponse.json()
            let data = [];
            if (typeof parents !== 'undefined') {
                const parentLevel = level - 1;
                for (var i in parents) {
                    if (dotCount(parents[i])!== parentLevel) {
                        throw new Error("Invalid parent codes provided.")
                        // Promise.reject(new Error('Invalid parent codes provided.'))
                    } 
                }
                // data = resData["features"].filter(function (adm:any) {
                //     return parents.indexOf(adm["properties"][`GID_${parentLevel}`]) >= 0; 
                // });
            }
            else {
                // data = resData["features"]
            }
            // if (data.length > 0) {
            //     // console.log(data.map((adm:any) => adm["properties"]))
            //     return data
            //     // return data.map( (adm:any) => { return adm["properties"] })
            // }
            // else {
            //     // Promise.reject(new Error(("No GADM data available for this request. Please check the provided country code or admin level.")))
            //     throw new Error("No GADM data available for this request. Please check the provided country code or admin level.")

            // }
            return []
        } 
        else {
            // Promise.reject(new Error(("No GADM data available for this request. Please check the provided country code or admin level.")))
            throw new Error("No GADM data available for this request. Please check the provided country code or admin level.")
        }
    }
  },
  getFeatures : async (country: string, level: number, parents?: string[]): Promise<GADMgeometry> => {
    let data = null;
    const response = await fetch(`https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_${country}_${level}.json`)
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const resData:any = await response.json()
        if (typeof parents !== 'undefined') {
            const parentLevel = level - 1;
            for (var i in parents) {
                if (dotCount(parents[i]) !== parentLevel) {
                    throw new Error("Invalid parent codes provided.")
                } 
            }
            data = resData["features"].filter(function (adm:any) {
                return parents.indexOf(adm["properties"][`GID_${parentLevel}`]) >= 0; 
            });
        }
        else {
            data = resData["features"]
        }
        if (data.length) {
            return data
        }
        else {
            Promise.reject(new Error(("No GADM data available for this request. Please check the provided country code or admin level.")))
            // throw new Error("No GADM data available for this request. Please check the provided country code or admin level.")
        }
    } 
    else {
        Promise.reject(new Error(("No GADM data available for this request. Please check the provided country code or admin level.")))
        // throw new Error("No GADM data available for this request. Please check the provided country code or admin level.")
    }
    
  }
}

// GADMclient.getNames("BRA", 2, [], "public/gadm41_BRA.gpkg");
GADMclient.getNames("BRA", 2, []);

export default GADMclient;

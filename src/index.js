"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// var fs = require('fs');
var geopackage_1 = require("@ngageoint/geopackage");
var dotCount = function (e) {
    var result = 0, i = 0;
    for (i; i < e.length; i++)
        if (e[i] == '.')
            result++;
    return result;
};
var GADMclient = {
    getNames: function (country, level, parents, gpkg) { return __awaiter(void 0, void 0, void 0, function () {
        var remoteResponse, contentType, resData, data, parentLevel, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof gpkg !== 'undefined' && typeof gpkg === 'string')) return [3 /*break*/, 1];
                    geopackage_1.GeoPackageAPI.open(gpkg).then(function (geoPackage) { return __awaiter(void 0, void 0, void 0, function () {
                        var tables, featureDao, query, parentLevel, i, iterator, features, _i, iterator_1, row;
                        return __generator(this, function (_a) {
                            tables = geoPackage.getFeatureTables();
                            featureDao = (tables.indexOf('gadm_410') !== -1) ? geoPackage.getFeatureDao('gadm_410') : (tables.indexOf('ADM_ADM_' + level) !== -1) ? geoPackage.getFeatureDao('ADM_ADM_' + level) : null;
                            if (featureDao !== null) {
                                query = "GID_0 == '" + country + "'";
                                if (typeof parents !== 'undefined') {
                                    parentLevel = level - 1;
                                    for (i in parents) {
                                        if (dotCount(parents[i]) !== parentLevel) {
                                            throw new Error("Invalid parent codes provided.");
                                            // Promise.reject(new Error('Invalid parent codes provided.'))
                                        }
                                        query += " AND GID_" + parentLevel + " == '" + parents[i] + "'";
                                    }
                                }
                                iterator = featureDao.queryForAll(query);
                                features = [];
                                for (_i = 0, iterator_1 = iterator; _i < iterator_1.length; _i++) {
                                    row = iterator_1[_i];
                                    features.push(row);
                                }
                                features = features.map(function (_a) {
                                    var geom = _a.geom, rest = __rest(_a, ["geom"]);
                                    return rest;
                                });
                                return [2 /*return*/, features];
                            }
                            else {
                                throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, fetch("https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_".concat(country, "_").concat(level, ".json"))];
                case 2:
                    remoteResponse = _a.sent();
                    contentType = remoteResponse.headers.get("content-type");
                    if (!(contentType && contentType.indexOf("application/json") !== -1)) return [3 /*break*/, 4];
                    return [4 /*yield*/, remoteResponse.json()];
                case 3:
                    resData = _a.sent();
                    data = [];
                    if (typeof parents !== 'undefined') {
                        parentLevel = level - 1;
                        for (i in parents) {
                            if (dotCount(parents[i]) !== parentLevel) {
                                throw new Error("Invalid parent codes provided.");
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
                    return [2 /*return*/, []];
                case 4: 
                // Promise.reject(new Error(("No GADM data available for this request. Please check the provided country code or admin level.")))
                throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
                case 5: return [2 /*return*/];
            }
        });
    }); },
    getGeometry: function (country, level, parents, gpkg) { return __awaiter(void 0, void 0, void 0, function () {
        var remoteResponse, contentType, resData, data, parentLevel_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof gpkg !== 'undefined' && typeof gpkg === 'string')) return [3 /*break*/, 1];
                    geopackage_1.GeoPackageAPI.open(gpkg).then(function (geoPackage) { return __awaiter(void 0, void 0, void 0, function () {
                        var tables, featureDao, query, parentLevel, i, iterator, _i, iterator_2, row, feature, geometry;
                        return __generator(this, function (_a) {
                            tables = geoPackage.getFeatureTables();
                            console.log(tables);
                            featureDao = (tables.indexOf('gadm_410') !== -1) ? geoPackage.getFeatureDao('gadm_410') : (tables.indexOf('ADM_ADM_' + level) !== -1) ? geoPackage.getFeatureDao('ADM_ADM_' + level) : null;
                            if (featureDao !== null) {
                                query = "GID_0 == '" + country + "'";
                                if (typeof parents !== 'undefined') {
                                    parentLevel = level - 1;
                                    for (i in parents) {
                                        if (dotCount(parents[i]) !== parentLevel) {
                                            throw new Error("Invalid parent codes provided.");
                                            // Promise.reject(new Error('Invalid parent codes provided.'))
                                        }
                                        query += " AND GID_" + parentLevel + " == '" + parents[i] + "'";
                                    }
                                }
                                iterator = featureDao.queryForAll(query);
                                // const iterator = featureDao.queryForLike('GID_1','%GRC.8_1%');
                                // const iterator = featureDao.queryForAll("GID_0 == '"+country+"' AND GID_"+level+" IS NOT NULL");
                                for (_i = 0, iterator_2 = iterator; _i < iterator_2.length; _i++) {
                                    row = iterator_2[_i];
                                    feature = featureDao.getRow(row);
                                    geometry = feature.geometry;
                                    console.log(geometry);
                                }
                            }
                            else {
                                throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    return [3 /*break*/, 5];
                case 1:
                    console.log('test');
                    return [4 /*yield*/, fetch("https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_".concat(country, "_").concat(level, ".json"))];
                case 2:
                    remoteResponse = _a.sent();
                    contentType = remoteResponse.headers.get("content-type");
                    if (!(contentType && contentType.indexOf("application/json") !== -1)) return [3 /*break*/, 4];
                    return [4 /*yield*/, remoteResponse.json()];
                case 3:
                    resData = _a.sent();
                    data = null;
                    if (typeof parents !== 'undefined') {
                        parentLevel_1 = level - 1;
                        for (i in parents) {
                            if (dotCount(parents[i]) !== parentLevel_1) {
                                throw new Error("Invalid parent codes provided.");
                                // Promise.reject(new Error('Invalid parent codes provided.'))
                            }
                        }
                        data = resData["features"].filter(function (adm) {
                            return parents.indexOf(adm["properties"]["GID_".concat(parentLevel_1)]) >= 0;
                        });
                    }
                    else {
                        data = resData["features"];
                    }
                    if (data.length) {
                        return [2 /*return*/, data.map(function (adm) {
                                var nameRaw = adm["properties"]["NAME_".concat(level)].replace(/([A-Z])/g, "$1");
                                var name = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1);
                                var typeRaw = adm["properties"]["ENGTYPE_".concat(level)].replace(/([A-Z])/g, "$1");
                                var type = typeRaw.charAt(0).toUpperCase() + typeRaw.slice(1);
                                return {
                                    "GID": adm["properties"]["GID_".concat(level)],
                                    "NAME": name,
                                    "TYPE": type,
                                };
                            })];
                    }
                    else {
                        // Promise.reject(new Error(("No GADM data available for this request. Please check the provided country code or admin level.")))
                        throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
                    }
                    return [3 /*break*/, 5];
                case 4: 
                // Promise.reject(new Error(("No GADM data available for this request. Please check the provided country code or admin level.")))
                throw new Error("No GADM data available for this request. Please check the provided country code or admin level.");
                case 5: return [2 /*return*/];
            }
        });
    }); },
    getFeatures: function (country, level, parents) { return __awaiter(void 0, void 0, void 0, function () {
        var data, response, contentType, resData, parentLevel_2, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = null;
                    return [4 /*yield*/, fetch("https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_".concat(country, "_").concat(level, ".json"))];
                case 1:
                    response = _a.sent();
                    contentType = response.headers.get("content-type");
                    if (!(contentType && contentType.indexOf("application/json") !== -1)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    resData = _a.sent();
                    if (typeof parents !== 'undefined') {
                        parentLevel_2 = level - 1;
                        for (i in parents) {
                            if (dotCount(parents[i]) !== parentLevel_2) {
                                throw new Error("Invalid parent codes provided.");
                            }
                        }
                        data = resData["features"].filter(function (adm) {
                            return parents.indexOf(adm["properties"]["GID_".concat(parentLevel_2)]) >= 0;
                        });
                    }
                    else {
                        data = resData["features"];
                    }
                    if (data.length) {
                        return [2 /*return*/, data];
                    }
                    else {
                        Promise.reject(new Error(("No GADM data available for this request. Please check the provided country code or admin level.")));
                        // throw new Error("No GADM data available for this request. Please check the provided country code or admin level.")
                    }
                    return [3 /*break*/, 4];
                case 3:
                    Promise.reject(new Error(("No GADM data available for this request. Please check the provided country code or admin level.")));
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); }
};
// GADMclient.getNames("BRA", 2, [], "public/gadm41_BRA.gpkg");
GADMclient.getNames("BRA", 2, []);
exports.default = GADMclient;

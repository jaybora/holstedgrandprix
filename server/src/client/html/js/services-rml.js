'use strict';

/* Services */

angular.module('radiatorinfo.services', []).
    factory('MDService', function ($http) {
        var MDServiceUrl = '/webbill-master-data-service/rest';

        // If running on local machine then add domain to url (for development and debug purposes)
        var prefixUrl = "";
        if (document.domain === 'local.brunata.dk' || document.domain === 'localhost') {
            prefixUrl = "http://pandium.brunata.dk";
            //prefixUrl = "http://local.brunata.dk:8080";
        }

        return {
            postNewRadiator: function (radiator, locationMeterId) {
                var url = prefixUrl + MDServiceUrl + "/radiator?locationmeterid=" + locationMeterId;
                return $http.post(url, radiator, {withCredentials: true, isArray: false});
            },
            updateRadiator: function (radiator) {
                var url = prefixUrl + MDServiceUrl + "/radiator/";
                return $http.put(url, radiator, {withCredentials: true, isArray: false});
            },
            getAllBranches: function () {
                var url = prefixUrl + MDServiceUrl + "/crud/branch";
                return $http.get(url, {withCredentials: true, isArray: false, cache: true});
            },
            getRadiators: function (locationMeterId) {
                var url = prefixUrl + MDServiceUrl + "/radiator?locationmeterid=" + locationMeterId;
                return $http.get(url, {withCredentials: true, isArray: true});
            },
            getLocationMeter: function (locationMeterId) {
                var url = prefixUrl + MDServiceUrl + "/building?locationmeterid=" + locationMeterId;
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getLocation: function (locationId) {
                var url = prefixUrl + MDServiceUrl + "/building?locationid=" + locationId;
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getLocationNeighbours: function (locationId) {
                var url = prefixUrl + MDServiceUrl + "/neighbourlocations?locationid=" + locationId;
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getBranch: function (buildingno) {
                var url = prefixUrl + MDServiceUrl + "/building/" + buildingno + "/branch";
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getMeasureObjects: function () {
                var url = prefixUrl + MDServiceUrl + "/measureobjects";
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getBuilding: function (buildingno) {
                var url = prefixUrl + MDServiceUrl + "/building/" + buildingno;
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            }
        };
    }).
    factory('RMLService', function ($http) {
        var RMLServiceUrl = '/radiator-model-library-service/rest';

        // If running on local machine then add domain to url (for development and debug purposes)
        var prefixUrl = "";
        if (document.domain === 'local.brunata.dk' || document.domain === 'localhost') {
            prefixUrl = "http://pandium.brunata.dk";
            //prefixUrl = "http://local.brunata.dk:8080";
        }

        return {
            getRadiatorTypes: function () {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatortype";
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getRadiatorType: function (radiatorTypeId) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatortype/" + radiatorTypeId;
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getFlowTypes: function () {
                var url = prefixUrl + RMLServiceUrl + "/direct/flowtype";
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getTappings: function () {
                var url = prefixUrl + RMLServiceUrl + "/direct/tapping";
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getKcValues: function (radiatormodelid) {
                var url = prefixUrl + RMLServiceUrl + "/direct/kcvalue?radiatormodelid=" + radiatormodelid;
                return $http.get(url, {withCredentials: true, isArray: true});
            },
            updateKcValue: function (kcValue) {
                var url = prefixUrl + RMLServiceUrl + "/direct/kcvalue/";
                return $http.put(url, kcValue, {withCredentials: true, isArray: false});
            },
            deleteKcValue: function (kcValue) {
                var url = prefixUrl + RMLServiceUrl + "/direct/kcvalue/" + kcValue.KCVALUEID;
                return $http.delete(url, {withCredentials: true, isArray: false});
            },
            insertKcValue: function (kcValue) {
                var url = prefixUrl + RMLServiceUrl + "/direct/kcvalue/";
                return $http.post(url, kcValue, {withCredentials: true, isArray: false});
            },
            getRadiatorMeterGroups: function () {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormetergroup";
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getMeterPlacements: function () {
                var url = prefixUrl + RMLServiceUrl + "/direct/meterplacement";
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getRadiatorPlacements: function () {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorplacement";
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getRadiatorManufacturers: function (countrycode) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormanufacturer";
                if (countrycode !== undefined && countrycode !== null) {
                    url = url + "?countrycode=" + countrycode;
                }
                return $http.get(url, {withCredentials: true, isArray: true});
            },
            deleteRadiatorManufacturer: function (id) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormanufacturer/" + id;
                return $http.delete(url, {withCredentials: true, isArray: true});
            },
            createRadiatorManufacturer: function (radiatormanufactureritem) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormanufacturer/";
                return $http.post(url, radiatormanufactureritem, {withCredentials: true, isArray: false});
            },
            getRadiatorManufacturer: function (radiatorManufacturerId) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormanufacturer/" + radiatorManufacturerId;
                return $http.get(url, {withCredentials: true, isArray: false});
            },
            updateRadiatorManufacturer: function (radiatormanufactureritem) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormanufacturer/";
                return $http.put(url, radiatormanufactureritem, {withCredentials: true, isArray: false});
            },
            getRadiatorModels: function (countryCode) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormodel";
                if (countryCode !== undefined && countryCode !== null) {
                    url = url + "?countrycode=" + countryCode;
                }
                return $http.get(url, {withCredentials: true, isArray: true, cache: false});
            },
            updateRadiatorModel: function (modelItem) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormodel";
                return $http.put(url, modelItem, {withCredentials: true, isArray: false});
            },
            getDirectRadiatorModel: function (radiatorModelId) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormodel/" + radiatorModelId;
                return $http.get(url, {withCredentials: true, isArray: false});
            },
            deleteRadiatorModel: function (id) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormodel/" + id;
                return $http.delete(url, {withCredentials: true, isArray: true});
            },
            createRadiatorModel: function (radiatorModelItem) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormodel/";
                return $http.post(url, radiatorModelItem, {withCredentials: true, isArray: false});
            },
            createRadiatorVariant: function (variantItem) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorvariant/";
                return $http.post(url, variantItem, {withCredentials: true, isArray: false});
            },
            getRadiatorVariants: function (parameterObject) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorvariant";
                var cache = false;
                if (parameterObject) {
                    if (parameterObject.countryCode) {
                        url = url + "?countrycode=" + parameterObject.countryCode;
                    }
                    if (parameterObject.radiatorModelId) {
                        url = url + "?radiatormodelid=" + parameterObject.radiatorModelId;
                    }
                    if (parameterObject.cache) {
                        cache = parameterObject.cache;
                    }
                }
                return $http.get(url, {withCredentials: true, isArray: true, cache: cache});
            },
            getRadiatorVariant: function (radiatorVariantId) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorvariant/" + radiatorVariantId;
                return $http.get(url, {withCredentials: true, isArray: false});
            },
            updateRadiatorVariant: function (radiatorVariant) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorvariant";
                return $http.put(url, radiatorVariant, {withCredentials: true, isArray: false});
            },
            deleteRadiatorVariant: function (id) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorvariant/" + id;
                return $http.delete(url, {withCredentials: true, isArray: true});
            },
            getRadiatorHeight: function (radiatorHeightId) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorheight/" + radiatorHeightId;
                return $http.get(url, {withCredentials: true, isArray: false, cache: false});
            },
            createRadiatorHeight: function (radiatorHeight) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorheight";
                return $http.post(url, radiatorHeight, {withCredentials: true, isArray: false});
            },
            updateRadiatorHeight: function (radiatorHeight) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorheight";
                return $http.put(url, radiatorHeight, {withCredentials: true, isArray: false});
            },
            deleteRadiatorHeight: function (radiatorHeight) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorheight/" + radiatorHeight.RADIATORHEIGHTID;
                return $http.delete(url, {withCredentials: true, isArray: false});
            },
            getRadiatorHeights: function (parameterObject) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorheight";
                var cache = false;
                if (parameterObject) {
                    if (parameterObject.countryCode) {
                        url = url + "?countrycode=" + parameterObject.countryCode;
                    }
                    if (parameterObject.radiatorVariantId) {
                        url = url + "?radiatorvariantid=" + parameterObject.radiatorVariantId;
                    }
                    if (parameterObject.cache) {
                        cache = parameterObject.cache;
                    }
                }
                return $http.get(url, {withCredentials: true, isArray: true, cache: cache});
            },
            getRadiatorPerformances: function (parameterObject) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorperformance";
                var cache = false;
                if (parameterObject) {
                    if (parameterObject.countryCode) {
                        url = url + "?countrycode=" + parameterObject.countryCode;
                    }
                    if (parameterObject.radiatorVariantId) {
                        url = url + "?radiatorvariantid=" + parameterObject.radiatorVariantId;
                    }
                    if (parameterObject.cache) {
                        cache = parameterObject.cache;
                    }
                }
                return $http.get(url, {withCredentials: true, isArray: true, cache: cache});
            },
            getRadiatorPerformance: function (radiatorPerformanceId) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorperformance/" + radiatorPerformanceId;
                return $http.get(url, {withCredentials: true, isArray: false, cache: false});
            },
            updateRadiatorPerformance: function (radiatorPerformance) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorperformance";
                return $http.put(url, radiatorPerformance, {withCredentials: true, isArray: false});
            },
            createRadiatorPerformance: function (radiatorPerformance) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorperformance";
                return $http.post(url, radiatorPerformance, {withCredentials: true, isArray: false});
            },
            deletePerformance: function (performance) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorperformance/" + performance.RADIATORPERFORMANCEID;
                return $http.delete(url, {withCredentials: true, isArray: false});
            },
            getAccessRights: function () {
                var url = prefixUrl + RMLServiceUrl + "/accessrights";
                return $http.get(url, {withCredentials: true, isArray: true, cache: true});
            },
            getRadiatorNote: function (radiatorModelId) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatornote?radiatormodelid=" + radiatorModelId;
                return $http.get(url, {withCredentials: true, isArray: true});
            },
            updateRadiatorNote: function (radiatorNote) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatornote/";
                return $http.put(url, radiatorNote, {withCredentials: true, isArray: false});
            },
            createRadiatorNote: function (radiatorNote) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatornote/";
                return $http.post(url, radiatorNote, {withCredentials: true, isArray: false});
            },
            deleteRadiatorNote: function (id) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatornote/" + id;
                return $http.delete(url, {withCredentials: true, isArray: false});
            },
            getRadiatorUsedInCountry: function(radiatorModelId) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormodel/" + radiatorModelId + "/radiatorusedincountry";
                return $http.get(url, {withCredentials: true, isArray: true});
            },
            deleteRadiatorUsedInCountry: function (radiatorModelId, countryCode) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormodel/" + radiatorModelId + "/radiatorusedincountry/" + countryCode;
                return $http.delete(url, {withCredentials: true, isArray: false});
            },
            addRadiatorUsedInCountry: function (radiatorUsedInCountryObj) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatormodel/notused/radiatorusedincountry";
                return $http.post(url, radiatorUsedInCountryObj, {withCredentials: true, isArray: false});
            },
            // Depricated. Use getRadiatorModelTree(parameterObject) instead
            getRadiatorModel: function (manufacturercode, modelcode, variantcode) {
                if (manufacturercode === undefined) {
                    manufacturercode = "";
                }
                if (modelcode === undefined) {
                    modelcode = "";
                }
                if (variantcode === undefined) {
                    variantcode = "";
                }

                var url = prefixUrl + RMLServiceUrl +
                    "/radiatormodel?radiatorcode-manufacturer=" + manufacturercode +
                    "&radiatorcode-model=" + modelcode +
                    "&radiatorcode-variant=" + variantcode;
                return $http.get(url, {withCredentials: true, isArray: true, cache: false});
            },
            getRadiatorModelTree: function (parameterObject) {
                var url = prefixUrl + RMLServiceUrl + "/radiatormodel";
                var cache = false;

                if (parameterObject) {
                    var firstParameter = true;
                    for (var key in parameterObject) {
                        if (key === "cache") {
                            cache = parameterObject.cache;
                        } else {
                            if (firstParameter) {
                                url = url + "?" + key.toLowerCase() + "=" + parameterObject[key];
                                firstParameter = false;
                            } else {
                                url = url + "&" + key.toLowerCase() + "=" + parameterObject[key];
                            }
                        }
                    }
                }
                return $http.get(url, {withCredentials: true, isArray: true, cache: cache});
            },
            getAttachments: function (radiatorModelId) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorattachment?radiatormodelid=" + radiatorModelId;
                return $http.get(url, {withCredentials: true, isArray: false});
            },
            createAttachment: function (attachment) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorattachment";
                return $http.post(url, attachment, {withCredentials: true, isArray: false});
            },
            deleteAttachment: function (radiatorAttachmentId) {
                var url = prefixUrl + RMLServiceUrl + "/direct/radiatorattachment/" + radiatorAttachmentId;
                return $http.delete(url, {withCredentials: true, isArray: false});
            },
            getAutoScale: function (variantid, height, length, locationmeterid, meterplacementid, radiatorplacementid, tappingid) {
                var url = prefixUrl + RMLServiceUrl + "/scalecalc"
                    + "?radiatorvariantid=" + (variantid ? variantid : "") +
                    "&length=" + (length ? length : "") +
                    "&height=" + (height ? height : "") +
                    "&locationmeterid=" + (locationmeterid ? locationmeterid : "") +
                    "&radiatorplacementid=" + (radiatorplacementid ? radiatorplacementid : "") +
                    "&tappingid=" + (tappingid ? tappingid : "") +
                    "&meterplacementid=" + (meterplacementid ? meterplacementid : "");
                return $http.get(url, {withCredentials: true, isArray: false, cache: true});
            },
            getAutoScaleCancellable: function (variantid, height, length, locationmeterid, meterplacementid, radiatorplacementid, tappingid, canceller) {
                var url = prefixUrl + RMLServiceUrl + "/scalecalc"
                    + "?radiatorvariantid=" + (variantid ? variantid : "") +
                    "&length=" + (length ? length : "") +
                    "&height=" + (height ? height : "") +
                    "&locationmeterid=" + (locationmeterid ? locationmeterid : "") +
                    "&radiatorplacementid=" + (radiatorplacementid ? radiatorplacementid : "") +
                    "&tappingid=" + (tappingid ? tappingid : "") +
                    "&meterplacementid=" + (meterplacementid ? meterplacementid : "");
                // Cache is turned off, because if the request is cancelled, the result will
                // still get cached, and all following requests will return null.
                return $http.get(url, {withCredentials: true, isArray: false, cache: false, timeout: canceller.promise});
            }
        };
    })

    .factory('RMLDataFactory', function ($q, RMLService, MDService) {
        // This factory makes sure that every controller, that needs RML-data, gets the same objects returned. If
        // the controllers used the RMLService directly, they would each get their own objects, witch results in
        // poor performance on pages with lots of controllers, using RML-data.

        // Use this factory by calling getPromise(locationmeterid) first to initialize the promise. Then call then()
        // on the promise, and you can call the other getter methods.

        var radiatorTypes = null;
        var tappings = null;
        var meterPlacements = null;
        var radiatorPlacements = null;
        var branch = null;
        var radiatorModels = null;
        var radiatorVariants = null;
        var radiatorHeights = null;
        var radiatorManufacturers = null;
        var allDataPromise;

        var loadRadiatorTypes = RMLService.getRadiatorTypes().success(function (data) {
            radiatorTypes = data;
        });

        var loadTappings = RMLService.getTappings().success(function (data) {
            tappings = data;
        });

        var loadMeterPlacements = RMLService.getMeterPlacements().success(function (data) {
            meterPlacements = data;
        });

        var loadRadiatorPlacements = RMLService.getRadiatorPlacements().success(function (data) {
            radiatorPlacements = data;
        });

        var loadBuilding = function (locationmeterid) {
            return MDService.getLocationMeter(locationmeterid).then(function (buildingResponse) {
                var building;
                for (var buildingno in buildingResponse.data.building) {
                    building = buildingResponse.data.building[buildingno];
                    break; // We only expect to have one building, so we break out of building loop.
                }
                return building;
            });
        };

        var loadBranch = function (buildingno) {
            return MDService.getBranch(buildingno).then(function (branchResponse) {
                branch = branchResponse.data;
                return branch;
            });
        };

        var loadCountryDependentRadiatorInfo = function (countryCode) {
            var loadRadiatorModels = RMLService.getRadiatorModels(countryCode).success(function (data) {
                radiatorModels = data;
            });
            var loadRadiatorVariants = RMLService.getRadiatorVariants({countrycode: countryCode, cache: true}).success(function (data) {
                radiatorVariants = data;
            });
            var loadRadiatorHeights = RMLService.getRadiatorHeights({countrycode: countryCode, cache: true}).success(function (data) {
                radiatorHeights = data;
            });
            var loadRadiatorManufacturers = RMLService.getRadiatorManufacturers(countryCode).success(function (data) {
                radiatorManufacturers = data;
            });

            return $q.all([loadRadiatorModels
                    , loadRadiatorVariants
                    , loadRadiatorHeights
                    , loadRadiatorManufacturers]);
        };

        var loadBuildingDependent = function (locationMeterId) {
            return loadBuilding(locationMeterId)
                .then(function (building) {
                    return $q.all([
                        loadBranch(building.buildingno),
                        loadCountryDependentRadiatorInfo(building.countrycode)
                    ]);
                });
        };

        return {
            getPromise: function (locationMeterId) {
                // Initialize with locationmeterid first time the promise is fetched.
                if (!allDataPromise) {
                    allDataPromise = $q.all([loadRadiatorTypes, loadTappings, loadMeterPlacements, loadRadiatorPlacements, loadBuildingDependent(locationMeterId)]);
                }
                return allDataPromise;
            },
            getRadiatorTypes: function () {
                return radiatorTypes;
            },
            getTappings: function() {
                return tappings;
            },
            getMeterPlacements: function () {
                return meterPlacements;
            },
            getRadiatorPlacements: function () {
                return radiatorPlacements;
            },
            getBranch: function () {
                return branch;
            },
            getRadiatorModels: function () {
                return radiatorModels;
            },
            getRadiatorVariants: function () {
                return radiatorVariants;
            },
            getRadiatorHeights: function () {
                return radiatorHeights;
            },
            getRadiatorManufacturers: function () {
                return radiatorManufacturers;
            }
        };
    })

    .factory('ContextService', function (RMLService) {
        // The Context Service is used to pass context between pages.
        var context = {};
        context.performance = {};
        context.variant = {};
        context.model = {};
        context.manufacturer = {};
        context.radiatorType = {};

        context.getVariantContext = function (radiatorVariantId) {
            if (!context.variant || !context.variant.RADIATORVARIANTID) {
                RMLService.getRadiatorVariant(radiatorVariantId).success(function (data) {
                    context.variant = data;
                    if (!context.model || !context.model.RADIATORMODELID) {
                        context.getModelContext(context.variant.RADIATORMODELID);
                    }
                });
            } else if (!context.model || !context.model.RADIATORMODELID) {
                context.getModelContext(context.variant.RADIATORMODELID);
            }
        };

        context.getModelContext = function (radiatorModelId) {
            if (!context.model || !context.model.RADIATORMODELID) {
                RMLService.getDirectRadiatorModel(radiatorModelId).success(function (data) {
                    context.model = data;
                    if (!context.manufacturer || !context.manufacturer.RADIATORMANUFACTURERID) {
                        context.getManufacturerContext(context.model.RADIATORMANUFACTURERID);
                    }
                    if (!context.radiatorType || !context.radiatorType.RADIATORTYPEID) {
                        context.getRadiatorTypeContext(context.model.RADIATORTYPEID);
                    }
                });
            } else {
                if (!context.manufacturer || !context.manufacturer.RADIATORMANUFACTURERID) {
                    context.getManufacturerContext(context.model.RADIATORMANUFACTURERID);
                }
                if (!context.radiatorType || !context.radiatorType.RADIATORTYPEID) {
                    context.getRadiatorTypeContext(context.model.RADIATORTYPEID);
                }
            }
        };

        context.getManufacturerContext = function (radiatorManufacturerId) {
            if (!context.manufacturer || !context.manufacturer.RADIATORMANUFACTURERID) {
                RMLService.getRadiatorManufacturer(radiatorManufacturerId).
                        success(function (data) {
                            context.manufacturer = data;
                        });
            }
        };

        context.getRadiatorTypeContext = function (radiatorTypeId) {
            RMLService.getRadiatorType(radiatorTypeId).
                    success(function (data) {
                        context.radiatorType = data;
                    });
        };

        return context;
    });

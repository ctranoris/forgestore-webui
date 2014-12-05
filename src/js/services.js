var appServices = angular.module('forgestorewebapp.services',[]);


appServices.factory('APIEndPointService', function() {
	  return {	      
	      //APIURL: "http://www.forgestore.eu:443/fsapi/",
		  //WEBURL: "http://83.212.106.218/bakertest/forgestore/",
		  APIURL: "http://localhost:13000/fsapi/",
		  WEBURL: "http://127.0.0.1:13000/forgestore/"
	  };
});


	
//FStoreUser Resource
appServices.factory('FStoreUser', function($resource, APIEndPointService) {
	return $resource(APIEndPointService.APIURL+"services/api/repo/users/:id", 
			{ id: '@id' }, {
	    update: {
	        method: 'PUT' // this method issues a PUT request
        	
	      }
	});
});


appServices.factory('SessionService', function($resource, APIEndPointService) {
	return $resource(APIEndPointService.APIURL+"services/api/repo/sessions/");
});


appServices.service('popupService',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
});




//Category Resource
appServices.factory('Category', function($resource, APIEndPointService) {
	return $resource(APIEndPointService.APIURL+"services/api/repo/categories/:id", 
			{ id: '@id' }, {
	    update: {
	        method: 'PUT' // this method issues a PUT request
        	
	      }
	});
});


appServices.factory('formDataObject', function() {
	return function(data) {
		var fd = new FormData();
		angular.forEach(data, function(value, key) {
			if (value){
				fd.append(key, value);
				//console.log("key="+key+", value="+value);
			}else{
				fd.append(key, "");
			}
				
		});
		return fd;
	};
});


//fireadapters Resource
appServices.factory('ServiceMetadata', function($resource, APIEndPointService) {
	return $resource(APIEndPointService.APIURL+"services/api/repo/fireadapters/:id", 
		{id : "@id"	}, {
		"update" : {
			method : "PUT"
		}

	});
});

//Widget Resource
appServices.factory('Widget', function($resource, APIEndPointService) {
	return $resource(APIEndPointService.APIURL+"services/api/repo/widgets/:id", 
		{id : "@id"	}, {
		"update" : {
			method : "PUT"
		}

	});
});


//Course Resource
appServices.factory('Course', function($resource, APIEndPointService) {
	return $resource(APIEndPointService.APIURL+"services/api/repo/courses/:id", 
		{id : "@id"	}, {
		"update" : {
			method : "PUT"
		}

	});
});


//FStoreProperty Resource
appServices.factory('FStoreProperty', function($resource, APIEndPointService) {
	return $resource(APIEndPointService.APIURL+"services/api/repo/properties/:id", 
			{ id: '@id' }, {
	    update: {
	        method: 'PUT' // this method issues a PUT request
        	
	      }
	});
});





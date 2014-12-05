var appControllers = angular.module('forgestorewebapp.controllers',[]) 


appControllers.controller('FeaturedWidgets', ['$scope','$window','$log', 'Widget', 'Category', '$filter',
                                                     	function($scope, $window, $log, Widget, Category,$filter ) {
                         	
        	var orderBy = $filter('orderBy');
         	$scope.widgets = Widget.query(function() {
        		    $scope.widgets = orderBy($scope.widgets, 'name', true);
         		  }); 
}]);
         	
         	
appControllers.controller('UserListController', ['$scope','$window','$log', 'FStoreUser', 'popupService', 'ngDialog',
                            	function($scope, $window, $log, FStoreUser, popupService, ngDialog) {
	
	

	$scope.fstoreusers = FStoreUser.query(function() {
		    //console.log($scope.fstoreusers);
		  }); //query() returns all the bakerUsers
		 
	
	
	 $scope.deleteFStoreUser = function(gridItem, useridx, username, name){

		 	$log.debug("Selected to DELETE User with userID = "+ useridx);
		 	

		 	var fstoreuser=FStoreUser.get({id:useridx}, function() {
			    $log.debug("WILL DELETE User with ID "+ fstoreuser.id);
			    
		        if(popupService.showPopup('Really delete user '+name+' with username "'+username+'" ?')){
		        	$log.debug("WILL DELETE User with $scope.fstoreuser.id = "+ fstoreuser.id);
				 	
		        	fstoreuser.$delete(function(){
		    			$scope.fstoreusers.splice($scope.fstoreusers.indexOf(gridItem),1)
		            }, function(error) {
 		            	$window.alert("Cannot delete: "+error.data);
 		            });
		        
		        }
		 	});
	    }
	 
	 $scope.clickToOpen = function (gridItem) {
	        ngDialog.open({ 
	        	template: 'UserView.html',
	        	controller : ['$scope', 'FStoreUser', function( $scope,  FStoreUser){
	        	    $scope.fstoreuser=FStoreUser.get({id:gridItem});
	        	    $log.debug("WILL GET User with ID "+gridItem);   
	    			}],
	    		className: 'ngdialog-theme-default'
	    		
	        	});
	    };
	    
}]);

appControllers.controller('UserViewController', ['$scope', '$route', '$routeParams', '$location', 'FStoreUser', '$anchorScroll',
                                                 function( $scope, $route, $routeParams, $location, FStoreUser, $anchorScroll){
    $scope.fstoreuser=FStoreUser.get({id:$routeParams.id});
    
	$scope.name = "UserViewController";
	$scope.params = $routeParams;
	
	

}]);

appControllers.controller('UserAddController',function($scope, $location, FStoreUser){

    $scope.fstoreuser=new FStoreUser();
    $scope.fstoreuser.active='false';
    $scope.fstoreuser.role = 'ROLE_DEVELOPER';
    
    $scope.addFStoreUser=function(){
        $scope.fstoreuser.$save(function(){
			$location.path("/users");
        });
    }

});

appControllers.controller('SignupCtrl', ['$scope', '$route', '$routeParams', '$location', 'FStoreUser', '$anchorScroll', 'APIEndPointService', '$http' , 'formDataObject',
                                         function( $scope, $route, $routeParams, $location, FStoreUser, $anchorScroll, APIEndPointService, $http,formDataObject){
	$scope.fstoreuser=new FStoreUser();
    $scope.fstoreuser.active='false';
    $scope.fstoreuser.role = 'ROLE_DEVELOPER';
    
    $scope.registerNewFStoreUser=function(){
        	
        	randomid= 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        	    return v.toString(16);
        	});
        	
        	link = APIEndPointService.WEBURL+'/#/registerconfirm?rid='+randomid+'&uname='+$scope.fstoreuser.username;
            msg='Dear '+$scope.fstoreuser.name+' <br>thank you for registering a FORGEStore account!<br><br>\r\n'+
            'Please follow this link:<br> '+link+
            ' <br> or copy it to your web browser\r\n'+
            '<br><br>Thank you\r\nThe FORGEStore team';
            
        	
        	return $http({
    			method : 'POST',
    			url : APIEndPointService.APIURL+'services/api/repo/register/',
    			headers : {
    				'Content-Type' : 'multipart/form-data'
    			},
    			data : {
    				name: $scope.fstoreuser.name,
    				username: $scope.fstoreuser.username,
    				userpassword: $scope.fstoreuser.password,
    				userorganization: $scope.fstoreuser.organization,
    				useremail: $scope.fstoreuser.email,
    				randomregid: randomid,
    				emailmessage: msg,
    			},
    			transformRequest : formDataObject
    		}).success(function() {
    			alert("A confirmation email has been sent in order to activate your account.");
    			$location.path("/");
    		}).
            error(function (data, status, headers, config) {
                alert("failed!");
            });
        	
        };
    

}]);


appControllers.controller('UserEditController', ['$scope', '$route', '$routeParams', '$location', 'FStoreUser', '$anchorScroll',
        function( $scope, $route, $routeParams, $location, FStoreUser, $anchorScroll){


    //console.log("WILL EDIT User with ID "+$routeParams.id);
	
    $scope.updateUser=function(){

        //console.log("$scope.password = "+$scope.password);
        //console.log("$scope.retypepassword = "+$scope.retypepassword);
    	if ( ($scope.password) && ($scope.password === $scope.retypepassword))
    		$scope.fstoreuser.password= $scope.password;
    	else {
            //console.log("Will send to server empty password to keep old one ");
    		$scope.fstoreuser.password= ''; //send empty to server, so not to change!
    	}
    	
        $scope.fstoreuser.$update(function(){
			$location.path("/users");
        });
    };

    $scope.loadUser=function(){
        $scope.fstoreuser=FStoreUser.get({id:$routeParams.id});
    };

    $scope.loadUser();
}]);

appControllers.directive('equals', function() {
	  return {
	    restrict: 'A', // only activate on element attribute
	    require: 'ngModel', // get a hold of NgModelController
	    link: function(scope, elem, attrs, ngModel) {
	        //console.log("IN LINK! ");
	      if(!ngModel) return; // do nothing if no ng-model

	        //console.log("PASS IN LINK! ");
	      // watch own value and re-validate on change
	        
	      scope.$watch(attrs.ngModel, function() {
	        validate();
	      });

	      // observe the other value and re-validate on change
	      attrs.$observe('equals', function (val) {
	        validate();
	      });

	      var validate = function() {
	        // values
	        var val1 = ngModel.$viewValue;
	        var val2 = attrs.equals;

	        //console.log("val1= "+val1);
	        //console.log("val2= "+val2);
	        // set validity
	        ngModel.$setValidity('passwordVerify', ! val1 || ! val2 || val1 === val2);
	      };
	    }
	  }
	});





appControllers.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

appControllers.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
        	
        	
            
            el.bind('change', function (event) {
                var files = event.target.files;
                scope.$emit("fileSelectedClearPrevious", {});
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0;i<files.length;i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }                                       
            });
        }
    };
});

appControllers.controller('CategoriesListController', ['$scope','$window','$log', 'Category', 'popupService','ngDialog',
                                             	function($scope, $window, $log, Category, popupService, ngDialog ) {
                 	
                 	

 	$scope.categories = Category.query(function() {
 		    //console.log($scope.categories);
 		  }); //query() returns all the categories
 		 
 	
 	
 	 $scope.deleteCategory = function(gridItem, useridx){

 		 	//console.log("Selected to DELETE Categorywith id = "+ useridx);
 		 	

 		 	var cat=Category.get({id:useridx}, function() {
 			    $log.debug("WILL DELETE Category with ID "+ cat.id);
 			    
 		        if(popupService.showPopup('Really delete Category "'+cat.name+'" ?')){
 				 	
 		        	cat.$delete(function(){
 		    			$scope.categories.splice($scope.categories.indexOf(gridItem),1)
 		            }, function(error) {
 		            	$window.alert("Cannot delete: "+error.data);
 		            });
 		        
 		        }
 		 	});
 	    }
 	          	
                 	 
}]);

appControllers.controller('CategoryAddController',function($scope, $location, Category){

    $scope.cat=new Category();

    $scope.addCategory=function(){
        $scope.cat.$save(function(){
			$location.path("/categories");
        });
    }

});

appControllers.controller('CategoryEditController', ['$scope', '$route', '$routeParams', '$location', 'Category', '$anchorScroll',
        function( $scope, $route, $routeParams, $location, Category, $anchorScroll){


    //console.log("WILL EDIT Category with ID "+$routeParams.id);
	
    $scope.updateCategory=function(){
        $scope.cat.$update(function(){
			$location.path("/categories");
        });
    };

    $scope.loadCategory=function(){
        $scope.cat=Category.get({id:$routeParams.id});
    };

    $scope.loadCategory();
}]);



	

//////////////////fireadapters/Services Controller

appControllers.controller('ServiceListController', ['$scope','$window','$log', 'ServiceMetadata', 'popupService','ngDialog',
                                             	function($scope, $window, $log, ServiceMetadata, popupService, ngDialog ) {
                 	
                 	
 	$scope.services= ServiceMetadata.query(function() {
 		    //console.log($scope.apps);
 		  }); //query() returns all the subscribedmachines
 		 
 	
 	
 	 $scope.deleteService = function(gridItem, useridx){

 		$log.debug("Selected to DELETE ServiceMetadata with id = "+ useridx);
 		 	

 		 	var service=ServiceMetadata.get({id:useridx}, function() {
 			    $log.debug("WILL DELETE ServiceMetadatawith ID "+ service.id);
 			    
 		        if(popupService.showPopup('Really delete Service "'+service.name+'" ?')){
 				 	
 		        	service.$delete(function(){
 		    			$scope.services.splice($scope.services.indexOf(gridItem),1)
 		            }, function(error) {
 		            	$window.alert("Cannot delete: "+error.data);
 		            });
 		        
 		        }
 		 	});
 	    }
 	          	
                 	 
}]);


appControllers.controller('ServiceAddController', function($scope, $location,
		ServiceMetadata, FStoreUser, $rootScope, $http,formDataObject, Category, $filter, APIEndPointService) {

	
	$scope.service = new ServiceMetadata();
	$scope.service.owner = $rootScope.loggedinfstoreuser;//FStoreUser.get({id:$rootScope.loggedinfstoreuser.id});
	 
	var orderBy = $filter('orderBy');
	$scope.categories = Category.query(function() {
		$scope.categories = orderBy($scope.categories, 'name', false);
		
	}); 
	
	$scope.addService = function() {
		$scope.service.$save(function() {
			$location.path("/services");
		});
	}

	$scope.submitNewService = function submit() {
		
		var catidsCommaSeparated = '';
		 angular.forEach ( $scope.service.categories, function(categ, categkey) {
			 catidsCommaSeparated = catidsCommaSeparated+categ.id+',';
		 });
		 
		return $http({
			method : 'POST',
			url : APIEndPointService.APIURL+'services/api/repo/users/'+$scope.service.owner.id+'/fireadapters/',
			headers : {
				'Content-Type' : 'multipart/form-data'
			},
			data : {
				prodname: $scope.service.name,
				shortDescription: $scope.service.teaser,
				longDescription: $scope.service.longDescription,
				version: $scope.service.version,
				prodIcon: $scope.service.uploadedServiceIcon,
				prodFile: $scope.service.uploadedServiceFile,
				categories: catidsCommaSeparated,
				//file : $scope.file
			},
			transformRequest : formDataObject
		}).success(function() {
			$location.path("/services");
		});
	};

});



appControllers.controller('ServiceEditController', ['$scope', '$route', '$routeParams', '$location', 'ServiceMetadata', '$anchorScroll',
                                                '$http', 'formDataObject', 'cfpLoadingBar', 'Category', '$filter', 'APIEndPointService',
     function( $scope, $route, $routeParams, $location, ServiceMetadata, $anchorScroll, $http,formDataObject, cfpLoadingBar, Category, $filter, APIEndPointService){


	
	 $scope.submitUpdateService = function submit() {

		 var catidsCommaSeparated = '';
		 angular.forEach ( $scope.service.categories, function(categ, categkey) {
			 catidsCommaSeparated = catidsCommaSeparated+categ.id+',';
		 });
		 
			return $http({
				method : 'PUT',
				url : APIEndPointService.APIURL+'services/api/repo/fireadapters/'+$routeParams.id,
				headers : {
					'Content-Type' : 'multipart/form-data'
				},
				data : {
					userid: $scope.service.owner.id,
					prodname: $scope.service.name,
					prodid: $scope.service.id,
					uuid: $scope.service.uuid,
					shortDescription: $scope.service.shortDescription,
					longDescription: $scope.service.longDescription,
					version: $scope.service.version,
					categories: catidsCommaSeparated,
					prodIcon: $scope.service.uploadedServiceIcon,
					prodFile: $scope.service.uploadedServiceFile,
					//file : $scope.file
				},
				transformRequest : formDataObject
			}).success(function() {
				$location.path("/services");
			});
		};
	

    $scope.loadService=function(cats){
    	var myservice = ServiceMetadata.get({id:$routeParams.id}, function() {
    		
    		var categoriesToPush=[];
	   	 	angular.forEach(myservice.categories, function(mybuncateg, mybuncategkey) {
		    		
		    		angular.forEach(cats, function(categ, key) {
	   	    		if (mybuncateg.id === categ.id){
	   	    			categoriesToPush.push(categ);
	   	    		}
		    		});
		 	});
			
	   	 	myservice.categories=[];//clear everything
			//now re add the categories to synchronize with local model
			angular.forEach(categoriesToPush, function(cat, key) {
				myservice.categories.push(cat);
			 	});	 
    		
    		$scope.service=myservice;    
    		
    	});     
    		      
   	 	//appl.category = $scope.categories[appl.category];
        
    	//$scope.app=ApplicationMetadata.get({id:$routeParams.id});        
   	 	
    };

    var orderBy = $filter('orderBy');
	$scope.categories = Category.query(function() {
		$scope.categories = orderBy($scope.categories, 'name', false);
		$scope.loadService($scope.categories);
	}); 
    
}]);


appControllers.controller('ServiceViewController', ['$scope', '$route', '$routeParams', '$location', 'ServiceMetadata',
                                                 function( $scope, $route, $routeParams, $location, ServiceMetadata ){
    $scope.service=ServiceMetadata.get({id:$routeParams.id});

}]);


appControllers.controller('ServicesMarketplaceController', ['$scope','$window','$log', 'ServiceMetadata', 'Category', '$filter',
                                                     	function($scope, $window, $log, ServiceMetadata, Category,$filter ) {
                         	
        	var orderBy = $filter('orderBy');
        	$scope.categories = Category.query(function() {
        		    //console.log($scope.apps);
        		    $scope.categories = orderBy($scope.categories, 'name', false);
        	});
         	$scope.services = ServiceMetadata.query(function() {
         		    //console.log($scope.apps);
         		    $scope.servicesTotalNumber = $scope.services.length;
        		    $scope.services = orderBy($scope.services, 'name', false);
         	}); 
         		 
         	$scope.filterCategory=function(category){
         			if (category.id){
         				//console.log("Selected catid = "+ category.id);
         				angular.forEach($scope.services, function(service, key) {
         					//console.log("key= "+key+", app.id="+app.id+", app.name="+app.name);
         					//app.name = app.name+'!!';
         				});
         				$scope.selectedcategory = category;
         			}else{
         				$scope.selectedcategory = null;
         			}

        			//$scope.apps = ApplicationMetadata.query();
        			$scope.services = ServiceMetadata.query({categoryid: category.id}, function() {
        	 		    //console.log($scope.apps);
        			    $scope.services = orderBy($scope.services, 'name', false);
        	 	});
            };
            
            $scope.isActive=function(c) {

           		//console.log("isActive c= "+c.name+", $scope.selectedcategory="+$scope.selectedcategory.name);
                return $scope.selectedcategory === c;
            };
            
            $scope.isNoneSelected=function(c) {
            	
            	//console.log("isNoneSelected c $scope.selectedcategory="+$scope.selectedcategory);
           		return ( (!$scope.selectedcategory) || ($scope.selectedcategory === null) );
            };

         	
                         	 
        }]);


//////////////////Widgets Controller

appControllers.controller('WidgetListController', ['$scope','$window','$log', 'Widget', 'popupService','ngDialog',
                                             	function($scope, $window, $log, Widget, popupService, ngDialog ) {
                 	
                 	
 	$scope.widgets= Widget.query(function() {
 		  }); //query() returns all the widgets
 		 
 	
 	
 	 $scope.deleteWidget = function(gridItem, useridx){

 		$log.debug("Selected to DELETE Widget with id = "+ useridx);
 		 	

 		 	var widget=Widget.get({id:useridx}, function() {
 			    $log.debug("WILL DELETE Widget ID "+ widget.id);
 			    
 		        if(popupService.showPopup('Really delete Widget "'+widget.name+'" ?')){
 				 	
 		        	widget.$delete(function(){
 		    			$scope.widgets.splice($scope.widgets.indexOf(gridItem),1)
 		            }, function(error) {
 		            	$window.alert("Cannot delete: "+error.data);
 		            });
 		        
 		        }
 		 	});
 	    }
 	          	
                 	 
}]);


appControllers.controller('WidgetAddController', function($scope, $location,
		Widget, FStoreUser, $rootScope, $http,formDataObject, Category, $filter, APIEndPointService) {

	
	$scope.widget = new Widget();
	$scope.widget.owner = $rootScope.loggedinfstoreuser;//FStoreUser.get({id:$rootScope.loggedinfstoreuser.id});
	 
	var orderBy = $filter('orderBy');
	$scope.categories = Category.query(function() {
		$scope.categories = orderBy($scope.categories, 'name', false);
		
	}); 
	

	//Screenshots handling ///////////////////////////////////
	//an array of files selected
    $scope.files = [];
    $scope.screenshotimages = [];
    $scope.image = "";
    
   //listen for the file selected event
    

    $scope.$on("fileSelectedClearPrevious", function (event, args) {
    	$scope.files = [];
        $scope.screenshotimages = [];
    });
    
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {            
            //add the file object to the scope's files collection
            $scope.files.push(args.file);
            
            var reader = new FileReader();
            
        	reader.onload = function (e) {
        		var mdl = {
        				file: args.file,
        				img: e.target.result
        		}
        		
        		$scope.screenshotimages.push( mdl ); 
        	    $scope.image = mdl.img;//trick to load the image
                $scope.$apply();
                
            }
        	
            reader.readAsDataURL(args.file);
            
            
        });
    });
	//Screenshots handling ///////////////////////////////////
	
	$scope.addWidget = function() {
		$scope.widget.$save(function() {
			$location.path("/widgets");
		});
	}

	$scope.submitNewWidget = function submit() {
		
		var catidsCommaSeparated = '';
		 angular.forEach ( $scope.widget.categories, function(categ, categkey) {
			 catidsCommaSeparated = catidsCommaSeparated+categ.id+',';
		 });
		 
		return $http({
			method : 'POST',
			url : APIEndPointService.APIURL+'services/api/repo/users/'+$scope.widget.owner.id+'/widgets/',
			headers : {
				'Content-Type' : undefined
			},
			//This method will allow us to change how the data is sent up to the server
            // for which we'll need to encapsulate the model data in 'FormData'

			transformRequest: function (data) {
                var formData = new FormData();
                //need to convert our json object to a string version of json otherwise
                // the browser will do a 'toString()' on the object which will result 
                // in the value '[Object object]' on the server.
                //formData.append("app", angular.toJson(data.app));
                formData.append("prodname", $scope.widget.name);
                formData.append("url", $scope.widget.url);
                formData.append("shortDescription", $scope.widget.teaser);
                formData.append("longDescription", $scope.widget.longDescription);
                formData.append("version", $scope.widget.version);
                formData.append("prodIcon", $scope.widget.uploadedWidgetIcon);
                formData.append("prodFile", $scope.widget.uploadedWidgetFile);
                formData.append("categories", catidsCommaSeparated);
                //now add all of the assigned files
                for (var i = 0; i < data.files.length; i++) {
                	formData.append("screenshots", data.files[i]);
                }
                
                return formData;
            },
            //Create an object that contains the model and files which will be transformed
            // in the above transformRequest method
            data: { 
            		app: $scope.widget, 
            		files: $scope.files }
			
            
		}).success(function() {
			$location.path("/widgets");
		}).
        error(function (data, status, headers, config) {
            alert("failed!");
        });
	};

});


appControllers.controller('WidgetEditController', ['$scope', '$route', '$routeParams', '$location', 'Widget', '$anchorScroll',
                                                '$http', 'formDataObject', 'cfpLoadingBar', 'Category', '$filter','APIEndPointService',
     function( $scope, $route, $routeParams, $location, Widget, $anchorScroll, $http,formDataObject, cfpLoadingBar, Category, $filter,APIEndPointService){


	
	 $scope.submitUpdateWidget = function submit() {

		 var catidsCommaSeparated = '';
		 angular.forEach ( $scope.widget.categories, function(categ, categkey) {
			 catidsCommaSeparated = catidsCommaSeparated+categ.id+',';
		 });
		 
			return $http({
				method : 'PUT',
				url : APIEndPointService.APIURL+'services/api/repo/widgets/'+$routeParams.id,
				headers : {
					'Content-Type' : undefined
				},
				transformRequest: function (data) {
	                var formData = new FormData();
	                //need to convert our json object to a string version of json otherwise
	                // the browser will do a 'toString()' on the object which will result 
	                // in the value '[Object object]' on the server.
	                //formData.append("app", angular.toJson(data.app));
	                formData.append("userid", $scope.widget.owner.id);
	                formData.append("uuid", $scope.widget.uuid);
	                formData.append("prodname", $scope.widget.name);
	                formData.append("url", $scope.widget.url);
	                formData.append("shortDescription", $scope.widget.shortDescription);
	                formData.append("longDescription", $scope.widget.longDescription);
	                formData.append("version", $scope.widget.version);
	                formData.append("prodIcon", $scope.widget.uploadedWidgetIcon);
	                formData.append("prodFile", $scope.widget.uploadedWidgetFile);
	                formData.append("categories", catidsCommaSeparated);
	                //now add all of the assigned files
	                //var fd=new FormData();
	                for (var i = 0; i < data.files.length; i++) {
	                    //add each file to the form data and iteratively name them
	                	//fd.append("screenshots[" + i+"]", data.files[i]);
	                	formData.append("screenshots", data.files[i]);
	                }
	                //formData.append("screenshots", fd);
	                //formData.append("screenshots", data.files);
	                
	                
	                return formData;
	            },
	            data: { 
            		app: $scope.widget, 
            		files: $scope.files }
			}).success(function() {
				$location.path("/widgets");
			}).
	        error(function (data, status, headers, config) {
	            alert("failed!");
	        });
		};
	

    $scope.loadWidget=function(cats){
    	var mywidget = Widget.get({id:$routeParams.id}, function() {

    		var categoriesToPush=[];
	   	 	angular.forEach(mywidget.categories, function(mywidgetcateg, mywidgetcategkey) {
		    		
		    		angular.forEach(cats, function(categ, key) {
	   	    		if (mywidgetcateg.id === categ.id){
	   	    			categoriesToPush.push(categ);
	   	    		}
		    		});
		 	});
			
	   	 	mywidget.categories=[];//clear everything
			//now re add the categories to synchronize with local model
			angular.forEach(categoriesToPush, function(cat, key) {
				mywidget.categories.push(cat);
			 	});	 
			
			
			$scope.widget=mywidget;   
    		
    	});     
    		      
   	 	//appl.category = $scope.categories[appl.category];
        
    	//$scope.app=ApplicationMetadata.get({id:$routeParams.id});        
   	 	
    };

    var orderBy = $filter('orderBy');
	$scope.categories = Category.query(function() {
		$scope.categories = orderBy($scope.categories, 'name', false);
		$scope.loadWidget($scope.categories);
	}); 
	
	
//screenshots handling /////////////////////////
	
	//an array of files selected
    $scope.files = [];
    $scope.screenshotimages = [];
    $scope.image = "";
    
   //listen for the file selected event
    

    $scope.$on("fileSelectedClearPrevious", function (event, args) {
    	$scope.files = [];
        $scope.screenshotimages = [];
    });
    
    $scope.$on("fileSelected", function (event, args) {
        $scope.$apply(function () {            
            //add the file object to the scope's files collection
            $scope.files.push(args.file);
            
            var reader = new FileReader();
            
        	reader.onload = function (e) {
        		var mdl = {
        				file: args.file,
        				img: e.target.result
        		}
        		
        		$scope.screenshotimages.push( mdl ); 
        	    $scope.image = mdl.img;//trick to load the image
                $scope.$apply();
                
            }
        	
            reader.readAsDataURL(args.file);            
            
        });
    });

	//screenshots handling /////////////////////////
    
}]);


appControllers.controller('WidgetViewController', ['$scope', '$route', '$routeParams', '$location', 'Widget',
                                                 function( $scope, $route, $routeParams, $location, Widget ){
    $scope.widget=Widget.get({id:$routeParams.id}, function() {
        //console.log("WILL GET ApplicationMetadata with ID "+$routeParams.id);
        var shots = $scope.widget.screenshots;
        $scope.screenshotimages = shots.split(",") ;    	
    	
        
        // initial image index
        $scope._Index = 0;

        // if a current image is the same as requested image
        $scope.isActive = function (index) {
            return $scope._Index === index;
        };

        // show prev image
        $scope.showPrev = function () {
            $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.screenshotimages.length - 1;
        };

        // show next image
        $scope.showNext = function () {
            $scope._Index = ($scope._Index < $scope.screenshotimages.length - 1) ? ++$scope._Index : 0;
        };

        // show a certain image
        $scope.showPhoto = function (index) {
            $scope._Index = index;
        };
        
    });


}]);


appControllers.controller('WidgetsMarketplaceController', ['$scope','$window','$log', 'Widget', 'Category', '$filter',
                                                     	function($scope, $window, $log, Widget, Category,$filter ) {
                         	
        	var orderBy = $filter('orderBy');
        	$scope.categories = Category.query(function() {
        		    $scope.categories = orderBy($scope.categories, 'name', false);
        	});
         	$scope.widgets = Widget.query(function() {
         		    //console.log($scope.apps);
         		    $scope.widgetsTotalNumber = $scope.widgets.length;
        		    $scope.widgets = orderBy($scope.widgets, 'name', false);
         	}); 
         		 
         	$scope.filterCategory=function(category){
         			if (category.id){
         				//console.log("Selected catid = "+ category.id);
         				angular.forEach($scope.widgets, function(widget, key) {
         					//console.log("key= "+key+", app.id="+app.id+", app.name="+app.name);
         					//app.name = app.name+'!!';
         				});
         				$scope.selectedcategory = category;
         			}else{
         				$scope.selectedcategory = null;
         			}

        			$scope.widgets = Widget.query({categoryid: category.id}, function() {
        	 		    //console.log($scope.apps);
        			    $scope.widgets = orderBy($scope.widgets, 'name', false);
        	 	});
            };
            
            $scope.isActive=function(c) {

                return $scope.selectedcategory === c;
            };
            
            $scope.isNoneSelected=function(c) {
            	
           		return ( (!$scope.selectedcategory) || ($scope.selectedcategory === null) );
            };

         	
                         	 
        }]);


appControllers.controller('SystemInfoController', ['$scope','$window','$log', 'FStoreProperty', 'popupService','ngDialog',
                                                    	function($scope, $window, $log, FStoreProperty, popupService, ngDialog ) {
                        	
        	$scope.properties = FStoreProperty.query(function() {
        		  }); //query() returns all the categories
                        	 
}]);


appControllers.controller('SystemInfoEditController', ['$scope', '$route', '$routeParams', '$location', 'FStoreProperty', '$anchorScroll',
        function( $scope, $route, $routeParams, $location, FStoreProperty, $anchorScroll){


    //console.log("WILL EDIT Category with ID "+$routeParams.id);
	
    $scope.updateProperty=function(){
        $scope.prop.$update(function(){
			$location.path("/systeminfo");
        });
    };

    $scope.loadProperty=function(){
        $scope.prop=FStoreProperty.get({id:$routeParams.id});
    };

    $scope.loadProperty();
}]);
var appControllers = angular.module('forgestorewebapp_course.controllers',[]) 

//////////////////Courses Controller

appControllers.controller('CourseListController', ['$scope','$window','$log', 'Course', 'popupService','ngDialog',
                                             	function($scope, $window, $log, Course, popupService, ngDialog ) {
                 	
                 	
 	$scope.courses= Course.query(function() {
 		  }); //query() returns all the courses
 		 
 	
 	
 	 $scope.deleteCourse = function(gridItem, useridx){

 		$log.debug("Selected to DELETE Course with id = "+ useridx);
 		 	

 		 	var course=Course.get({id:useridx}, function() {
 			    $log.debug("WILL DELETE Course ID "+ course.id);
 			    
 		        if(popupService.showPopup('Really delete Course "'+course.name+'" ?')){
 				 	
 		        	course.$delete(function(){
 		    			$scope.courses.splice($scope.courses.indexOf(gridItem),1)
 		            }, function(error) {
 		            	$window.alert("Cannot delete: "+error.data);
 		            });
 		        
 		        }
 		 	});
 	    }
 	          	
                 	 
}]);


appControllers.controller('CourseAddController', function($scope, $location,
		Course, FStoreUser, $rootScope, $http,formDataObject, CategoryBrowse, $filter, APIEndPointService) {

	
	$scope.course = new Course();
	$scope.course.owner = $rootScope.loggedinfstoreuser;//FStoreUser.get({id:$rootScope.loggedinfstoreuser.id});
	 
	var orderBy = $filter('orderBy');
	$scope.categories = CategoryBrowse.query(function() {
		$scope.categories = orderBy($scope.categories, 'name', false);
		
	}); 
	
	$scope.addCourse = function() {
		$scope.course.$save(function() {
			$location.path("/courses");
		});
	}

	$scope.submitNewCourse = function submit() {
		
		var catidsCommaSeparated = '';
		 angular.forEach ( $scope.course.categories, function(categ, categkey) {
			 catidsCommaSeparated = catidsCommaSeparated+categ.id+',';
		 });
		 
		return $http({
			method : 'POST',
			url : APIEndPointService.APIURL+'services/api/repo/admin/courses/',
			headers : {
				'Content-Type' : 'multipart/form-data'
			},
			data : {
				prodname: $scope.course.name,
				shortDescription: $scope.course.teaser,
				longDescription: $scope.course.longDescription,
				version: $scope.course.version,
				uploadedCourseIcon: $scope.course.uploadedCourseIcon,
				uploadedCourseFile: $scope.course.uploadedCourseFile,
				categories: catidsCommaSeparated,
				//file : $scope.file
			},
			transformRequest : formDataObject
		}).success(function() {
			$location.path("/courses");
		});
	};

});


appControllers.controller('CourseEditController', ['$scope', '$route', '$routeParams', '$location', 'Course', '$anchorScroll',
                                                '$http', 'formDataObject', 'cfpLoadingBar', 'CategoryBrowse', '$filter', 'APIEndPointService',
     function( $scope, $route, $routeParams, $location, Course, $anchorScroll, $http,formDataObject, cfpLoadingBar, CategoryBrowse, $filter, APIEndPointService){


	
	 $scope.submitUpdateCourse = function submit() {

		 var catidsCommaSeparated = '';
		 angular.forEach ( $scope.course.categories, function(categ, categkey) {
			 catidsCommaSeparated = catidsCommaSeparated+categ.id+',';
		 });
		 
			return $http({
				method : 'PUT',
				url : APIEndPointService.APIURL+'services/api/repo/admin/courses/'+$routeParams.id,
				headers : {
					'Content-Type' : 'multipart/form-data'
				},
				data : {
					userid: $scope.course.owner.id,
					prodname: $scope.course.name,
					courseid: $scope.course.id,
					courseuuid: $scope.course.uuid,
					shortDescription: $scope.course.shortDescription,
					longDescription: $scope.course.longDescription,
					version: $scope.course.version,
					categories: catidsCommaSeparated,
					uploadedCourseIcon: $scope.course.uploadedCourseIcon,
					uploadedCourseFile: $scope.course.uploadedCourseFile,
					//file : $scope.file
				},
				transformRequest : formDataObject
			}).success(function() {
				$location.path("/courses");
			});
		};
	

    $scope.loadCourse=function(cats){
    	var mycourse = Course.get({id:$routeParams.id}, function() {

    		var categoriesToPush=[];
	   	 	angular.forEach(mycourse.categories, function(mycoursecateg, mycoursecategkey) {
		    		
		    		angular.forEach(cats, function(categ, key) {
	   	    		if (mycoursecateg.id === categ.id){
	   	    			categoriesToPush.push(categ);
	   	    		}
		    		});
		 	});
			
	   	 	mycourse.categories=[];//clear everything
			//now re add the categories to synchronize with local model
			angular.forEach(categoriesToPush, function(cat, key) {
				mycourse.categories.push(cat);
			 	});	 
			
			
			$scope.course=mycourse;   
    		
    	});     
    		      
   	 	//appl.category = $scope.categories[appl.category];
        
    	//$scope.app=ApplicationMetadata.get({id:$routeParams.id});        
   	 	
    };

    var orderBy = $filter('orderBy');
	$scope.categories = CategoryBrowse.query(function() {
		$scope.categories = orderBy($scope.categories, 'name', false);
		$scope.loadCourse($scope.categories);
	}); 
    
}]);


appControllers.controller('CourseViewController', ['$scope', '$route', '$routeParams', '$location', 'CourseBrowse',
                                                 function( $scope, $route, $routeParams, $location, CourseBrowse ){
    $scope.course=CourseBrowse.get({id:$routeParams.id});

}]);


appControllers.controller('CoursesMarketplaceController', ['$scope','$window','$log', 'CourseBrowse', 'CategoryBrowse', '$filter',
                                                     	function($scope, $window, $log, CourseBrowse, CategoryBrowse,$filter ) {
                         	
        	var orderBy = $filter('orderBy');
        	$scope.categories = CategoryBrowse.query(function() {
        		    $scope.categories = orderBy($scope.categories, 'name', false);
        	});
         	$scope.courses = CourseBrowse.query(function() {
         		    //console.log($scope.apps);
         		    $scope.coursesTotalNumber = $scope.courses.length;
        		    $scope.courses = orderBy($scope.courses, 'name', false);
         	}); 
         		 
         	$scope.filterCategory=function(category){
         			if (category.id){
         				//console.log("Selected catid = "+ category.id);
         				angular.forEach($scope.courses, function(course, key) {
         					//console.log("key= "+key+", app.id="+app.id+", app.name="+app.name);
         					//app.name = app.name+'!!';
         				});
         				$scope.selectedcategory = category;
         			}else{
         				$scope.selectedcategory = null;
         			}

        			$scope.courses = CourseBrowse.query({categoryid: category.id}, function() {
        	 		    //console.log($scope.apps);
        			    $scope.courses = orderBy($scope.courses, 'name', false);
        	 	});
            };
            
            $scope.isActive=function(c) {

                return $scope.selectedcategory === c;
            };
            
            $scope.isNoneSelected=function(c) {
            	
           		return ( (!$scope.selectedcategory) || ($scope.selectedcategory === null) );
            };

         	
                         	 
        }]);

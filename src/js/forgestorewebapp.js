var app = angular.module('forgestorewebapp', [   'ngCookies', 'ngResource', 'ngRoute', 
                                         'trNgGrid', 'forgestorewebapp.controllers', 
                                         'forgestorewebapp_course.controllers', 
                                         'forgestorewebapp.services', 
                                         'forgestorewebapp.config',
                                         'ngDialog',
                                         'angular-loading-bar', 'ngAnimate']);

app.config(function($routeProvider, $locationProvider, $anchorScrollProvider, cfpLoadingBarProvider) {
	
    $anchorScrollProvider.disableAutoScrolling();
    
	$routeProvider.when('/login', {
		templateUrl : 'SignInHomeSection.html',
		controller : 'LoginCtrl'
	}).when('/logout', {
		templateUrl : 'logout.html',
		controller : 'LogoutCtrl'
	}).when('/signup', {
		templateUrl : 'signup.html',
		controller : 'SignupCtrl'
	}).when('/users', {
		templateUrl : 'Users.html',
		controller : 'UserListController'
	}).when('/users_add', {
		templateUrl : 'UserAdd.html',
		controller : 'UserAddController'
	}).when('/edit_user/:id', {
		templateUrl : 'UserEdit.html',
		controller : 'UserEditController'
	}).when('/categories', {
		templateUrl : 'Categories.html',
		controller : 'CategoriesListController'
	}).when('/add_category', {
		templateUrl : 'CategoryAdd.html',
		controller : 'CategoryAddController'
	}).when('/edit_category/:id', {
		templateUrl : 'CategoryEdit.html',
		controller : 'CategoryEditController'
	}).when('/services', {
		templateUrl : 'Services.html',
		controller : 'ServiceListController'
	}).when('/service_add', {
		templateUrl : 'ServiceAdd.html',
		controller : 'ServiceAddController'
	}).when('/service_edit/:id', {
		templateUrl : 'ServiceEdit.html',
		controller : 'ServiceEditController'
	}).when('/service_view/:id', {
		templateUrl : 'ServiceView.html',
		controller : 'ServiceViewController'
	}).when('/service_marketplace', {
		templateUrl : 'ServicesMarketplace.html',
		controller : 'ServicesMarketplaceController'
	}).when('/widgets', {
		templateUrl : 'Widgets.html',
		controller : 'WidgetListController'
	}).when('/widget_add', {
		templateUrl : 'WidgetAdd.html',
		controller : 'WidgetAddController'
	}).when('/widget_edit/:id', {
		templateUrl : 'WidgetEdit.html',
		controller : 'WidgetEditController'
	}).when('/widget_view/:id', {
		templateUrl : 'WidgetView.html',
		controller : 'WidgetViewController'
	}).when('/widget_marketplace', {
		templateUrl : 'WidgetsMarketplace.html',
		controller : 'WidgetsMarketplaceController'
	}).when('/courses', {
		templateUrl : 'Courses.html',
		controller : 'CourseListController'
	}).when('/course_add', {
		templateUrl : 'CourseAdd.html',
		controller : 'CourseAddController'
	}).when('/course_edit/:id', {
		templateUrl : 'CourseEdit.html',
		controller : 'CourseEditController'
	}).when('/course_view/:id', {
		templateUrl : 'CourseView.html',
		controller : 'CourseViewController'
	}).when('/course_marketplace', {
		templateUrl : 'CoursesMarketplace.html',
		controller : 'CoursesMarketplaceController'
	}).when('/systeminfo', {
		templateUrl : 'SystemInfo.html',
		controller : 'SystemInfoController'
	}).when('/edit_systeminfo/:id', {
		templateUrl : 'SystemInfoEdit.html',
		controller : 'SystemInfoEditController'
	}).otherwise({
		redirectTo : '/'
	});

	
	
	cfpLoadingBarProvider.includeSpinner = true;
	cfpLoadingBarProvider.includeBar = true;
	
	
});


app.controller('forgestoreMainCtrl', function($scope, FStoreUser, $log, $location) {
	$log.debug('inside forgestoreMainCtrl controller');
	$scope.forgestorevesrion = '20141212_trunk';
	$scope.location = $location;
});


app.run(function ( api) {
	  api.init();
});

app.factory('api', function ($http, $cookies) {
	$http.defaults.headers.post['JSESSIONID'] = $cookies.jsessionid;
	  return {
	      init: function (token) {
	          $http.defaults.headers.common['X-Access-Token'] = token || $cookies.token;
	      }
	  };
	});


app.controller('NavCtrl', [ '$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
	
	//$scope.user = $rootScope.fstoreuser;
	
	$scope.navClass = function(page) {
		var currentRoute = $location.path().substring(1) || 'home';
		return page === currentRoute ? 'active' : '';
	};
	
    
} ]);

app.controller('LogoutCtrl', [ '$scope', '$location', 'authenticationSvc', '$log',function($scope, $location, authenticationSvc, $log) {
	
	$log.debug('In LogoutCtrl');
	authenticationSvc.logout().then(function(result) {
				$scope.userInfo = null;
				$location.path("/login");
			}, function(error) {
				$log.debug(error);
			});
   
    
    
} ]);






app.controller("LoginCtrl", ["$scope", "$location", "$window", "authenticationSvc", "$log", "$rootScope",
                             function ($scope, $location, $window, authenticationSvc, $log, $rootScope) {
	$log.debug('========== > inside LoginCtrl controller');
    $scope.userInfo = null;
    $scope.user = {
    		username : '',
    		password : ''
    	};
    $scope.login = function () {
        authenticationSvc.login($scope.user.username, $scope.user.password)
            .then(function (result) {
    			$rootScope.loggedIn = true;
                $scope.userInfo = result;
                $rootScope.loggedinfstoreuser = $scope.userInfo.fstoreUser;

        		$log.debug('========== > inside LoginCtrl controller $rootScope.fstoreuser ='+ $rootScope.loggedinfstoreuser);
        		$log.debug('========== > inside LoginCtrl controller $rootScope.fstoreuser ='+ $rootScope.loggedinfstoreuser.username);
                
                $location.path("/widget_marketplace");
            }, function (error) {
                //$window.alert("Invalid credentials");
    			$scope.loginError = true;
    			$log.debug(error);
            });
    };

    $scope.cancel = function () {
        $scope.user.userName = "";
        $scope.user.password = "";
    };
}]);



// The code below is heavily inspired by Witold Szczerba's plugin for AngularJS.
// // I have modified the code in order
// to reduce its complexity and make for easier explanation to novice JS
// developers. You can find his plugin here: // https://
// github.com/witoldsz/angular-http-auth

app.config(function($httpProvider) {

	$httpProvider.defaults.withCredentials = true; //good for CORS support
	$httpProvider.interceptors.push(function($rootScope, $location, $q, $log,$window) {
		return {
			'request' : function(request) { // if we're not logged-in to the
				// AngularJS app, redirect to // login
				// page
				$rootScope.loggedIn = $rootScope.loggedIn || $rootScope.username;
				$log.debug('========== > inside httpProvider.interceptors');
				
				if ($window.sessionStorage["userInfo"]!=null) {
		            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
		            if (userInfo){
		            	$rootScope.loggedIn = true;		            	
		            	$rootScope.loggedinfstoreuser = userInfo.fstoreUser;
		            	$log.debug('========== > $rootScope.loggedIn set to TRUE because userInfooo = '+userInfo);
		            	if (userInfo.fstoreUser){
		            		$log.debug('========== > $rootScope.loggedIn set to TRUE because userInfo.fstoreUser.username = '+userInfo.fstoreUser.username);
		            		$log.debug('========== > $rootScope.loggedIn set to TRUE because user $rootScope.fstoreuser='+$rootScope.loggedinfstoreuser.username);
		            	}
		            	
		            }
		        }
				
				if (!$rootScope.loggedIn 
						&& $location.path() != '/' 
						&& $location.path() != '/login' 
						&& $location.path() != '/signup' 
						&& $location.path() != '/service_marketplace' 
						&& $location.path() != '/course_marketplace' 
						&& $location.path() != '/widget_marketplace'
						&& ($location.path().indexOf("widget_view") <=0)
						&& ($location.path().indexOf("course_view") <=0)
						&& ($location.path().indexOf("service_view") <=0) 
						) {
					$log.debug('========== > $location.path() = '+$location.path());
					$log.debug('========== > $rootScope.loggedIn IS FALSE');
					$location.path('/login');
				}
				return request;
			},
			'responseError' : function(rejection) { // if we're not logged-in to
													// the web service,
				// redirect to login page
				if (rejection.status === 401 && $location.path() != '/login') {
					$rootScope.loggedIn = false;
		            $window.sessionStorage["userInfo"] = null;
					$location.path('/login');
				}
				return $q.reject(rejection);
			}
		};
	});
});




app.factory("authenticationSvc", ["$http","$q","$window","$rootScope", "$log", "APIEndPointService", 
                                  function ($http, $q, $window,$rootScope, $log, APIEndPointService) {
    var userInfo;

	$log.debug('========== > authenticationSvc');
	
    function login(userName, password) {
        var deferred = $q.defer();
        $log.debug('========== > authenticationSvc Login');
        $http.post(APIEndPointService.APIURL+"services/api/repo/sessions/", { username: userName, password: password })
            .then(function (result) {
                userInfo = {
                    accesstoken: "NOTIMPLEMENTED",//result.data.access_token,
                    username: result.data.username,
                    fstoreUser: result.data.user,
                };
                $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                deferred.resolve(userInfo);
            }, function (error) {
                deferred.reject(error);
            });

        return deferred.promise;
    }

    function logout() {
    	$log.debug('========== > authenticationSvc logout' );
        var deferred = $q.defer();

        $http({
            method: "GET",
            url: APIEndPointService.APIURL+"services/api/repo/sessions/logout",
            headers: {
                //"access_token": "NOT_IMPLEMENTED"//userInfo.accessToken
            }
        }).then(function (result) {
        	$log.debug('========== > authenticationSvc logout RESET everything' );
            userInfo = null;
			$rootScope.loggedIn = false;
            $window.sessionStorage["userInfo"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function getUserInfo() {
        return userInfo;
    }

    function init() {
		$log.debug('========== > authenticationSvc inside init');
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
            if (userInfo){
            	$rootScope.loggedIn = true;
            	$rootScope.loggedinfstoreuser = userInfo.fstoreUser;
            	$log.debug('========== > $rootScope.loggedIn set to TRUE because userInfo ='+userInfo);
            	$log.debug('========== > $rootScope.loggedIn set to TRUE because userInfo.fstoreUser ='+userInfo.fstoreUser);
            	if (userInfo.fstoreUser){
            		$log.debug('========== > $rootScope.loggedIn set to TRUE because user $rootScope.fstoreuser.name ='+$rootScope.loggedinfstoreuser.name);
            		$log.debug('========== > $rootScope.loggedIn set to TRUE because user $rootScope.fstoreuser.id ='+$rootScope.loggedinfstoreuser.id);
            	}
            }
        }
    }
    init();

    return {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}]);












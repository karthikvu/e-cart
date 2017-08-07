var myApp = angular.module('myApp', ['ngRoute', "pageslide-directive"]);

myApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'homeController',
            access: {
                restricted: false,
                multi: true
            }
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginController',
            access: {
                restricted: false
            }
        })
        .when('/logout', {
            controller: 'logoutController',
            access: {
                restricted: true
            }
        })
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'registerController',
            access: {
                restricted: false
            }
        })
        .when('/profile', {
            templateUrl: 'partials/profile.html',
            controller: 'profileController',
            access: {
                restricted: true
            }
        })
        .when('/orders', {
            templateUrl: 'partials/orders.html',
            controller: 'ordersController',
            access: {
                restricted: true
            }
        })
        .when('/one', {
            template: '<h1>This is page one!</h1>',
            access: {
                restricted: true
            }
        })
        .when('/two', {
            template: '<h1>This is page two!</h1>',
            access: {
                restricted: false
            }
        }).when('/product/add', {
            templateUrl: "partials/addProduct.html",
            controller: 'addProductCtrl',
            access: {
                restricted: true,
                onlyadmin: true
            }
        })
        .when('/product/list', {
            templateUrl: "partials/listProduct.html",
            controller: 'listProductCtrl',
            access: {
                restricted: true,
                onlyadmin: true
            }
        })
        .when('/product/:productId', {
            templateUrl: "partials/product.html",
            controller: 'viewProductCtrl',
            access: {
                restricted: false,
                onlyadmin: true,
                multi: true
            }
        })
        .when('/product/edit/:pid', {
            templateUrl: "partials/editProduct.html",
            controller: 'addProductCtrl',
            access: {
                restricted: true,
                onlyadmin: true
            }
        })
        .when('/cart', {
            templateUrl: "partials/cart.html",
            controller: 'cartCtrl',
            access: {
                restricted: true
            }
        })
        .otherwise({
            redirectTo: '/'
        });
});

myApp.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.activeMenu = '/';
    $rootScope.org_name = "UNIBRAIN SOFTECH Pvt Ltd";
    $rootScope.fbLoginEnable = false;
    $rootScope.showLoginButton = true;
    $rootScope.$on('$routeChangeStart',
        function (event, next, current) {
            $rootScope.loggedIn = false;
            if (next.$$route.originalPath == "/login" || next.$$route.originalPath.indexOf("/login") > -1 || (!next.access.restricted && !next.access.multi)) {
                AuthService.logout();
                return;
            }
            AuthService.getUserStatus()
                .then(function () {
                    if (next.access && next.access.restricted && !AuthService.isLoggedIn()) {
                        $location.path('/login');
                        $route.reload();
                    }

                    AuthService.getUser().then(function (resp) {
                        $rootScope.user = resp.data.user;
                    });

                });
        });

    $rootScope.goto = function (path) {
        $location.path(path);
        $rootScope.activeMenu = path || '/';
    }

    $rootScope.back = function () {
        history.go(-1);
    }
    $rootScope.reload = function () {
        $route.reload();
    }
});
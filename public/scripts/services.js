angular.module('myApp').factory('AuthService', ['$q', '$timeout', '$http', '$rootScope',

  function ($q, $timeout, $http, $rootScope) {

        // create user variable
        var user = null;
        var userName = null;
        // return available functions for use in the controllers
        return ({
            isLoggedIn: isLoggedIn,
            getUserStatus: getUserStatus,
            login: login,
            logout: logout,
            register: register,
            getUser: getUser,
            update: update
        });

        function isLoggedIn() {
            if (user) {
                return true;
            } else {
                return false;
            }
        }

        function getUser() {
            return $http.get('/user/getUser');
        }

        function getUserStatus() {
            return $http.get('/user/status')
                // handle success
                .success(function (data) {
                    $rootScope.loggedIn = data.status;
                    if (data.status) {
                        user = true;
                    } else {
                        user = false;
                    }
                })
                // handle error
                .error(function (data) {
                    user = false;
                });
        }

        function login(username, password) {

            // create a new instance of deferred
            var deferred = $q.defer();

            // send a post request to the server
            $http.post('/user/login', {
                    username: username,
                    password: password
                })
                // handle success
                .success(function (data, status) {
                    if (status === 200 && data.status) {
                        user = true;
                        deferred.resolve();
                    } else {
                        user = false;
                        deferred.reject();
                    }
                })
                // handle error
                .error(function (data) {
                    user = false;
                    deferred.reject();
                });

            // return promise object
            return deferred.promise;

        }

        function logout() {

            // create a new instance of deferred
            var deferred = $q.defer();

            // send a get request to the server
            $http.get('/user/logout')
                // handle success
                .success(function (data) {
                    user = false;
                    deferred.resolve();
                })
                // handle error
                .error(function (data) {
                    user = false;
                    deferred.reject();
                });

            // return promise object
            return deferred.promise;

        }

        function register(user) {

            // create a new instance of deferred
            var deferred = $q.defer();

            // send a post request to the server
            $http.post('/user/register', {
                    user: user
                })
                // handle success
                .success(function (data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function (data) {

                    deferred.reject(data);
                });

            // return promise object
            return deferred.promise;

        }

        function update(user) {
            return $http.post('/user/update', {
                user: user
            });
        }

}]);


angular.module('myApp').service('DataSvc', ['$http', '$rootScope', function ($http, $rootScope) {
    this.getOrders = function () {
        return $http.get("/data/orders");
    }
}]);
angular.module('myApp').service('ProductService', ['$http', 'AuthService', function ($http, AuthService) {

    var prodCache = [];

    this.addProduct = function (product) {
        return $http.post("/products/add", product);
    }

    this.deleteProduct = function (pnumber) {
        return $http.post("/products/delete", {
            pnumber: pnumber
        });
    }


    this.getAllProducts = function () {
        return $http.get("/products/list");
    }

    this.getProduct = function (pid) {
        return $http.get("/products/" + pid);
    }

    this.push = function (prod) {
        if (AuthService.isLoggedIn()) {
            return $http.post('/products/pushToCart', prod);
        } else {
            prodCache.push(prod);
        }


    }

    this.getTempCart = function () {
        console.log("SVC", prodCache);
        return prodCache;
    }
    this.clearTempCart = function () {
        prodCache = [];
    }

    this.pop = function (pnumber) {
        // prodCache.splice(index, 1);
        return $http.post('/products/removeFromCart', {
            "pnumber": pnumber
        });
    }
    this.getCart = function () {
        // return prodCache;
        return $http.get('/user/getUser');
    }

    this.existsInCart = function (pnumber) {
        return $http.get('/products/existsInCart/' + pnumber);
    }
}]);
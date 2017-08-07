angular.module('myApp').controller('loginController', ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {
        $scope.login = function () {

            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call login from service
            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                // handle success
                .then(function (resp) {
                    console.log(resp);
                    console.log(angular.copy($location));
                    var next = angular.copy($location.$$search.next);
                    $location.search('next', null);
                    $location.path(next || '/');
                    $scope.disabled = false;
                    $scope.loginForm = {};
                })
                // handle error
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "Invalid username and/or password";
                    $scope.disabled = false;
                    $scope.loginForm = {};
                });

        };

        $scope.register = function () {
            $location.path('/register');
        }

                }]);

angular.module('myApp').controller('base', ['$scope', '$rootScope', 'AuthService',
  function ($scope, $rootScope, AuthService) {
        $scope.checked = true;
        $scope.closeMenu = function () {
            $scope.checked = false;
        }
}]);

angular.module('myApp').controller('homeController', ['$scope', '$location', 'AuthService', 'ProductService', function ($scope, $location, AuthService, ProductService) {
    $scope.message = "HOME CTRL";
    AuthService.getUser().then(function (resp) {
        $scope.user = resp.data.user;
    });
    ProductService.getAllProducts().then(function (resp) {
        $scope.products = resp.data;
    });

}]);
angular.module('myApp').controller('logoutController', ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

        $scope.logout = function () {

            // call logout from service
            AuthService.logout()
                .then(function () {
                    $location.path('/login');
                });

        };

}]);

angular.module('myApp').controller('registerController', ['$scope', '$location', 'AuthService',
  function ($scope, $location, AuthService) {

        $scope.register = function () {

            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call register from service
            AuthService.register($scope.registerForm)
                // handle success
                .then(function () {
                    $location.path('/');
                    $scope.disabled = false;
                    $scope.registerForm = {};
                })
                // handle error
                .catch(function () {
                    $scope.error = true;
                    $scope.errorMessage = "Something went wrong!";
                    $scope.disabled = false;
                    $scope.registerForm = {};
                });

        };

}]);


angular.module('myApp').controller('profileController', ['$scope', '$location', 'AuthService', '$rootScope',
  function ($scope, $location, AuthService, $rootScope) {
        AuthService.getUser().then(function (resp) {
            $scope.user = resp.data.user;
        });

        $scope.updateUser = function (user) {
            $scope.error = false;
            $scope.success = false;
            console.log("UPDATE", user);
            AuthService.update(user).then(function (resp) {
                console.log(resp.data);
                $scope.error = false;
                $scope.success = true;
                $scope.successMessage = resp.data.message;
                $rootScope.user = angular.copy($scope.user);
            }, function (err) {
                $scope.error = true;
                $scope.success = false;
                $scope.errorMessage = err.data.message;
            });
        }
  }]);


angular.module('myApp').controller('ordersController', ['$scope', '$location', 'AuthService', 'DataSvc',
  function ($scope, $location, AuthService, DataSvc) {
        AuthService.getUser().then(function (resp) {
            $scope.user = resp.data.user;
        });

        DataSvc.getOrders().then(function (data) {
            $scope.orders = data.data.orders;
        });

  }]);


angular.module('myApp').controller('viewProductCtrl', [
    '$scope',
    'ProductService',
    '$rootScope',
    '$routeParams',
    'AuthService',
    '$location',
    function ($scope, ProductService, $rootScope, $routeParams, AuthService, $location) {

        $scope.invalidQuantity = false;

        $scope.exists = true;

        if ($routeParams.productId != null || $routeParams.productId != '') {
            $scope.productId = $routeParams.productId;
            ProductService.existsInCart($routeParams.productId).then(function (resp) {
                $scope.exists = resp.data;
            }, function (err) {
                $scope.exists = false;
            });
            ProductService.getProduct($scope.productId).then(function (resp) {
                $scope.product = resp.data;
                $scope.product.quantity = 1;
            }, function (err) {
                $rootScope.goto('404?type=product&id=' + $routeParams.productId);
            });
        } else {
            $rootScope.goto('404?type=product&id=' + $routeParams.productId);
        }

        $scope.buy = function (product) {
            console.log(product);
            ProductService.push(product);
            if (AuthService.isLoggedIn()) {
                //take him to cart page
                $rootScope.goto("cart");
            } else {
                // save detials, login and then redirect back to cart
                $location.path('/login').search('next', 'cart')
            }

        }

        $scope.addToCart = function (product) {
            console.log(product);
            ProductService.push(product);
            if (!AuthService.isLoggedIn()) {
                // save detials, login and then redirect back to cart
                $location.path('/login').search('next', 'cart')
            } else {
                $scope.exists = true;
                alert("Added to cart");
            }
        }

        $scope.validateQuantity = function (quantity) {
            console.log(quantity);
            try {
                if (!Number(quantity) || Number(quantity) < 1) {
                    $scope.invalidQuantity = true;
                } else {
                    $scope.invalidQuantity = false;
                }
            } catch (err) {
                $scope.invalidQuantity = true;
            };


        }


}]);

angular.module('myApp').controller('addProductCtrl', ['$scope', 'ProductService', function ($scope, ProductService) {
    $scope.addProd = function () {
        console.log("ADD");
        ProductService.addProduct($scope.product).then(function (resp) {
            $scope.error = false;
            $scope.success = true;
            $scope.successMessage = resp.data.name + " added successfully";
        }, function (err) {
            $scope.error = true;
            $scope.success = false;
            $scope.errorMessage = "Failed to add Product";
        });
    }
    }]);


angular.module('myApp').controller('listProductCtrl', ['$scope', 'ProductService', function ($scope, ProductService) {
    ProductService.getAllProducts().then(function (resp) {
        $scope.products = resp.data;
    });


    $scope.edit = function (prod_number) {
        // alert("Edit" + prod_number);
    }

    $scope.delete = function (prod_number) {
        ProductService.deleteProduct(prod_number).then(function (resp) {
            alert(resp.data.message);
            ProductService.getAllProducts().then(function (resp) {
                $scope.products = resp.data;
            });

        }, function (err) {
            alert(err);
        });
    }
}]);


angular.module('myApp').controller('cartCtrl', ['$scope', 'ProductService', function ($scope, ProductService) {


    var getCart = function () {
        ProductService.getCart().then(function (resp) {
            $scope.products = resp.data.user.cart;
        });
    }

    if (ProductService.getTempCart().length) {
        ProductService.push(ProductService.getTempCart()[0]).then(function (resp) {
            ProductService.clearTempCart();
            getCart();
        });

    } else {
        getCart();
    }




    $scope.remove = function (pnumber) {

        ProductService.pop(pnumber).then(function (resp) {
            getCart();
        });
    }
}]);
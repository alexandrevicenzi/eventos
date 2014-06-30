/* IE < 8 or another unsuported browser */
if (typeof (Storage) === "undefined") {
    window.location.assign('/eventos/update.html');
}

function getTab() {
    var url = document.location.toString();

    if (url.match('#')) {
        return url.split('#')[1].split('?')[0];
    } else {
        return null;
    }
}

$('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
    var tab = getTab();

    if (tab === "new") {
        $('.jumbotron').css('width', '60%').css('margin-left', '20%');
    } else {
        $('.jumbotron').css('width', '100%').css('margin-left', '0');
    }
});

$(function() {
    /* Para que ao apertar F5 não perder a tab atual.  */
    var tab = getTab();

    if (tab) {
        $('#tabMenu a[href=#' + tab + ']').tab('show');
    } else {
        $('#tabMenu a:first').tab('show');
    }

    $('#tabMenu a').on('click', function(e) {
        window.location.hash = e.target.hash;
    });
    $("#initTime, #endTime").datetimepicker({
        language: 'pt-BR'
    });
});

/* Force to fetch an image on ng-src. */
function fetchImage(src) {
    if (!src)
        return;
    var img = new Image();
    img.src = src;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var App = angular.module('App', [])
        .filter('SimNao', function() {
            return function(input) {
                return input ? "Sim" : "Não";
            };
        })
        .filter('Answer', function() {
            return function(input) {
                switch (input) {
                    case 1:
                        return "Sim";
                        break;
                    case 2:
                        return "Não";
                        break;
                    case 3:
                        return "Talvez";
                        break;
                    case 4:
                        return "Não Sei";
                        break;
                    default:
                        return "";
                        break;
                }
            };
        })
        .run(function($rootScope, $http) {
            $http.defaults.headers.common['x-ng-request'] = true;

            $rootScope.doLogout = function() {
                window.localStorage.isAuthenticated = false;
                window.location.assign('/eventos/signin.html');
            };

            $rootScope.username = function() {
                return window.localStorage.username;
            };

            $rootScope.fetchImage = function(src) {
                if (src)
                    fetchImage(src);
                return src;
            };

            $rootScope.getEventStatus = function(due) {

                if (due) {
                    return [{id: 1, name: "Sim"},
                        {id: 2, name: "Não"},
                        {id: 4, name: "Não Sei"}, ];
                } else {
                    return [{id: 1, name: "Sim"},
                        {id: 2, name: "Não"},
                        {id: 3, name: "Talvez"}, ];
                }
            };

            $rootScope.goToProfile = function(p) {
                console.log(p);
                window.location.assign('/eventos/index.html#profile?id=' + p.Id);
            };

            $rootScope.showAlertBox = function(msg, type, dismiss) {
                $rootScope.showAlert = true;
                $rootScope.alertMessage = msg;
                $rootScope.alertClass = "";

                switch (type)
                {
                    case "i":
                        $rootScope.alertClass += "alert-info";
                        break;
                    case "w":
                        $rootScope.alertClass += "alert-warning";
                        break;
                    case "e":
                        $rootScope.alertClass += "alert-danger";
                        break;
                    case "s":
                        $rootScope.alertClass += "alert-success";
                        break;
                }

                if (dismiss) {
                    $rootScope.alertClass += " alert-dismissible";
                    $rootScope.dismiss = dismiss;
                }
            };

            $rootScope.showAlert = false;
            $rootScope.message = "";
            $rootScope.alertClass = "";
            $rootScope.dismiss = false;
        });

App.controller('LoginCtrl', ['$scope', '$http', '$sce', '$rootScope', '$q', function($scope, $http, $sce, $rootScope, $q) {

        $scope.invalidLogin = false;
        $scope.user = null;
        $scope.pwd = null;

        $scope.doLogin = function() {
            if ($scope.user && $scope.pwd) {

                window.localStorage.userId = 1;
                window.localStorage.login = $scope.user;
                window.localStorage.username = "UserName";
                window.localStorage.isAuthenticated = true;
                window.location.assign("/eventos");
            } else {
                $scope.invalidLogin = true;
            }
        };

        $scope.createAccount = function() {
            window.location.assign('/eventos/signup.html');
        };
    }]);

App.controller('JoinCtrl', ['$scope', '$http', '$sce', '$rootScope', '$q', function($scope, $http, $sce, $rootScope, $q) {

        $scope.Dto = {
            Name: "",
            SurName: "",
            Email: "",
            Pwd: "",
            PwdConfirmation: "",
        };

        $scope.joinSubmit = function() {
            window.location.assign('/eventos');
        };

        $scope.gotoLogin = function() {
            window.location.assign('/eventos/signin.html');
        };
    }]);

App.controller('ProfileCtrl', ['$scope', '$http', '$sce', '$rootScope', '$q', function($scope, $http, $sce, $rootScope, $q) {

        $scope.Dto = {
            Name: "Alexandre",
            SurName: "Vicenzi",
            Email: "foo@bar.com",
            PhotoUrl: "https://lh5.googleusercontent.com/--fK08SiAPcA/AAAAAAAAAAI/AAAAAAAAABU/7GiuAp4r3RA/s120-c/photo.jpg",
        };

        $scope.Dto.FullName = $scope.Dto.Name + ' ' + $scope.Dto.SurName;

        $scope.joinSubmit = function() {
            window.location.assign('/eventos');
        };

        $scope.getPhoto = function() {
            var src = $scope.Dto.PhotoUrl;
            fetchImage(src);
            return src;
        };
    }]);

App.controller('MyEventsCtrl', ['$scope', '$http', '$sce', '$rootScope', '$q', function($scope, $http, $sce, $rootScope, $q) {
        $scope.UserEvents = [];

        $scope.reload = function() {
            $scope.UserEvents = [
                {
                    Owner: {
                        FullName: "Dick Pirocona Dura",
                        PhotoUrl: "img/covers/jpg/5.jpg",
                        Login: "",
                        Id: 2,
                    },
                    Id: 1,
                    CoverUrl: "img/covers/jpg/1.jpg",
                    Title: "Evento 1",
                    Date: "seg, 14 de julho, 19:00",
                    Location: "Blumenau",
                    Detail: "",
                    Guests: "João Silva, Marcelo Pinto, Kid Bengala e mais",
                    TotalGuests: "151 pessoas vão",
                    Answer: 1,
                    Due: false,
                },
                {
                    Owner: {
                        FullName: "Dick Pirocona Dura",
                        PhotoUrl: "img/covers/jpg/5.jpg",
                        Login: "",
                        Id: 2,
                    },
                    Id: 2,
                    CoverUrl: "img/covers/jpg/2.jpg",
                    Title: "Evento 2",
                    Date: "sex, 27 de junho, 12:00",
                    Location: "Rio do Sul",
                    Detail: "",
                    Guests: "Sasha Gray, Rocco, Kid Bengala e mais",
                    TotalGuests: "300 pessoas foram",
                    Answer: 2,
                    Due: true,
                }, ];
            
            _.each($scope.UserEvents, function(item) {
                item.stList = $rootScope.getEventStatus(item.Due)
                item.Status = _.findWhere($rootScope.getEventStatus(item.Due), {id: item.Answer});
            });
        };

        $scope.updateEventStatus = function(e) {

            var data = {
                UseId: parseInt(window.localStorage.userId),
                EventId: e.Id,
                Answer: e.Status.id,
            };
            console.log(data);
        };

        $('a[href="#myevents"]').on('show.bs.tab', function(e) {
            $scope.reload();
            $scope.$digest();
        });
    }]);

App.controller('FindEventsCtrl', ['$scope', '$http', '$sce', '$rootScope', '$q', function($scope, $http, $sce, $rootScope, $q) {
        $scope.AllEvents = [];

        $scope.reload = function() {

            $scope.AllEvents = [
                {
                    Owner: {
                        FullName: "Dick Piroquinha",
                        PhotoUrl: "img/covers/jpg/1.jpg",
                        Login: "",
                        Id: 1,
                    },
                    Id: 1,
                    CoverUrl: "img/covers/jpg/5.jpg",
                    Title: "Evento 1",
                    Date: "seg, 14 de julho, 19:00",
                    Location: "Blumenau",
                    Detail: "",
                    Guests: "João Silva, Marcelo Pinto, Kid Bengala e mais",
                    TotalGuests: "151 pessoas vão",
                    Answer: 0,
                    Due: false,
                },
                {
                    Owner: {
                        FullName: "Dick Pirocona",
                        PhotoUrl: "img/covers/jpg/2.jpg",
                        Login: "",
                        Id: 2,
                    },
                    Id: 2,
                    CoverUrl: "img/covers/jpg/12.jpg",
                    Title: "Evento 2",
                    Date: "sex, 27 de junho, 12:00",
                    Location: "Rio do Sul",
                    Detail: "",
                    Guests: "Sasha Gray, Rocco, Kid Bengala e mais",
                    TotalGuests: "300 pessoas foram",
                    Answer: 0,
                    Due: true,
                },
                {
                    Owner: {
                        FullName: "Dick Pirocona Dura",
                        PhotoUrl: "img/covers/jpg/5.jpg",
                        Login: "",
                        Id: 2,
                    },
                    Id: 2,
                    CoverUrl: "img/covers/jpg/15.jpg",
                    Title: "Evento 2",
                    Date: "sex, 27 de junho, 12:00",
                    Location: "Rio do Sul",
                    Detail: "",
                    Guests: "Sasha Gray, Rocco, Kid Bengala e mais",
                    TotalGuests: "300 pessoas foram",
                    Answer: 0,
                    Due: true,
                }
            ];
            _.each($scope.AllEvents, function(item) {
                //fetchImage(item.Owner.PhotoUrl);
                item.stList = $rootScope.getEventStatus(item.Due)
                item.Status = _.findWhere($rootScope.getEventStatus(item.Due), {id: item.Answer});
            });
        };

        $scope.updateEventStatus = function(e, status) {

            e.Answer = status;
            var data = {
                UseId: parseInt(window.localStorage.userId),
                EventId: e.Id,
                Answer: status,
            };
            console.log(data);
        };

        $('a[href="#find"]').on('show.bs.tab', function(e) {
            $scope.reload();
            $scope.$digest(); // ou $scope.$apply(function() { $()... });
        });
    }]);

App.controller('NewEventCtrl', ['$scope', '$http', '$sce', '$rootScope', '$q', function($scope, $http, $sce, $rootScope, $q) {

        $scope.reset = function() {
            $scope.Dto = {
                CoverUrl: "",
                Title: "",
                InitialDate: null,
                FinalDate: null,
                Location: "",
                Detail: "",
                Guests: "",
            };
        };

        $scope.reloadCover = function() {
            $scope.src = "img/covers/jpg/" + getRandomInt(1, 30) + ".jpg";
            fetchImage($scope.src);
        };

        $scope.reloadCover();

        $scope.submit = function() {

            console.log($scope.Dto);

            $http({
                method: 'POST',
                url: '/eventos/api/events',
                data: $scope.Dto,
            }).success(function(data, status, headers, config) {
                $rootScope.showAlertBox("Evento cadastrado com sucesso.", "i", true);
                $scope.reset();
            }).error(function(data, status, headers, config) {
                $rootScope.showAlertBox("Erro ao processar request. Código: " + status, "e", true);
            });
        };

        $('a[href="#new"]').on('show.bs.tab', function(e) {
        });
    }]);

App.controller('Ctrl', ['$scope', '$http', '$sce', '$rootScope', '$q', function($scope, $http, $sce, $rootScope, $q) {
    }]);
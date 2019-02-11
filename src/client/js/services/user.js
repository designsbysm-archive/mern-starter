angular.module("MockServer")
  .controller("UsersController", ($scope, $timeout, httpService, notificationService) => {
    $scope.vm = {
      roles: [
        {
          id: "admin",
          name: "Admin",
        },
        {
          id: "super",
          name: "Super",
        },
        {
          id: "tech",
          name: "Tech",
        },
      ],
      types: [
        {
          id: "basic",
          name: "Basic",
        },
        {
          id: "saml",
          name: "SAML",
        },
      ],
      user: {},
      users: [],
    };

    $scope.doUserModal = mode => {
      if (mode === "Update") {
        const update = {
          $set: {
            active: $scope.vm.user.active,
            name: $scope.vm.user.name,
            role: $scope.vm.user.role,
            username: $scope.vm.user.username,
          },
        };

        httpService
          .makeRequest("PUT", `/api/v1/users/${$scope.vm.user._id}`, null, update)
          .then(() => {
            $scope.vm.row.data = $scope.vm.user;
            $("#grid-container")
              .dxDataGrid("instance")
              .repaintRows([ $scope.vm.row.rowIndex ]);
          })
          .catch(err => {
            console.error(err);
            notificationService.create("warning", null, "Unable to update users", true);
          });
      }

      $("#userModal")
        .modal("hide");
    };

    $scope.formatLoginDate = date => {
      if (!date) {
        return "Unknown";
      }

      return moment(date)
        .format("MM/DD/YYYY @ hh:mm:ss A");
    };

    $scope.showUserModal = (mode, user) => {
      $scope.vm.modal = {
        title: mode,
      };

      if (!user) {
        $scope.vm.user = {
          active: true,
          name: {
            first: "",
            last: "",
          },
          role: "tech",
          type: "basic",
          username: "",
        };
      } else {
        $scope.vm.user = user;
      }

      $timeout(() => {
        $("#userModal")
          .modal("show");
      });
    };

    function getUsers() {
      httpService
        .makeRequest("POST", "/api/v1/users/query", null, {
          find: {},
          sort: {
            username: 1,
          },
        })
        .then(res => {
          $scope.vm.users = res;
          displayUsers();
        })
        .catch(err => {
          console.error(err);
          notificationService.create("warning", null, "Unable to get users", true);
        });
    }

    getUsers();

    function displayUsers() {
      $(".grid-container")
        .dxDataGrid({
          columnAutoWidth: true,
          columns: [
            {
              dataField: "_id",
              dataType: "string",
              visible: false,
            },
            {
              dataField: "active",
              dataType: "boolean",
              width: 100,
            },
            {
              dataField: "username",
              dataType: "string",
              sortOrder: "asc",
            },
            {
              dataField: "name.first",
              dataType: "string",
            },
            {
              dataField: "name.last",
              dataType: "string",
            },
            {
              dataField: "role",
              dataType: "string",
              lookup: {
                dataSource: $scope.vm.roles,
                displayExpr: "name",
                valueExpr: "id",
              },
              width: 140,
            },
            {
              dataField: "type",
              dataType: "string",
              lookup: {
                dataSource: $scope.vm.types,
                displayExpr: "name",
                valueExpr: "id",
              },
              width: 140,
            },
          ],
          dataSource: $scope.vm.users,
          filterRow: { visible: true },
          filterSyncEnabled: true,
          filterValue: [
            "active",
            "=",
            true, 
          ],
          onRowClick: e => {
            $scope.vm.row = e;
            $scope.showUserModal("Update", e.data);
          },
          rowAlternationEnabled: true,
          wordWrapEnabled: true,
        });
    }
  });

console.log("signup file loaded");

var signup = angular.module('signup',[]);

signup.controller('signup', function($scope, $filter, $http) {

	//$scope.emailExists = "";
	$scope.isEmailExist = false;
	$scope.isUsernameExist = false;
	console.log("outside submit button");
	$scope.submit = function() {
		
		//Initializing validation variables after clicking the submit button
		$scope.isEmailExist = false;
		$scope.isUsernameExist = false;
		$scope.unexpected_error = false;

		console.log("in submit funtion");
		$scope.emailExists = "";
		console.log("username :: " + $scope.username);
		console.log("email :: " + $scope.email);

		var newUser = [
			{
				"username" : $scope.username,
				"password" : $scope.password,
				"firstname" : $scope.firstname,
				"lastname" : $scope.lastname,
				"email" : $scope.email,
				"gender" : $scope.gender,
				"birthdate" : $filter('date')($scope.birthdate, 'yyyy-MM-dd'),
				"contact" : $scope.contact,
				"location" : $scope.location
			}
		];
		console.log("newUser");
		console.log(newUser);

		$http({
			method : "POST",
			url : '/dosignup',
			data : {
				"newUser" : newUser
			}
		}).success(function(data) {
			
			console.log("data :: " + data);
			//checking the response data for statusCode
			if(data.statusCode == 200) {
				console.log(data);
				/*console.log(data.data);
				console.log("data.data.email :: ");
				console.log(data.data.email);
				console.log("newUser.email :: ");
				console.log(newUser[0].email);

				console.log("data.data.username :: ");
				console.log(data.data.username);
				console.log("newUser.username :: ");
				console.log(newUser[0].username);*/

				/*if(data.data.email == newUser[0].email) {
					
					//debugging
					console.log("data.data.email :: ");
					console.log(data.data.email);
					console.log("newUser.email :: ");
					console.log(newUser[0].email);
					//debugging ends

					$scope.isEmailExist = true;
				}
				else if(data.data.username == newUser[0].username){
					
					//debugging
					console.log("data.data.username :: ");
					console.log(data.data.username);
					console.log("newUser.username :: ");
					console.log(newUser[0].username);
					//debugging ends

					$scope.isUsernameExist = true;
				}*/

				if(data.isEmailExist) {
					if(data.isUsernameExist) {
						$scope.isEmailExist = true;
						$scope.isUsernameExist = true;

					}
					else if(!data.isUsernameExist)
						$scope.isEmailExist = true;
				}else if(!data.isEmailExist) {
					if(data.isUsernameExist) {
						$scope.isUsernameExist = true;
					}
				}

			}
			else if(data.statusCode == 401) {
				console.log("statusCode = 401");
				window.location.assign("/");
			}
			/*if (data.statusCode == 401) {
				$scope.isEmailExist=false;

			}
			else if(emailExist == "true") {
				console.log("EmailExist(true) :: " + emailExist);
				$scope.emailExists = "true";
			} 
			else if(emailExist == "false") {
				console.log("EmailExist(false) :: " + emailExist);
				$scope.emailExists = "";
				console.log("Before doSignUp Calling");
				doSignUp();
				console.log("After doSignUp Calling");
			}*/
		}).error(function(error) {
			$scope.unexpected_error = true;
		});
	};
});